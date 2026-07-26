# AgentFE — lo standard front-end della wiki

Questo documento è la regola. Vale per chiunque aggiunga o modifichi pagine:
persone e modelli linguistici. Se stai per scrivere una pagina nuova, leggi
almeno la sezione **"Aggiungere una pagina in tre passi"** e apri
`_TEMPLATE.dc.html`.

Qui si parla solo di **forma**. Per il contenuto — come si costruisce un libro
che insegna davvero — il documento gemello è [AgentAutore.md](AgentAutore.md).

---

## In una frase

Tutte le pagine sono vestite da un unico foglio di stile (`wiki/wiki.css`) e
animate da un unico script (`wiki/wiki.js`). Le pagine contengono **solo
contenuto**: nessuno stile, nessun colore, nessuno script di impaginazione.

---

## Le cinque regole

1. **Mai `style="..."` nel markup.** Se ti serve qualcosa che non esiste,
   aggiungi una classe a `wiki/wiki.css`; non risolverla inline.
2. **Mai colori scritti a mano.** Usa i modificatori `a-blu`, `a-rosso`,
   `a-verde`, `a-arancio`, `a-viola` o i token `var(--blu)`, `var(--ink)`…
3. **Mai numerare le tappe a mano.** "Tappa 01 ·" lo scrive il foglio di stile.
4. **Mai scrivere indice laterale o barra di progresso.** Li genera `wiki.js`
   leggendo le sezioni della pagina.
5. **Mai copiare script da un'altra pagina.** Tutto il comportamento condiviso
   vive nel connettore.

Il senso di queste regole: il giorno in cui vorrai cambiare l'aspetto
dell'intera wiki, dovrai modificare **un solo file**. Ogni eccezione fatta
oggi è una pagina che quel giorno resterà indietro.

---

## Aggiungere una pagina in tre passi

**Passo 1.** Copia `_TEMPLATE.dc.html` e rinominalo, per esempio
`RAG-e-Agenti.dc.html`. Il nome del file è il titolo con i trattini.

**Passo 2.** Riempi le parti fra `[ parentesi quadre ]`. La struttura non si
tocca: copertina → cosa impari → sommario → tappe `#c1 … #cN` → epilogo
`#fine` → ponte → piede.

**Passo 3.** Aggiungi la pagina a `wiki/wiki-index.js`:

```js
{
  id: "03",
  file: "RAG-e-Agenti.dc.html",
  titolo: "RAG e Agenti",
  sottotitolo: "Dare al modello una memoria e delle mani.",
  icona: "memory",
  accento: "verde",
  stato: "pronto",
  tag: ["6 tappe", "4 demo interattive"],

  // Campi del grafo: è ciò che accende la pagina nel cervello 3D.
  nodo: "sub-1710",                       // dove si aggancia nello scheletro
  concetti: [                             // uno per tappa, id "mNN-slug"
    { id: "m03-retriever", label: "Il recupero" },
    { id: "m03-agente",    label: "L'agente" }
  ],
  collegamenti: [                         // i "ponti" resi dati
    { da: "m03-retriever", a: "m01-embedding", tipo: "approfondisce" }
  ]
}
```

Senza il passo 3 la pagina esiste ma non compare nella Biblioteca. Senza i
campi del grafo (`nodo`, `concetti`, `collegamenti`) compare come card ma resta
**spenta** nel cervello 3D. La procedura completa — dove agganciare e quanto
lunga fare la pagina — è in **[INGEST.md](INGEST.md)** (o la skill
`/biblioteca-ingest`).

Per **una materia nuova** (non un modulo, uno scaffale intero) aggiungi un
blocco al livello superiore dello stesso file:

```js
{
  scaffale: "Statistica",
  descrizione: "Facoltativa: di che parla lo scaffale e in che ordine si legge.",
  moduli: [ … ]
}
```

### Il cervello 3D non è la porta d'ingresso

