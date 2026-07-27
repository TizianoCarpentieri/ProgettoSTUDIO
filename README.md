# ProgettoSTUDIO — Biblioteca di studio interattiva

Una piccola **biblioteca di studio interattiva**, in italiano, su come funzionano i
modelli linguistici (LLM) e su come si pensa in modo computazionale. Ogni "libro" è
un file `.dc.html` autonomo che si apre direttamente nel browser: testo, formule
matematiche renderizzate e piccole demo interattive (slider, contatori, simulazioni).

Il progetto è pensato per **crescere un libro alla volta**.

## Come si legge

1. Apri **`Biblioteca.dc.html`** — è l'indice / homepage. Gli scaffali e le card
   sono la via principale; in fondo alla pagina gli stessi contenuti diventano un
   cervello 3D da esplorare, che è un di più.
2. Due percorsi di lettura, indipendenti fra loro:
   - **Scaffale *Large Language Models*** — Modulo 01 (come un LLM genera testo,
     passo per passo) e Modulo 02 (la matematica sotto).
   - **Scaffale *Il pensiero computazionale*** — sei libri da leggere in ordine,
     dal 04 al 09: dall'assegnazione alla ricorsione, dalle continuazioni alla
     memoria, fino alla domanda «ha ancora senso studiare tutto questo, oggi?».

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
| 04 | `Il-Primo-Soffio.dc.html` | `x = x + 1`, lo stato, il salto condizionale, i cicli e gli invarianti, la terminazione, l'aliasing. 6 tappe, 3 demo. |
| 05 | `La-Cristallizzazione.dc.html` | Subroutine, contratti, stack di chiamata, funzioni pure contro side-effect, ordine superiore. 6 tappe, 2 demo. |
| 06 | `La-Vertigine.dc.html` | Ricorsione, Lisp, costo e profondità, chiamate in coda, `eval`/`apply`, macro e omoiconicità. 6 tappe, 3 demo. |
| 07 | `Eleganza-Esoterica.dc.html` | Notazione postfissa, Forth, Joy e i concatenativi, continuazioni, `call/cc`, `shift`/`reset`. 6 tappe, 2 demo. |
| 08 | `Il-Fantasma-nella-Macchina.dc.html` | Puntatori, stack frame, heap e garbage collection, registri e istruzioni, bytecode JVM, astrazioni bucate. 6 tappe, 3 demo. |
| 09 | `Perche-Studiare-Oggi.dc.html` | Perché la comprensione profonda vale il doppio nell'era degli LLM: i due studi sulla produttività, tre bug plausibili da smascherare. 4 tappe, 1 demo. |

## Come è fatto (in breve)

- I file `.dc.html` non sono HTML standard: usano un runtime proprietario
  **dc-runtime**, compilato in `support.js`.
- **Un design system condiviso** (`wiki/`): tutte le pagine hanno lo stesso
  vestito, cambiabile da un solo file. Tema chiaro/scuro a token (pulsante in
  basso a destra), indice laterale e barra di avanzamento generati da soli.
- **Un cervello 3D** in fondo alla homepage: un grafo di tutto il sapere in cui i
  temi scritti sono illuminati e gli altri restano visibili ma spenti. Si esplora
  ramo per ramo; dove c'è contenuto, apre la pagina. È un di più, non la porta
  d'ingresso: si accende quando lo raggiungi scorrendo, ha un pulsante per lo
  schermo intero, e se manca WebGL restano le card — niente si perde.
- **Una pipeline** per creare pagine nuove (`INGEST.md`): dall'idea o dalle
  fonti fino alla pagina conforme e agganciata al grafo.
- **Nessuna build** necessaria per leggere: tutto gira nel browser.

Per la mappa tecnica dettagliata — struttura, connessioni fra i file, note e
migliorie previste — vedi **[OVERVIEW.md](docs/OVERVIEW.md)**.

## Roadmap

- [x] Design system condiviso: tema a token, indice laterale e barra di lettura generati.
- [x] Grafo del sapere + cervello 3D nella home + pipeline di ingest (`INGEST.md`).
- [x] **Scaffale *Il pensiero computazionale*** — sei libri (04–09), dall'assegnazione al perché studiare oggi.
- [ ] **Modulo 03** — fine-tuning, RAG, agenti, valutazione (primo banco di prova della pipeline).
- [ ] Tradurre in italiano i sottocampi dello scheletro man mano che si accendono.
- [ ] Etichette sempre visibili sui nodi del cervello (oggi compaiono al passaggio del mouse).
- [ ] Una vista "percorso di lettura" che colleghi i libri di uno scaffale in fila.

---

Progetto personale di studio.
