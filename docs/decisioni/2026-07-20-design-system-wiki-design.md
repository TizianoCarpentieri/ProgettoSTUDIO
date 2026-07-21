# Design system condiviso per la wiki di studio

Data: 2026-07-20
Stato: approvato, pronto per il piano di implementazione

## Problema

Il progetto è una wiki di studio destinata a crescere di molte tematiche nel tempo, ma oggi non ha nessun livello condiviso:

1. **Nessun design system.** Le tre pagine (`Biblioteca.dc.html`, `Dentro-la-Macchina.dc.html`, `Fondamenti-Matematici-LLM.dc.html`) usano stili inline al 100%: ogni elemento porta il suo `style="..."`. Non esiste un posto dove cambiare l'aspetto della wiki.
2. **Bug in modalità notturna.** Sulle pagine lunghe lo sfondo a quadretti sparisce e resta nero.
3. **Struttura divergente.** Il Modulo 01 ha barra di progresso (`#progbar`) e indice laterale (`<aside id="sidetoc">`); il Modulo 02 non li ha; la Biblioteca ha un terzo layout ancora diverso.
4. **Codice duplicato.** Lo script della modalità notte è ripetuto identico in tre file.
5. **Grafica statica.** Nessuna animazione, nessun sistema di icone.

Conseguenza: aggiungere una tematica nuova significa oggi copiare a mano centinaia di stili inline e sperare di ricordarsi le convenzioni. Non è ripetibile.

## Obiettivo

Un "connettore" condiviso che governi tutte le pagine, tale che:

- **un solo file di parametri** controlli colori, font, spaziature, icone e animazioni dell'intera wiki;
- **aggiungere una tematica** sia una procedura meccanica, eseguibile da qualsiasi sviluppatore o LLM senza conoscere il progetto;
- il tema scuro funzioni correttamente su qualsiasi lunghezza di pagina;
- la grafica sia curata e animata, senza dipendenze esterne.

### Non obiettivi

- Non si tocca `support.js` (runtime `dc-runtime` compilato, sorgente non disponibile in questa cartella).
- Non si introduce nessuna build step: le pagine devono restare apribili con doppio clic da `file://`.
- Non si riscrive il contenuto testuale né la logica delle demo interattive: cambia solo come sono vestite.
- Non si crea il Modulo 03: resta un segnaposto dichiarato.

## Causa radice del bug notturno

Lo script attuale, presente in tutti e tre i file, fa:

```js
document.documentElement.style.background = on ? '#0e0d0b' : '';
document.body.style.filter = on ? 'invert(1) hue-rotate(180deg)' : '';
```

Due difetti che si sommano:

1. Lo sfondo del `<body>` (colore carta + reticolo a quadretti) si propaga al canvas del documento — e quindi copre l'intera altezza della finestra — **solo finché l'`<html>` non ha un proprio sfondo**. Assegnando un background all'`<html>` la propagazione si interrompe: il reticolo viene disegnato solo sul box del `<body>`, e tutto ciò che sta oltre resta del nero dell'`<html>`. Il difetto si nota sulle pagine lunghe, dove l'area scoperta è ampia.
2. `filter` su un elemento ne fa un containing block per i discendenti `position: fixed`, e interferisce con `position: sticky`: è una fonte permanente di problemi per l'indice laterale e la barra di progresso.

Il fix è strutturale, non un aggiustamento: si elimina il filtro e si passa a un vero tema scuro a token.

## Architettura

### File nuovi

| File | Ruolo |
|---|---|
| `wiki/wiki.css` | Il design system: blocco parametri, tema chiaro e scuro, set icone, classi componente. |
| `wiki/wiki.js` | Comportamenti condivisi: tema, indice, progresso, animazioni, card della Biblioteca, MathJax. |
| `wiki/wiki-index.js` | Manifest dichiarativo di scaffali e moduli. |
| `_TEMPLATE.dc.html` | Scheletro da copiare per ogni pagina nuova. |
| `AgentFE.md` | Lo standard front-end: come è fatto il sistema e come si aggiunge una pagina. Documento di riferimento per sviluppatori e LLM. |
| `INDEX.md` | Indice di tutta la documentazione `.md` del progetto. |

### Aggancio, identico su ogni pagina

Tre righe fisse nell'`<head>` reale (non dentro `<helmet>`, così restano HTML standard e indipendenti dal runtime):

```html
<link rel="stylesheet" href="./wiki/wiki.css">
<script src="./support.js"></script>
<script defer src="./wiki/wiki.js"></script>
```

La Biblioteca aggiunge `wiki-index.js` prima di `wiki.js`. Le pagine con formule aggiungono lo script MathJax: la sua configurazione vive in `wiki.js`, non più duplicata pagina per pagina.

