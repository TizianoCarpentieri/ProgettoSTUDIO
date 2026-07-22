# Il cervello del sapere: grafo, esploratore 3D e pipeline di ingestione

Data: 2026-07-20
Stato: approvato, in costruzione

## Problema

La wiki ha un design system condiviso (vedi lo spec precedente), ma per crescere
davvero le manca l'ossatura:

1. **Nessun grafo.** I moduli sono file isolati. I rimandi fra pagine (i box
   "ponte") sono scritti a mano, uno per uno: non esiste una struttura che
   dica *come sono collegati* gli argomenti, né dove si colloca un tema nel
   quadro del sapere.
2. **Creare una pagina è un lavoro artigianale.** Si copia `_TEMPLATE.dc.html`
   e si riempie a mano, decidendo a occhio profondità e lunghezza. Nessun
   processo ripetibile che parta da un'idea o da delle fonti.
3. **La homepage è un elenco.** Bella, ma statica: non trasmette che questa è
   una mappa del sapere in crescita.

## Visione

Un **cervello del sapere**: uno scheletro di tutta la conoscenza umana, già
mappato, in cui i rami che non abbiamo ancora scritto esistono comunque —
**visibili ma spenti** — e si **illuminano** quando un modulo li ingerisce. La
homepage diventa questo cervello: un grafo 3D che si esplora ramo per ramo,
vola sul nodo scelto e, dove c'è contenuto, apre la pagina.

Le quattro richieste sono una sola catena:

```
GRAFO  (la struttura che collega ogni argomento)
  ├─ PIPELINE  legge il grafo per posizionare e dimensionare la pagina nuova
  ├─ DESIGN riproducibile  = la pipeline produce markup già a norma
  └─ ESPLORATORE 3D  = il grafo, reso vivo
```

## Non obiettivi

- Non si tocca `support.js` (runtime compilato, sorgente non disponibile).
- Nessuna build step: le pagine restano apribili con doppio clic da `file://`.
- Non si riscrivono i contenuti dei moduli esistenti: si aggiungono metadati di
  grafo, non si cambia la prosa.
- Non si costruisce un backend: il grafo è dati statici serviti come file.

## Architettura

Tutto ruota su **un artefatto nuovo — il grafo** — con un principio guida:
**due sole fonti di verità, entrambe caricate via `<script>`** (mai `fetch`,
che si rompe aprendo da `file://` per la politica CORS su origine `null`).

### Fonte 1 — lo scheletro universale · `wiki/graph/skeleton.js`

`window.WIKI_SKELETON`: la mappa del sapere, **derivata dalla gerarchia Topics
di OpenAlex** (licenza CC0): 4 domini → 26 campi → 252 sottocampi = **282 nodi**.
Non è scritto a mano — è generato una volta dalle API OpenAlex e committato come
dato statico (come `support.js` è generato altrove). Etichette italiane per i 30
nodi di vertice e per i sottocampi dei rami oggi illuminati; gli altri restano in
inglese finché non arriva contenuto.

Nodo: `{ id, label, level: "dominio"|"campo"|"sottocampo", parent }`.

Questo è lo strato "sempre visibile ma per lo più spento": la breadth del sapere.

### Fonte 2 — ciò che abbiamo scritto · `wiki/wiki-index.js` (esteso)

Il manifest già esistente dei moduli, arricchito di tre campi per modulo:

- `nodo`: l'id di skeleton a cui il modulo si **aggancia** (lo accende).
- `concetti`: `[{ id, label }]` — i nodi interni del modulo (le sue tappe:
  tokenizer, embedding, softmax…). Sono la "materia" che riempie il ramo.
- `collegamenti`: `[{ da, a, tipo }]` — gli archi in più (correlazioni fra un
  concetto e un altro modulo/concetto, i "ponti" resi dati anziché prosa).
  `tipo`: `"prerequisito" | "approfondisce" | "collegato"`.

Perché qui e non in un manifesto per pagina: un terzo file per pagina, caricato
via `fetch`, si romperebbe su `file://`. Tenere questi dati in `wiki-index.js`
(già `<script>`) li rende sicuri ovunque, e la **pipeline** genera insieme la
pagina e la sua voce di manifest, così non divergono.

### Il modello · `wiki/graph/graph-model.js`

Una funzione pura `costruisciGrafo(skeleton, index)` → `{ nodes, links }`:

