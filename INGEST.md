# INGEST — dall'idea alla pagina, agganciata al grafo

Questa è la **pipeline** con cui nasce ogni pagina della biblioteca: una
procedura ripetibile che parte da un'idea (o da delle fonti), capisce **dove**
collocarla nel grafo del sapere e **quanto** deve essere lunga, e arriva a una
pagina conforme agli standard grafici e già accesa nel cervello 3D.

Vale per persone e per modelli linguistici. Un LLM può eseguirla da solo con la
skill `/biblioteca-ingest`, che non è altro che questi sei passi.

Prerequisito di lettura: **[AgentFE.md](docs/AgentFE.md)** (le classi, le icone, la
struttura della pagina). Questo documento dice *cosa fare*; AgentFE dice *come è
fatto il vestito*.

---

## I sei passi

```
1. INTAKE          cosa vogliamo creare, per chi, con quale materiale
2. POSIZIONAMENTO   dove cade nel grafo del sapere  → il nodo di aggancio
3. PROFONDITÀ       quanto deve essere lunga  → dalle fonti o dal buon senso
4. BOZZA            la pagina, con le sole classi w-  (AgentFE.md)
5. AGGANCIO         la voce in wiki-index.js: nodo, concetti, collegamenti
6. VERIFICA         validatore, browser, il nodo si accende
```

---

## 1 · Intake

Metti a fuoco tre cose, in tre righe:

- **Argomento** in una frase. ("Come un modello recupera informazioni da fuori:
  RAG.")
- **Pubblico e livello.** Principiante curioso? Chi ha già letto i moduli 01–02?
  Fino a che profondità si spinge?
- **Materiale.** Ci sono **fonti** (paper, appunti, link, un libro)? Quali?
  Oppure si scrive dalla **conoscenza generale**?

Il materiale decide il passo 3, quindi va dichiarato adesso.

## 2 · Posizionamento nel grafo

Ogni pagina si aggancia a **un nodo** dello scheletro del sapere
(`wiki/graph/skeleton.js`): è ciò che la fa illuminare nel cervello.

1. **Cerca il nodo giusto.** Nello scheletro ci sono 4 domini → 26 campi → 252
   sottocampi. Trova il sottocampo più calzante:

   ```bash
   grep -i "recupero\|information retrieval\|search" wiki/graph/skeleton.js
   ```

   L'`id` di quel nodo (es. `sub-1710`) è il tuo campo **`nodo`**.

2. **Se non esiste un nodo adatto**, due strade:
   - aggancia al sottocampo o campo **più vicino** (va benissimo: più moduli
     possono condividere un nodo);
   - oppure **aggiungi un nodo** allo scheletro — una riga in `skeleton.js`:
     `{ id: "usr-rag", label: "RAG e recupero", level: "sottocampo", parent: "fld-17" }`
     (prefisso `usr-` per i nodi aggiunti a mano, così si distinguono da quelli
     OpenAlex).

3. **Guarda i vicini.** Quali moduli già scritti stanno nello stesso campo o
   trattano cose collegate? Segnali: serviranno al passo 5 per i `collegamenti`
   (i "ponti" resi dati).

## 3 · Profondità e lunghezza

Qui si decide la **scala** della pagina. Tre tagli:

| Taglio | Tappe | Quando |
|---|---|---|
| **Panoramica** | 3–4 | introduzione, ramo laterale, assaggio |
| **Standard** | 5–7 | il default di un modulo pieno |
| **Approfondito** | 8+ | un tema centrale che regge altri moduli |

Come scegliere il taglio:

- **Con fonti** — conta i **temi portanti** distinti nel materiale. Regola
  pratica: **circa una tappa per tema portante**. Una-due fonti brevi →
  panoramica; un pugno di fonti, o un paper denso → standard; una bibliografia
  ricca o più paper → approfondito. Conta la **densità** più del numero: un solo
  buon *survey* può valere otto tappe.
- **Senza fonti** (conoscenza generale) — scegli per **centralità e pubblico**.
  Concetto d'ingresso per principianti → panoramica/standard; pilastro che
  sostiene altri moduli → approfondito. Nel dubbio, **standard**.

Nella stessa mossa decidi:

- **Demo interattive** (0–5): una per ogni idea che "si capisce solo toccandola"
  (uno slider, un contatore, una simulazione).
- **Formule**: se servono passaggi matematici, la pagina includerà MathJax nel
  `<head>` (vedi `_TEMPLATE.dc.html`).

Esito del passo: **l'elenco dei titoli delle tappe**, le demo, sì/no formule.
Questo elenco è già l'ossatura sia della pagina sia dei suoi nodi nel grafo.

## 4 · Bozza a norma

- Copia `_TEMPLATE.dc.html` → `Nome-Della-Pagina.dc.html` (nome file = titolo
  con i trattini).
- Riempi seguendo **[AgentFE.md](docs/AgentFE.md)**: copertina → "cosa impari" →
  sommario → tappe `#c1 … #cN` → epilogo `#fine` → ponti → piede.
- **Solo classi `w-`**, mai `style=` nella cornice. Accento **per significato**:
  blu = calcolo, rosso = avvertimenti, verde = memoria, arancio = interazione,
  viola = esperto.
- Tieni a mente il grafo: **una tappa = un concetto = un nodo**. I titoli (o
  versioni brevi) delle tappe diventeranno i `concetti` del passo 5.

## 5 · Aggancio al grafo

Aggiungi la voce del modulo a **`wiki/wiki-index.js`**. Campi base come sempre
(`id`, `file`, `titolo`, `sottotitolo`, `icona`, `accento`, `stato: "pronto"`,
`tag`), più i **campi del grafo**:

```js
nodo: "sub-1710",                       // dal passo 2
concetti: [                             // uno per tappa; id "mNN-slug"
  { id: "m03-chunking",  label: "Spezzare i documenti" },
  { id: "m03-retriever", label: "Il recupero" },
  { id: "m03-rerank",    label: "Riordino" }
],
collegamenti: [                         // i ponti verso i vicini (passo 2)
  { da: "m03-retriever", a: "m01-embedding", tipo: "approfondisce" },
  { da: "mod-03",        a: "mod-01",        tipo: "collegato" }
]
```

`tipo`: `prerequisito | approfondisce | collegato`. `da`/`a` sono id di
concetti (`mNN-…`), di moduli (`mod-NN`) o di nodi dello scheletro.

Senza questo passo la pagina esiste ma resta **spenta** nel cervello.

## 6 · Verifica

Non è finita finché non passa tutto:

```bash
node wiki/graph/valida.js        # 0 problemi: nessun id inesistente, nessun orfano
```

Poi, nel browser:

- la pagina in tema **chiaro e scuro**; il reticolo copre tutta l'altezza;
- l'**indice laterale** elenca tutte le tappe e si evidenzia allo scorrimento;
- le **demo** funzionano davvero;
- nessun binding `{{ }}` irrisolto rimasto nel testo;
- apri **`Biblioteca.dc.html`**: il nuovo nodo è **acceso** nel cervello, si
  raggiunge espandendo il suo ramo, e il clic apre la pagina.

---

## In breve, per un LLM

Esegui i sei passi in ordine. Fermati e chiedi solo se il passo 2 (dove
agganciare) o il passo 3 (quanto lunga) sono ambigui e le fonti non bastano a
deciderlo. Tutto il resto — struttura, classi, icone, validazione — è
meccanico ed è scritto qui e in [AgentFE.md](docs/AgentFE.md).