### `wiki/wiki.css`

Quattro strati, in quest'ordine.

**Strato 1 — Blocco parametri.** Un unico `:root` commentato in cima al file. È la "pagina dei parametri" richiesta: modificarlo cambia l'intera wiki.

- colori: `--paper`, `--paper-raised`, `--ink`, `--ink-soft`, `--rule`, `--accent`, e la tavolozza `--blu --rosso --verde --arancio`
- carta: `--grid-step` (passo dei quadretti), `--grid-line`
- tipografia: `--font-mano` (Caveat), `--font-testo` (Literata), `--font-mono` (IBM Plex Mono), scala dimensioni
- forma: `--radius`, `--border`, `--shadow-solid`
- ritmo: scala di spaziature `--s1 … --s6`
- moto: `--dur-fast`, `--dur`, `--ease`
- icone: token `--ico-*` (vedi sotto)

**Strato 2 — Tema scuro.** `:root[data-theme="dark"]` ridefinisce gli **stessi nomi** con valori scelti a mano. Nessun `filter`, nessuna inversione: gli accenti restano colori decisi da noi, leggibili su fondo scuro. Colore carta e reticolo vivono sull'`<html>`, che copre sempre l'intero canvas a qualsiasi lunghezza di pagina — il bug non può ripresentarsi.

**Strato 3 — Elementi base.** `html`, `body`, link, titoli, `input[type=range]`, `mjx-container`, e il blocco `@media (prefers-reduced-motion: reduce)` che disattiva ogni animazione.

**Strato 4 — Classi componente**, prefisso `w-`. È il vocabolario obbligatorio per ogni pagina:

| Ruolo | Classe |
|---|---|
| Colonna di lettura / colonna con indice | `.w-page`, `.w-page--toc`, `.w-main` |
| Barra briciole di pane | `.w-nav`, `.w-nav-home`, `.w-nav-next` |
| Copertina | `.w-hero`, `.w-hero-kicker`, `.w-hero-title`, `.w-mark`, `.w-hero-sub`, `.w-hero-sign` |
| Indice laterale, barra progresso | `.w-toc`, `.w-progress` *(entrambe popolate da `wiki.js`)* |
| Tappa di studio | `section.w-tappa`, `.w-tappa-num`, `.w-tappa-title`, `.w-tappa-lead` |
| Riquadri | `.w-note` + `--info` `--key` `--warn` `--bridge` `--math` |
| Card e griglie | `.w-card`, `.w-card--ghost`, `.w-grid` |
| Demo interattive | `.w-demo`, `.w-demo-title`, `.w-controls`, `.w-bar` |
| Dettagli | `.w-formula`, `.w-chip`, `.w-chips`, `.w-legend`, `.w-footer` |
| Accento locale | `.a-blu`, `.a-rosso`, `.a-verde`, `.a-arancio` |

I modificatori di accento impostano `--accent` sul sottoalbero: card, riquadri, etichette e icone si colorano di conseguenza senza altri interventi.

### Set di icone su misura

Nessuna emoji, nessuna icon-font, nessuna richiesta di rete.

- ~14 icone SVG disegnate a mano nello stile **tratto a penna irregolare**: spessore 2, estremità arrotondate, linee volutamente non perfette, coerenti con i bordi 2px e i titoli in Caveat.
- Ogni icona è un token `--ico-*` in formato data-URI dentro il blocco parametri.
- Applicazione via `mask-image` più `background-color: var(--accent)`: **l'icona eredita il colore dell'accento e del tema**, quindi funziona in chiaro e in scuro senza varianti duplicate.
- Copertura minima: orientamento, concetto chiave, trappola, ponte, demo, formula, matematica, tappa, libro, freccia, luna, sole, cerca, spunta.

Cambiare l'icona di *tutti* i riquadri di un tipo nella wiki resta la modifica di una riga.

### `wiki/wiki.js`

Un solo file per tutte le pagine, in sostituzione dei tre script duplicati. Sei responsabilità, ognuna isolata in una funzione che **non fa nulla se gli elementi che le competono non esistono** — così lo stesso file è sicuro su qualsiasi pagina, comprese quelle future.

1. **Tema.** Legge `localStorage['wiki-theme']`; al primo avvio segue `prefers-color-scheme`. Applica `data-theme` sull'`<html>`, costruisce il pulsante fisso, si sincronizza tra schede aperte tramite l'evento `storage`.
2. **Indice laterale.** Legge tutte le `section.w-tappa` della pagina, ne ricava numero e titolo, popola `.w-toc` ed evidenzia la tappa corrente durante lo scorrimento.
3. **Barra di progresso** di lettura.
4. **Comparsa allo scroll.** `IntersectionObserver` che rivela i blocchi in dissolvenza e scorrimento; disattivata sotto `prefers-reduced-motion`.
5. **Card della Biblioteca.** Se la pagina espone il contenitore dello scaffale e `window.WIKI_INDEX` è presente, genera scaffali e card dal manifest.
6. **Configurazione MathJax**, centralizzata.