Nella homepage l'indice (scaffali e card) viene **prima**; il grafo 3D sta in
fondo, dentro `.w-brainwrap`, incorniciato, e si accende quando entra in vista.
Qualunque visualizzazione futura segue la stessa regola: si aggiunge in fondo,
non in cima. Il perché è in
[decisioni/2026-07-26-cervello-secondario-design.md](decisioni/2026-07-26-cervello-secondario-design.md).

---

## Il file dei parametri

`wiki/wiki.css` si apre con un blocco `:root` che contiene tutte le manopole
della wiki. È il posto da cui si cambia l'aspetto di tutto:

| Gruppo | Esempi | Effetto |
|---|---|---|
| Carta e inchiostro | `--paper`, `--ink`, `--rule` | fondo, testo, quadretti |
| Accenti | `--blu`, `--rosso`, `--verde`, `--arancio`, `--viola` | il significato dei colori |
| Quaderno | `--grid-step` | quanto sono fitti i quadretti |
| Tipografia | `--font-mano`, `--font-testo`, `--font-mono`, `--size-base` | i caratteri |
| Forma | `--radius`, `--border`, `--shadow` | angoli, bordi, ombre |
| Ritmo | `--s1 … --s6` | le spaziature |
| Movimento | `--dur`, `--ease` | velocità delle animazioni |
| Icone | `--ico-*` | il disegno di ogni icona |

Subito sotto, il blocco `:root[data-theme="dark"]` ridefinisce **gli stessi
nomi** con i valori del tema scuro. Se aggiungi un colore, aggiungilo in
entrambi i blocchi.

---

## Il significato dei colori

Costante in tutta la wiki. Non usarli per motivi estetici.

| Colore | Significato |
|---|---|
| **inchiostro** | struttura, testo portante |
| **blu** | calcolo, dove avviene la matematica |
| **rosso** | note a margine, avvertimenti, errori frequenti |
| **verde** | memoria, cache, ciò che si conserva |
| **arancio** | interazione, demo, dove entra il caso |
| **viola** | livello esperto |

---

## Le classi

### Impalcatura

| Classe | Uso |
|---|---|
| `w-page` | pagina a colonna singola (la Biblioteca) |
| `w-page--toc` | pagina con indice laterale (tutti i moduli) |
| `w-main` | la colonna di lettura, dentro `w-page--toc` |
| `w-toc` | contenitore dell'indice — **si riempie da solo** |
| `w-nav` + `w-nav-home` `w-nav-sep` `w-nav-here` `w-nav-next` | briciole di pane |
| `w-footer` | piede della pagina |

### Copertina

`w-hero`, `w-hero-kicker`, `w-hero-title`, `w-hero-sub`, `w-hero-sign`, e
`w-mark` per la sottolineatura a pennarello che si disegna all'apertura.

### Tappe

| Classe | Uso |
|---|---|
| `w-tappa` | una sezione di studio; deve avere un `id` (`c1`, `c2`, …) |
| `w-tappa--fine` | l'epilogo: non viene numerato |
| `w-tappa-kicker` | sottotitolo tecnico — il numero lo aggiunge il CSS |
| `w-tappa-title` | titolo della tappa |
| `w-tappa-lead` | frase di apertura in corsivo |
| `w-h3` | sotto-titolo dentro una tappa |
| `w-drop` | paragrafo con capolettera scritto a mano |

### Riquadri

Ognuno ha la sua icona e il suo colore, automatici.

| Classe | Quando usarlo | Icona |
|---|---|---|
| `w-note--info` | orientamento, cosa si impara | bussola |
| `w-note--key` | il concetto da ricordare | chiave |
| `w-note--warn` | errore frequente, trappola | triangolo |
| `w-note--bridge` | rimando a un altro modulo | ponte |
| `w-note--demo` | analogia, spiegazione per immagini | lampadina |
| `w-note--math` | passaggio matematico | compasso |
| `w-note--memory` | cache, memoria, cose che si conservano | cassettiera |
| `w-note--expert` | dettagli per chi è del mestiere | tocco laureato |
| `w-note--paper` | fonti e riferimenti | documento |

Dentro ognuno: `<span class="w-note-title">` per il titolo. **Non mettere
emoji nel titolo**: l'icona la mette il foglio di stile. Le liste dentro un
riquadro sono già impaginate: scrivi `<ul>` o `<ol>` senza toccare i rientri.