- fonde i due strati in un unico grafo per l'esploratore;
- marca ogni nodo `pieno` (c'è un modulo o è un suo concetto) o `vuoto`;
- calcola per ogni nodo il **dominio radice** risalendo i `parent`, da cui
  l'esploratore prende il colore (uno dei 4 accenti del design system);
- non conosce three.js né il DOM: è logica testabile da riga di comando con
  Node, senza framework di test (coerente con lo zero-build).

Mappa dominio → accento: Scienze Fisiche → blu, Scienze della Vita → verde,
Scienze Sociali → arancio, Scienze della Salute → rosso. (viola resta al
"livello esperto" dei riquadri.)

### L'esploratore 3D · `wiki/graph/explorer.js`

Il cervello vivo, costruito su **`3d-force-graph`** (three.js + d3-force) via
CDN — stesso schema di React/MathJax, nessuna build. Comportamento:

- parte mostrando i **domini** (+ i campi); si **espande ramo per ramo** al
  click su un nodo, rivelando i figli — questo è lo "spandibile" richiesto;
- nodi **vuoti** fiochi e traslucidi; nodi **pieni** luminosi, col colore del
  dominio; il click su un nodo pieno con pagina **vola** e poi **apre** il
  `.dc.html`;
- rispetta `prefers-reduced-motion`: niente auto-rotazione, moto minimo.

### Aggancio nella home · `Biblioteca.dc.html`

Il canvas del cervello si monta in un `<div id="wiki-brain">` **fratello di
`<x-dc>`**, non dentro. Motivo tecnico verificato in `support.js:168`: il
runtime fa `dc.replaceWith(hostEl)`, sostituendo **solo** `<x-dc>`; i fratelli
nel `<body>` non vengono toccati da React. Così il cervello e il contenuto
renderizzato dal runtime convivono senza conflitti.

**Potenziamento progressivo, non sostituzione.** Le card della Biblioteca
restano sotto come indice lineare e **fallback**: senza WebGL, senza rete, o con
movimento ridotto, l'esperienza resta completa. Un'animazione non può mai
nascondere contenuto — regola già del progetto.

## La pipeline di ingestione

Dall'idea (o dalle fonti) alla pagina pubblicata e agganciata al grafo. Vive
come **documento** (fonte di verità dei passi, seguibile da chiunque) più una
**skill di Claude Code** che lo automatizza. Sei passi:

1. **Intake.** Cosa si vuole creare? Un'idea in una frase, o un insieme di
   fonti (paper, appunti, link).
2. **Posizionamento nel grafo.** In quale dominio/campo/sottocampo cade? Si
   sceglie il nodo di skeleton di aggancio (o se ne aggiunge uno se manca).
   Si individuano i moduli vicini già scritti, per i collegamenti.
3. **Profondità e lunghezza.** Si decide la scala in base al materiale:
   - **con fonti**: si stima dalla quantità e densità delle fonti;
   - **senza fonti** (conoscenza generale): si sceglie un livello target
     (panoramica / standard / approfondito) e il numero di tappe conseguente.
4. **Bozza a norma.** Si genera la pagina copiando `_TEMPLATE.dc.html`, usando
   solo le classi `w-*`, con copertina, tappe `#c1…#cN`, epilogo, ponti.
5. **Aggancio al grafo.** Si aggiunge la voce a `wiki-index.js` con `nodo`,
   `concetti`, `collegamenti`. Da qui il modulo si accende nel cervello.
6. **Verifica.** Tema chiaro/scuro, reticolo su pagina lunga, indice laterale,
   demo funzionanti, nessun binding `{{ }}` irrisolto, il nodo appare acceso.

La riproducibilità grafica è un **effetto** di questo processo: la pipeline
produce markup già conforme, quindi creare una pagina non è più artigianato.

## Fasi

| Fase | Cosa | Perché in quest'ordine |
|---|---|---|
| **1 — Spina dorsale** | `skeleton.js`, `wiki-index.js` esteso, `graph-model.js` | Il grafo deve *esistere come dato* prima di mostrarlo o riempirlo |
| **2 — Esploratore 3D** | `explorer.js`, aggancio nella home, stili | La meraviglia: legge i dati della Fase 1 |
| **3 — Pipeline** | documento + skill di ingestione | Rende la crescita ripetibile e a basso costo |

## Verifica

Non si dichiara nulla di finito senza prove:

- `graph-model.js` validato con un check Node: conteggi nodi/archi, nessun
  `parent` orfano, nessun `nodo`/collegamento che punta a un id inesistente;
- le pagine aperte nel browser (dall'utente, tema chiaro e scuro);
- il cervello mostra i domini, si espande al click, i nodi pieni aprono la
  pagina; senza WebGL restano le card;
- nessun binding `{{ }}` irrisolto nelle pagine toccate.

## Rischi

| Rischio | Mitigazione |
|---|---|
| Il canvas WebGL litiga col runtime dc | Montato fuori da `<x-dc>` (fratello), verificato su `support.js:168` |
| `3d-force-graph` non carica (offline / file://) | Fallback card sempre presente; il cervello è potenziamento |
| Le due fonti del grafo divergono | La pipeline genera pagina e voce di manifest insieme; check Node sugli id |
| Lo scheletro inglese stona in una wiki italiana | Domini/campi/rami accesi tradotti; gli altri si traducono quando si accendono |
| Non è verificabile un browser in questo ambiente | Costruzione difensiva + istruzioni di verifica precise per l'utente |
