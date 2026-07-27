# La navigazione della Biblioteca: sala, scaffale, libro

Data: 2026-07-27
Stato: approvato, da costruire
Sostituisce: le parti sull'esploratore 3D di
[2026-07-20-grafo-cervello-pipeline-design.md](2026-07-20-grafo-cervello-pipeline-design.md)
(il modello dei dati di quel documento resta valido)

## Aggiornamento del 27-07 (sera): i due rami si sono incontrati

Questo documento è stato scritto guardando una biblioteca di due libri. In
parallelo, su un altro ramo, ne erano nati altri sei — lo scaffale «Il pensiero
computazionale» — insieme a una prima mossa nella stessa direzione: il cervello
3D tolto dalla cima della homepage e messo **in fondo**, incorniciato, che si
accende solo quando entra in vista
([decisione del 26-07](2026-07-26-cervello-secondario-design.md)).

Le due linee sono state unite. Cambia il punto di partenza, non la direzione:

- la **fase 2** non deve più sfrattare il grafo dalla home — l'ha già fatto
  quella decisione. Resta da trasformare gli scaffali in oggetti veri, con la
  loro identità (`slug`, `accento`, `descrizione`, ora nei dati);
- la **fase 3** guadagna un secondo scaffale su cui provare la costellazione,
  che è il caso interessante: due materie invece di una;
- l'analisi del problema qui sotto resta valida per il *grafo*, non più per la
  sua posizione nella pagina.

Da quella unione è uscita anche una regola nuova, in `AgentFE.md`: tutto ciò
che si mette **fuori da `<x-dc>`** va misurato a schermo, perché il runtime dà
all'host `height: 100%` e il fratello successivo finisce sopra il contenuto.

## Problema

Il progetto è nato come biblioteca: una raccolta di libri — non spiegazioni, ma
lezioni approfondite — dentro cui muoversi per temi. Il grafo 3D è arrivato dopo,
come elemento grafico. Oggi il grafo non è la navigazione della biblioteca: è un
oggetto che le sta accanto. Quattro sintomi, tutti verificabili nel codice.

**1. Due navigazioni, nessuna autorevole.** In `Biblioteca.dc.html:32` il
`#wiki-brain` è alto `92vh` e sta *sopra* `<x-dc>`: si scorre il cervello per
arrivare alle card, che sono l'indice vero. Chi apre la home trova la stessa
informazione due volte, in due linguaggi visivi diversi — e il cervello ha font e
colori scritti a mano (`wiki.css:582-630`: `#7EA6F0`, `#10162a`, `#B9C0D4`…),
cioè proprio ciò che il divieto n. 2 di `AGENTS.md` esclude. Il distacco che si
percepisce nasce da qui, non dal fatto che il grafo sia tridimensionale.

**2. Il grafo mostra l'universo sbagliato.** 282 nodi OpenAlex, di cui una
ventina accesi. Per raggiungere due libri si attraversano Odontoiatria, Soil
Science, Veterinaria. Lo scheletro doveva comunicare *spazio per crescere*; in
pratica comunica *vuoto*, e rende introvabile ciò che esiste. Una biblioteca non
espone la classificazione universale: espone gli scaffali che ha.

**3. Il grafo non ha semantica di lettura.** Quasi tutti gli archi sono
`genitore → figlio` di una tassonomia importata. Le relazioni che servono a chi
studia — *prima questo, poi quello*, *questo approfondisce quello* — sono i
`collegamenti`, e oggi sono **quattro**, disegnati come fili sottili in mezzo a
282 nodi. Il grafo mostra una **classificazione**; a chi naviga serve un
**percorso**.

**4. I libri divergono perché la forma è descritta, non verificata.**
`Dentro-la-Macchina` ha 3 `w-drop`, 29 `w-ref` e un `w-note--bridge`;
`Fondamenti-Matematici-LLM` ne ha rispettivamente 0, 4 e nessuno.
`AgentAutore.md` è il ragionamento giusto, ma nessuno controlla che sia seguito:
ogni libro nuovo può derivare un po' di più dal precedente, e la deriva non si
nota finché non si mettono i file uno accanto all'altro.

## L'osservazione da cui parte tutto

I `concetti` dichiarati in `wiki-index.js` **sono già le tappe dei libri, uno a
uno, nello stesso ordine**: il Modulo 01 ha 9 concetti e 9 sezioni `#c1…#c9`; il
Modulo 02 ne ha 7 e 7. La corrispondenza esiste già nei dati — semplicemente non
è mai stata agganciata. Oggi cliccare *KV Cache* nel cervello apre il file
dall'inizio.

Legare ogni concetto alla sua àncora (`Dentro-la-Macchina.dc.html#c4`) cambia la
natura dell'oggetto: il grafo smette di essere una mappa dei titoli e diventa
**l'indice generale della biblioteca**, al livello del paragrafo. È questo che
salda grafo e interfaccia, più di qualunque restyling.

## Visione: tre livelli, una metafora

```
SALA        la biblioteca: gli scaffali come oggetti. Nessun grafo.
  └─ SCAFFALE   una materia: la sua costellazione. 15-60 nodi, non 282.
       └─ LIBRO   la lezione. La costellazione resta come mini-mappa.
```