### Demo interattive

`w-demo`, `w-demo-title`, `w-demo-hint`, `w-demo-out`, `w-demo-foot`,
`w-label`, `w-btn`. I valori dinamici usano i binding `{{ }}` collegati alla
classe `Component` in fondo al file.

### Codice

| Classe | Uso |
|---|---|
| `code` | codice **dentro** una frase — non serve nessuna classe |
| `w-codice` | listato su più righe: si scrive su `<pre>`, mai a capo automatico |
| `w-codice-nota` | la riga in corsivo che commenta il listato, subito sotto |
| `w-com` | un commento dentro il listato |
| `w-ev` | la riga (o il pezzo) del listato da guardare |

La lingua del listato si dichiara con `data-lang` e la scrive il foglio di
stile: `<pre class="w-codice" data-lang="scheme">`. Non aggiungere markup per
l'etichetta.

### Mattoncini per le demo

Servono a non scrivere `style="..."` dentro una demo: `w-row` (una riga di
elementi) · `w-cell` + `is-on` `is-off` `is-ok` `is-ko` (celle di memoria,
token, valori) · `w-stack` + `w-frame` + `is-top` `is-done` (una pila che
cresce verso l'alto) · `w-prog` + `w-riga` + `is-now` (un programma di cui si
illumina la riga corrente).

### Altro

`w-formula` + `w-formula-note` · `w-summary` + `w-summary-n` +
`w-summary-tag` · `w-card` + `w-card--ghost` + `w-grid` · `w-chip` +
`w-chips` · `w-legend` · `w-table` · `w-figure` · `w-ref`

---

## Le icone

Sono SVG disegnati a mano, incorporati nel foglio di stile: nessuna richiesta
di rete, funzionano anche aprendo la pagina con doppio clic. Prendono da sole
il colore dell'accento e del tema.

Nei riquadri e nelle demo l'icona **è automatica**. Per usarne una nel testo:

```html
<span class="w-ico i-key"></span>
```

Disponibili: `i-orient` `i-key` `i-warn` `i-bridge` `i-demo` `i-formula`
`i-math` `i-book` `i-expert` `i-paper` `i-memory` `i-idea` `i-note` `i-tappa`
`i-arrow` `i-check` `i-moon` `i-sun`.

Per cambiare il disegno di un'icona in tutta la wiki, modifica la riga
`--ico-…` corrispondente in `wiki/wiki.css`. Per aggiungerne una: aggiungi il
token `--ico-nome` e la riga `.i-nome { mask-image: var(--ico-nome); }`.

---

## Il tema scuro

Si attiva con l'attributo `data-theme="dark"` sull'elemento `<html>`, messo da
`wiki.js`. Alla prima visita segue la preferenza del sistema operativo, poi
ricorda la scelta e la sincronizza fra le schede aperte.

**Non si usa il filtro `invert`.** Era la soluzione precedente e aveva due
difetti: gli accenti diventavano colori fluorescenti non scelti da nessuno, e
un elemento con `filter` diventa containing block, il che rompe
`position: sticky` e `position: fixed` dei suoi discendenti — cioè proprio
l'indice laterale e la barra di progresso.

Per lo stesso motivo lo sfondo a quadretti sta sull'elemento `<html>` e non
sul `<body>`: lo sfondo dell'elemento radice viene sempre propagato al canvas
del documento e copre l'intera area scorribile. Messo sul `<body>` funziona
finché l'`<html>` non ha un proprio sfondo; nel momento in cui glielo dai —
come faceva la vecchia modalità notte — il reticolo smette di coprire le
pagine lunghe e resta il nero. **Non spostare quello sfondo sul `body`.**

---

## Le animazioni

Gestite da `wiki.js`: i blocchi che devono ancora entrare dal basso compaiono
in dissolvenza, la voce di indice della tappa corrente si evidenzia, la barra
di progresso segue la lettura, la sottolineatura del titolo si disegna.

Due garanzie da non rompere se metti mano allo script:

- ciò che è **già visibile al caricamento non viene mai nascosto**;
- se l'osservatore non scatta, dopo due secondi si mostra tutto comunque.

Un'animazione non deve mai poter far sparire del contenuto. Con
`prefers-reduced-motion` tutto è statico.

---

## Il telefono è il secondo formato, non un ripiego

Metà della wiki si legge da telefono. Due regole, e la prima non ammette
eccezioni:

1. **Niente può spingere la pagina di lato.** Il corpo non scorre mai in
   orizzontale — è il modo più veloce di far sembrare rotto un sito. Ciò che è
   più largo dello schermo (un listato, il programma di una demo, una tabella
   di confronto) deve scorrere **dentro il proprio riquadro**. Se aggiungi un
   blocco largo, dagli `overflow-x: auto`.
2. **Meno margini, non meno contenuto.** Sotto i 720px si stringono le cornici
   e si scala la tipografia; non si nasconde niente che sul desktop si legga.
   L'unica eccezione storica è l'indice laterale, che sotto i 1080px sparisce
   perché il sommario a inizio pagina fa lo stesso lavoro.

Il blocco `@media` in fondo a `wiki/wiki.css` fa questo lavoro per tutte le
classi standard. Una trappola già pagata: dentro un contenitore che scorre, le
righe di codice devono avere `width: max-content`, altrimenti restano larghe
quanto il riquadro, il testo trabocca fuori dal loro box e **la fine della riga
diventa irraggiungibile** anche se il contenitore scorre.

Sul telefono il canvas del cervello 3D non prende il dito: trascinare deve
scorrere la pagina. Per esplorarlo si apre a schermo intero.

## Come si verifica una pagina

Prima di considerarla finita:

1. aprila nel browser in tema chiaro **e** scuro;
2. scorri fino in fondo: il reticolo deve coprire tutta l'altezza;
3. controlla che l'indice laterale elenchi tutte le tappe e si evidenzi;
4. se ci sono demo, provale davvero;
5. cerca `style="` nel file: dovrebbe comparire solo dentro le demo;
6. **restringi la finestra a 390px** e riscorri: niente deve sporgere.

Il controllo automatico fa i punti 4 e 6 su tutte le pagine, a larghezza di
telefono e di scrivania:

```bash
node strumenti/verifica-pagine.js            # tutte
node strumenti/verifica-pagine.js Nome.dc.html
```

Controlla, in quest'ordine: che la pagina si sia **resa** (c'è testo visibile),
che non restino binding `{{ … }}` sotto gli occhi del lettore, che il corpo non
scorra in orizzontale, e che le demo siano vive.

> Il primo controllo esiste per un errore vero: se il runtime non parte — di
> solito perché manca la rete, che serve al primo caricamento per React — la
> pagina resta piena di markup **invisibile**, e ogni verifica fatta sul
> sorgente passa per finta. Se lo script dice *«PAGINA NON RESA»* su tutte le
> pagine, guarda la rete prima del contenuto.

---

## I file del connettore

| File | Contenuto |
|---|---|
| `wiki/wiki.css` | parametri, tema chiaro e scuro, icone, tutte le classi (incl. il cervello 3D) |
| `wiki/wiki.js` | tema, indice, barra di progresso, animazioni, card, MathJax |
| `wiki/wiki-index.js` | scaffali e moduli + i loro dati di grafo (`nodo`, `concetti`, `collegamenti`) |
| `wiki/graph/skeleton.js` | lo scheletro del sapere: 282 nodi da OpenAlex (una delle due fonti del grafo) |
| `wiki/graph/graph-model.js` | fonde scheletro e moduli nel grafo del cervello (logica pura, testabile) |
| `wiki/graph/explorer.js` | il cervello 3D della homepage (3d-force-graph via CDN) |
| `wiki/graph/valida.js` | controllo di coerenza del grafo: `node wiki/graph/valida.js` |
| `_TEMPLATE.dc.html` | lo scheletro da copiare |
| `support.js` | runtime `dc-runtime` (generato altrove, **non modificare**) |
