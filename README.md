# ProgettoSTUDIO — Biblioteca interattiva sugli LLM

Una piccola **biblioteca di studio interattiva**, in italiano, su come funzionano i
modelli linguistici (LLM). Ogni "libro" è un file `.dc.html` autonomo che si apre
direttamente nel browser: testo, formule matematiche renderizzate e piccole demo
interattive (slider, contatori, simulazioni).

Il progetto è pensato per **crescere un modulo alla volta**.

## Come si legge

1. Apri **`Biblioteca.dc.html`** — è l'indice / homepage.
2. Percorso di lettura consigliato:
   - **Modulo 01 — Dentro la Macchina**: come un LLM genera testo passo per passo (visione d'insieme intuitiva).
   - **Modulo 02 — Fondamenti Matematici**: le basi matematiche dietro il Modulo 01.

Basta un doppio clic sul file: non serve installare nulla. React, Babel e MathJax
vengono caricati al volo dai CDN, quindi al **primo** caricamento serve una
connessione a internet.

## Moduli

| Modulo | File | Contenuto |
|---|---|---|
| Indice | `Biblioteca.dc.html` | Homepage / scaffale dei moduli |
| 01 | `Dentro-la-Macchina.dc.html` | Tokenizer → Embedding → Blocco Transformer → KV Cache → FlashAttention → LM Head → Sampling → Speculative Decoding → Detokenizer. 9 tappe, 5 demo interattive. |
| 02 | `Fondamenti-Matematici-LLM.dc.html` | Vettori, matrici, embedding come geometria, softmax, derivate/gradienti, la formula dell'attention `softmax(QKᵀ/√d)V`. 7 tappe, formule LaTeX via MathJax. |
| 03 | *(in arrivo)* | Prossimo capitolo: fine-tuning, RAG, agenti, valutazione. |

## Come è fatto (in breve)

- I file `.dc.html` non sono HTML standard: usano un runtime proprietario
  **dc-runtime**, compilato in `support.js`.
- **Un design system condiviso** (`wiki/`): tutte le pagine hanno lo stesso
  vestito, cambiabile da un solo file. Tema chiaro/scuro a token (pulsante in
  basso a destra), indice laterale e barra di avanzamento generati da soli.
- **Un cervello 3D** nella homepage: un grafo di tutto il sapere in cui i temi
  scritti sono illuminati e gli altri restano visibili ma spenti. Si esplora
  ramo per ramo; dove c'è contenuto, apre la pagina. Se manca WebGL, restano le
  card — niente si perde.
- **Una pipeline** per creare pagine nuove (`INGEST.md`): dall'idea o dalle
  fonti fino alla pagina conforme e agganciata al grafo.
- **Nessuna build** necessaria per leggere: tutto gira nel browser.

Per la mappa tecnica dettagliata — struttura, connessioni fra i file, note e
migliorie previste — vedi **[OVERVIEW.md](docs/OVERVIEW.md)**.

## Roadmap

- [x] Design system condiviso: tema a token, indice laterale e barra di lettura generati.
- [x] Grafo del sapere + cervello 3D nella home + pipeline di ingest (`INGEST.md`).
- [ ] **Modulo 03** — fine-tuning, RAG, agenti, valutazione (primo banco di prova della pipeline).
- [ ] Tradurre in italiano i sottocampi dello scheletro man mano che si accendono.
- [ ] Etichette sempre visibili sui nodi del cervello (oggi compaiono al passaggio del mouse).

---

Progetto personale di studio.
