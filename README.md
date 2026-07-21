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
  **dc-runtime**, compilato in `support.js` (l'unico file JavaScript del progetto).
- **Modalità notte** integrata (pulsante fisso in basso a destra; stato salvato in `localStorage`).
- **Nessuna build** necessaria per leggere: tutto gira nel browser.

Per la mappa tecnica dettagliata — struttura, connessioni fra i file, note e
migliorie previste — vedi **[OVERVIEW.md](docs/OVERVIEW.md)**.

## Roadmap

- [ ] **Modulo 03** — fine-tuning, RAG, agenti, valutazione.
- [ ] Allineare il layout del Modulo 02 al Modulo 01 (indice laterale fisso + barra di avanzamento lettura).
- [ ] Spostare lo script "modalità notte" dentro `support.js` (oggi duplicato nei tre file HTML).

---

Progetto personale di studio.
