# Indice della documentazione

Sette documenti, sette domande diverse. Parti da quello che risponde alla tua.

| Documento | Risponde a |
|---|---|
| [README.md](README.md) | **Che cos'è questo progetto?** La vetrina pubblica: cos'è la biblioteca, come si legge, quali moduli esistono. Da qui se apri la repo per la prima volta. |
| [AGENTS.md](AGENTS.md) | **Che cosa devo sapere prima di toccare qualcosa?** Il punto d'ingresso per qualsiasi assistente o modello linguistico: la regola d'oro, il ciclo di lavoro, i due divieti. Una pagina sola, in forma neutra rispetto agli strumenti. |
| [AgentFE.md](docs/AgentFE.md) | **Com'è fatta una pagina?** Lo standard front-end: le regole, le classi, le icone, il file dei parametri, la procedura in tre passi. Da qui se stai per scrivere codice. |
| [AgentAutore.md](docs/AgentAutore.md) | **Che cosa ci scrivo dentro?** Lo standard di scrittura: i sette principi didattici con il perché di ognuno, il procedimento dalla richiesta al libro, la checklist di verifica del contenuto. |
| [INGEST.md](INGEST.md) | **Come nasce una pagina nuova?** La pipeline in sei passi: dall'idea o dalle fonti, al posizionamento nel grafo del sapere, alla lunghezza giusta, alla pagina conforme e già accesa nel cervello 3D. C'è anche la skill `/biblioteca-ingest` che la esegue. |
| [OVERVIEW.md](docs/OVERVIEW.md) | **Come sta insieme il tutto?** La mappa tecnica: i file, le dipendenze, il runtime, il grafo del sapere, la pubblicazione su GitHub Pages, le note di manutenzione. |
| [docs/decisioni/](docs/decisioni/) | **Perché è fatto così?** Le decisioni di progettazione, con i problemi che risolvevano e le alternative scartate. |

## Scorciatoie

| Voglio… | Vado a |
|---|---|
| creare una pagina nuova dall'idea o dalle fonti | [INGEST.md](INGEST.md) — o la skill `/biblioteca-ingest` |
| aggiungere un modulo nuovo (lo standard grafico) | [AgentFE.md](docs/AgentFE.md) § *Aggiungere una pagina in tre passi* |
| capire come si scrive un libro che insegna davvero | [AgentAutore.md](docs/AgentAutore.md) § *I sette principi* |
| verificare un libro prima di considerarlo finito | [AgentAutore.md](docs/AgentAutore.md) § *Come si verifica un libro* (contenuto) e [AgentFE.md](docs/AgentFE.md) § *Come si verifica una pagina* (forma) |
| cambiare colori, caratteri o spaziature di tutta la wiki | il blocco `:root` in [wiki/wiki.css](wiki/wiki.css) |
| cambiare o aggiungere un'icona | i token `--ico-*` in [wiki/wiki.css](wiki/wiki.css) |
| capire perché il tema scuro non usa `invert` | [AgentFE.md](docs/AgentFE.md) § *Il tema scuro* |
| far comparire un modulo nella homepage | [wiki/wiki-index.js](wiki/wiki-index.js) |
| agganciare un modulo al grafo del sapere | i campi `nodo` / `concetti` / `collegamenti` in [wiki/wiki-index.js](wiki/wiki-index.js) |
| capire il cervello 3D e il grafo | [wiki/graph/](wiki/graph/) e lo spec del cervello in [docs/decisioni/](docs/decisioni/) |
| controllare che il grafo sia coerente | `node wiki/graph/valida.js` |
| pubblicare le modifiche | [OVERVIEW.md](docs/OVERVIEW.md) § *Pubblicazione su GitHub* |