Un solo principio: **a ogni livello c'è una sola navigazione**, e il grafo appare
alla scala in cui è leggibile. Il grafo non è un posto dove si va: è lo strato con
cui ci si muove, presente dal secondo livello in poi.

### Livello 1 — La sala · `Biblioteca.dc.html`

Via il cervello dalla home. Restano gli scaffali, resi come oggetti fisici:
pochi, grandi, ognuno col colore della sua materia, ognuno che dichiara quanti
libri contiene, quante tappe complessive, quanti libri aspetta. Statica, veloce,
leggibile senza WebGL e senza rete — è la pagina che qualcuno apre per la prima
volta.

Uno scaffale è già la struttura di primo livello di `wiki-index.js`: qui diventa
anche l'unità di navigazione, e non solo un titolo sopra una griglia di card.

### Livello 2 — Lo scaffale · vista `#scaffale=<slug>`

Aprire uno scaffale non carica un'altra pagina: cambia la vista dentro
`Biblioteca.dc.html` via `hashchange` (`#scaffale=llm`). Nessuna build, nessun
`fetch`, URL condivisibile, tasto Indietro funzionante, tutto valido anche
aprendo il file con doppio clic da `file://`.

La vista mostra **la costellazione di quella materia soltanto**:

| Nodo | Cos'è | Aspetto |
|---|---|---|
| scaffale | il centro | grande, col colore della materia |
| libro | un modulo `pronto` | medio, etichettato, apre il `.dc.html` |
| libro previsto | un modulo senza file | tratteggiato, spento, non cliccabile |
| concetto | una tappa | piccolo, apre il libro **alla sua tappa** |

Gli archi portano il significato che oggi manca:

- **struttura** (scaffale → libro → concetto): tenui, sono l'ossatura;
- **prerequisito**: orientato, marcato — è l'ordine di lettura, e si *vede*;
- **approfondisce** e **collegato**: i ponti fra materie, oggi scritti in prosa
  dentro i `w-note--bridge` e quindi invisibili alla navigazione.

A questa scala — decine di nodi, non centinaia — un grafo è finalmente uno
strumento: si leggono tutte le etichette, si clicca con precisione, si capisce da
dove cominciare.

### Livello 3 — Il libro · i `.dc.html`

Il libro non cambia: struttura, tappe e demo restano quelli. Cambia il contorno:
nella colonna dell'indice (`w-toc`, che già esiste ed è già generato da
`wiki.js`) compare la **mini-mappa** dello scaffale, con il nodo della tappa
corrente evidenziato — l'evidenziazione riusa lo scroll-spy che `wiki.js` fa già
per l'indice. Mentre leggi vedi dove sei nella materia e dove portano i ponti.

## Decisioni tecniche

### Il grafo è 2D

Per navigare, il 2D è migliore: tutte le etichette leggibili contemporaneamente,
clic precisi, funziona sul telefono, si annida in una colonna laterale. Si usa
**`force-graph`** (canvas 2D, stesso autore e stessa API di `3d-force-graph`,
stesso caricamento da CDN, nessuna build).

L'atmosfera che dava il 3D non si perde: resta come fondale della vista scaffale
(la nebulosa è già CSS, `wiki.css:582-586`), non come strato su cui si clicca.

### I colori vengono dai token, anche dentro il canvas

Un canvas ha bisogno di valori, non di classi — ed è così che sono nati i colori
scritti a mano di oggi. La soluzione: leggere i token a runtime,

```js
getComputedStyle(document.documentElement).getPropertyValue('--blu')
```

e rileggerli quando cambia `data-theme`. Il grafo segue il tema chiaro/scuro come
tutto il resto, e il divieto «mai colori scritti a mano» torna a valere ovunque.

### Lo scheletro OpenAlex smette di essere disegnato

`wiki/graph/skeleton.js` resta, e resta il campo `nodo` di ogni modulo: dire dove
si colloca un libro nel quadro del sapere è un metadato utile — serve a scegliere
lo scaffale giusto, a scoprire vicinanze, e servirà quando le materie saranno
molte. Ma **non è più la navigazione**: 277 nodi spenti non si disegnano.

Nella sala compare al massimo come una riga sotto lo scaffale («Informatica ›
Intelligenza Artificiale»), cioè come provenienza, non come mappa.

### `explorer.js` va in pensione

Nessuna pagina lo caricherà più. Il file resta nel repository (la decisione è
reversibile e il codice di proiezione delle etichette è buono), ma esce dal
percorso critico: due navigazioni erano il problema, e tenerne una "solo per
un'altra pagina" lo riproporrebbe più in piccolo.

## Il modello dei dati

`wiki/wiki-index.js` resta l'unica fonte di ciò che esiste. Tre aggiunte, tutte
retrocompatibili — un modulo senza i campi nuovi continua a funzionare:

**1. Lo scaffale diventa un oggetto con identità.**

```js
{
  scaffale: "Large Language Models",
  slug: "llm",                 // la vista: Biblioteca.dc.html#scaffale=llm
  accento: "rosso",            // il colore della materia
  descrizione: "Come pensano, davvero, le macchine che scrivono.",
  moduli: [ … ]
}
```