L'indice si costruisce **dal DOM della pagina**, non dal manifest: il contenuto di una pagina resta descritto in un solo file.

### `wiki/wiki-index.js`

Manifest dichiarativo, unica fonte di verità per la homepage:

```js
window.WIKI_INDEX = [
  { scaffale: "Large Language Models", moduli: [
    { id:"01", file:"Dentro-la-Macchina.dc.html", titolo:"Dentro la Macchina",
      sottotitolo:"…", icona:"tappa", accento:"rosso", stato:"pronto",
      tag:["9 tappe","5 demo interattive"] }
  ]}
];
```

Campi: `id`, `file`, `titolo`, `sottotitolo`, `icona` (nome di un token `--ico-*`), `accento` (`blu|rosso|verde|arancio`), `stato` (`pronto|bozza|previsto`), `tag` (array). Lo stato `previsto` produce automaticamente la card tratteggiata, che oggi è scritta a mano.

### Struttura canonica di una pagina-tematica

Obbligatoria e identica per ogni argomento, LLM o matematica che sia:

1. `<head>` con le tre righe fisse
2. `nav.w-nav` — briciole di pane
3. `header.w-hero` — copertina
4. `.w-note--info` "cosa impari qui" e legenda
5. `section.w-tappa` con `id="c1" … "cN"` — le tappe di studio
6. `section.w-tappa id="fine"` — sintesi
7. `.w-note--bridge` — rimandi ai moduli collegati
8. `footer.w-footer`

Indice laterale e barra di progresso **non si scrivono**: `wiki.js` li genera. Il Modulo 02 li acquisisce così senza lavoro dedicato, chiudendo la divergenza strutturale.

### Procedura di ingestion

1. copiare `_TEMPLATE.dc.html` con il nome della nuova tematica;
2. compilare copertina e tappe usando solo le classi `w-`;
3. aggiungere la voce al manifest `wiki/wiki-index.js`.

Nessun altro passo, per nessuna tematica. La procedura è scritta per esteso in `AgentFE.md`.

## Documentazione

- **`AgentFE.md`** — lo standard front-end. Contiene: architettura del connettore, tabella completa delle classi con esempio di markup per ognuna, elenco delle icone con il loro significato, spiegazione del blocco parametri, la procedura di ingestion passo-passo, e le regole da non violare (niente stili inline per la cornice, niente colori scritti a mano, niente script di tema per pagina). Scritto per essere seguito alla lettera anche da un LLM che non conosce il progetto.
- **`INDEX.md`** — indice della documentazione: `README.md` (vetrina), `OVERVIEW.md` (mappa tecnica), `AgentFE.md` (standard front-end), e gli spec sotto `docs/superpowers/specs/`. Una riga per documento, con la domanda a cui risponde.
- **`OVERVIEW.md`** — aggiornato: nuova mappa dei file, correzioni 1, 2 e 5 segnate come risolte.

## Verifica

Non si dichiara nulla completato senza prove:

- le tre pagine aperte nel browser, in tema chiaro e scuro;
- controllo specifico del bug: pagina lunga in tema scuro, scorrimento fino in fondo, il reticolo deve coprire tutta l'altezza;
- indice laterale e barra di progresso presenti e funzionanti su **entrambi** i moduli;
- demo interattive ancora funzionanti dopo la conversione delle classi (tokenizzatore, slider temperatura, KV cache, speculative decoding);
- verifica con movimento ridotto attivo;
- screenshot allegati alla consegna.

## Rischi

| Rischio | Mitigazione |
|---|---|
| La conversione da inline a classi rompe una demo interattiva | Convertire un file alla volta, verificando le demo nel browser prima di passare al successivo. Il markup delle demo dipende dai binding `{{ }}` del runtime: si toccano solo gli attributi `style`, mai i binding. |
| `<helmet data-dc-atomics>` potrebbe interferire con risorse esterne | Le tre righe fisse vanno nell'`<head>` reale, fuori dal controllo del runtime. |
| Il tema scuro a mano peggiora il contrasto di qualche accento | Scegliere i valori scuri verificando il contrasto sui riquadri reali, non a occhio sul solo token. |
| Il progetto perde la sua identità grafica | Le animazioni amplificano l'estetica esistente (quaderno, ombre solide, scritto a mano); non la sostituiscono. |