**2. Ogni concetto dichiara la sua tappa.**

```js
concetti: [
  { id: "m01-tokenizer", label: "Tokenizer",  tappa: "c1" },
  { id: "m01-kv-cache",  label: "KV Cache",   tappa: "c4" }
]
```

Il campo `tappa` è l'àncora dentro il file. È ciò che rende il grafo un indice al
livello del paragrafo; è anche l'invariante che `verifica.js` controlla, così la
corrispondenza non può rompersi in silenzio.

**3. `collegamenti` diventa il modo normale di dichiarare un ponte.** Ogni
`w-note--bridge` scritto in prosa dovrebbe avere il suo arco nei dati. La prosa
spiega il ponte al lettore; l'arco lo rende percorribile.

## Il contratto dei libri · `wiki/verifica.js`

I libri divergono perché la loro forma è raccontata in un documento e non
controllata da niente. `node wiki/verifica.js` la controlla, senza dipendenze,
coerente con lo zero-build del progetto. Due severità: **errori** (rompono la
navigazione o le regole non negoziabili) e **avvisi** (segnali di deriva).

Errori:

- il modulo dichiarato in `wiki-index.js` ha il file, e il file esiste;
- tappe `#c1…#cN` consecutive, più `#fine`;
- tanti `concetti` quante tappe, nello stesso ordine, e ogni `tappa` dichiarata
  esiste davvero come `id` nel file;
- nessun `style="` fuori dai blocchi demo, nessun colore esadecimale nel markup;
- nessun `collegamenti` che punti a un id inesistente (già in `graph-model.js`,
  qui unificato).

Avvisi:

- manca la copertina, il riquadro «cosa impari», il `w-summary`, il ponte finale
  o il piede;
- una tappa senza `w-tappa-lead` (principio 1 di `AgentAutore.md`: mai aprire con
  una definizione);
- nessun `w-note--paper` in tutto il libro (principio 4: le affermazioni forti si
  ancorano);
- più di due `w-note--expert` nella stessa tappa (il senso della misura).

Gli avvisi non bloccano: dicono dove guardare. Il giudizio resta di chi scrive —
ma smette di essere l'unica cosa che tiene insieme la biblioteca.

## Non obiettivi

- Non si tocca `support.js`.
- Nessuna build: le pagine restano apribili con doppio clic.
- Non si riscrive la prosa dei due libri esistenti. Si aggiungono le àncore
  `tappa` ai loro concetti e si colmano le lacune che `verifica.js` segnala come
  errori; gli avvisi si valutano uno per uno.
- Non si costruisce un backend, non si aggiunge un router, non si introduce un
  framework: `hashchange` e due file di dati.

## Fasi

| Fase | Cosa | Perché in quest'ordine |
|---|---|---|
| **1 — Il contratto** | `verifica.js`, campo `tappa`, `slug`/`accento`/`descrizione` sugli scaffali | Il grafo ha senso solo se i dati che legge sono garantiti |
| **2 — La sala** | home come scaffali-oggetto, via il `#wiki-brain` | Rimuove la doppia navigazione: da qui c'è una porta sola |
| **3 — Lo scaffale** | vista `#scaffale=`, costellazione 2D con i colori dai token | Il pezzo nuovo: il grafo diventa la navigazione |
| **4 — La mini-mappa** | costellazione nel `w-toc` del libro, agganciata allo scroll-spy | Chiude il cerchio: il grafo è uno strato, non un luogo |

Ogni fase lascia la biblioteca funzionante e visitabile. La 1 non cambia nulla
all'aspetto; la 2 è già un miglioramento da sola; la 3 e la 4 si possono valutare
dal vivo prima di procedere.

## Verifica

- `node wiki/graph/valida.js` e `node wiki/verifica.js` puliti;
- la sala si apre e si legge senza WebGL e senza rete;
- da uno scaffale si raggiunge un libro in due clic, e una tappa specifica in
  tre;
- il tasto Indietro riporta dalla costellazione alla sala;
- tema chiaro e scuro: nessun colore fuori dai token, canvas compreso;
- su schermo stretto la costellazione resta usabile (o si degrada in elenco);
- nessun binding `{{ }}` irrisolto nelle pagine toccate.

## Rischi

| Rischio | Mitigazione |
|---|---|
| La costellazione diventa illeggibile quando uno scaffale cresce | I concetti si rivelano al clic sul libro, non tutti insieme; la soglia si valuta sui dati veri |
| `force-graph` non carica (offline, `file://` senza rete) | La vista scaffale degrada in elenco di libri e tappe: stessa informazione, senza grafo |
| Il campo `tappa` va fuori sincrono rinominando le sezioni | È un **errore** di `verifica.js`, non un avviso |
| Il grafo su telefono resta scomodo anche in 2D | Sotto una soglia di larghezza la vista scaffale parte in elenco, col grafo su richiesta |
| Perdere l'effetto scenografico del 3D | La nebulosa e il moto restano nella vista scaffale; il 3D era il fondale, non la funzione |
