# Standard di scrittura dei libri e gancio automatico per gli agenti

Data: 2026-07-21
Stato: implementato

## Problema

Il design system introdotto il 2026-07-20 ha risolto la **forma** delle pagine:
`AgentFE.md` racconta classi, colori, icone e la procedura in tre passi, e
`_TEMPLATE.dc.html` dà lo scheletro. Nessun documento diceva invece come si
scrive il **contenuto** di un libro.

Conseguenza pratica: il metodo didattico viveva solo nel prompt. I due moduli
esistenti nascono da una richiesta secca —

> *"spiegami questi temi in un libro… Come farebbe un maestro. Passo passo.
> Esempi e analogie. Crea un piccolo libro con illustrazioni. Per partire da una
> base di medie conoscenze a esperto assoluto. Aggiungere frasi a forte effetto
> e impatto"*

— e la qualità che ne è uscita non è riproducibile: dipende da come quel prompt
viene interpretato quel giorno. Tre difetti concreti:

1. **Il metodo va riesposto ogni volta.** Ogni nuovo modulo riparte da zero, e
   ogni riesposizione è un'occasione di deriva.
2. **Un'istruzione del prompt è attivamente pericolosa.** *"Frasi a forte
   effetto"* tende a essere eseguita troppo: senza un contrappeso scritto,
   produce testo pubblicitario.
3. **Nessun presidio sui dati.** I moduli affermano numeri e attribuiscono
   paper. Niente dice che vadano verificati, e un dato inventato in un libro
   didattico è il difetto peggiore possibile — il lettore non è in condizione
   di accorgersene.

## Obiettivo

I sette principi didattici individuati dall'autore diventano lo standard del
progetto, applicato **senza doverlo esplicitare a ogni richiesta**, da qualsiasi
modello linguistico e non solo da quello usato oggi.

### Non obiettivi

- Non si riscrivono i moduli 01 e 02.
- Non si tocca la forma: `AgentFE.md` resta l'autorità sul vestito.
- Lo standard non si applica alle risposte in chat, solo a ciò che produce o
  modifica un file `.dc.html`.

## Decisioni

### 1. Il gancio è `AGENTS.md`, non `CLAUDE.md`

Il vincolo dichiarato è la portabilità: la documentazione deve essere
processabile da qualsiasi LLM, non da un solo strumento. `AGENTS.md` è la
convenzione letta da più agenti (Codex, Cursor, Gemini CLI, Copilot e altri);
`CLAUDE.md` esiste ma è tre righe che rimandano ad `AGENTS.md`.

Non è un symlink: si rompe sui clone Windows e non è leggibile come testo dagli
strumenti che si limitano a caricare il file.

**Alternativa scartata:** una skill `.claude/skills/`. Era il pezzo
Claude-specifico della proposta iniziale. Scartata per due motivi: il metodo
sarebbe finito in una cartella nascosta invisibile agli altri strumenti, e
avrebbe creato un secondo posto dove il metodo può divergere dal documento.

### 2. La sostanza sta in `docs/AgentAutore.md`

Documento gemello di `docs/AgentFE.md`, stesso registro, stessa collocazione.
Markdown puro, nessuna dipendenza da un tool: è leggibile da un umano,
incollabile in qualsiasi chat, indicizzato in `INDEX.md`.

La separazione fra gancio e sostanza è voluta: `AGENTS.md` è corto perché viene
caricato sempre, `docs/AgentAutore.md` è lungo perché viene aperto quando serve.

### 3. Principi con il perché, non un regolamento

Vincolo esplicito dell'autore: *"non esageriamo con vincoli e regole, gli LLM
rendono meglio nella scrittura quando sono liberi"*.

Ogni principio è quindi scritto in quattro parti — *cosa dice*, *perché
funziona*, *dove si vede* (la classe `w-` corrispondente), *l'errore tipico* —
e il documento si apre dichiarando che il giudizio può prevalere. L'ancoraggio
alle classi è ciò che tiene i principi verificabili senza renderli coercitivi:
*"analogia prima, tecnicismo dopo"* si controlla guardando se `w-note--demo`
precede `w-formula`.

**Alternativa scartata:** tetti numerici (una frase a effetto per tappa, un
`w-note--expert` al massimo). Sostituiti da una sezione *"Il senso della
misura"* che descrive i tre eccessi ricorrenti e il criterio unico: se un
elemento è presente ovunque, non comunica più niente.

### 4. Due sole regole restano dure

- **Le fonti verificate.** È un rischio di verità, non di stile: la ricerca
  online precede la scrittura, e ciò che non è verificato si riscrive al
  ribasso. Nessuna eccezione.
- **Il richiamo fra tappe.** Dalla seconda tappa in poi ognuna riapre un
  concetto già visto e ci aggiunge uno strato.

**Alternativa scartata per la profondità crescente:** strati fissi obbligatori
dentro ogni tappa (intuizione → meccanica → esperto), e tre giri completi sul
libro intero. Entrambe imponevano una struttura che i moduli 01 e 02 non hanno,
in cambio di un beneficio che il solo obbligo di richiamo già ottiene.

### 5. Il template porta i principi nel punto d'uso

I commenti guida di `_TEMPLATE.dc.html` richiamano il principio pertinente
accanto al blocco a cui si applica: l'ordine analogia/formula sta scritto sopra
`w-note--demo`, la regola sulle fonti sopra `w-note--paper`. Chi copia il
template incontra il metodo senza aprire nulla.

Aggiunto anche il blocco "la palestra" nell'epilogo, che formalizza il principio
7. Non è un'invenzione: `Dentro-la-Macchina.dc.html` lo faceva già, e nessuno
l'aveva mai nominato come regola.

## File

| File | Stato | Ruolo |
|---|---|---|
| `docs/AgentAutore.md` | nuovo | I sette principi, il procedimento, la checklist di contenuto |
| `AGENTS.md` | nuovo | Il gancio universale: regola d'oro, ciclo di lavoro, divieti, dove vanno le cose |
| `CLAUDE.md` | nuovo | Tre righe che rimandano ad `AGENTS.md` |
| `_TEMPLATE.dc.html` | modificato | Commenti guida con i principi al punto d'uso; blocco "palestra" nell'epilogo |
| `INDEX.md` | modificato | Da quattro a sei documenti; scorciatoie per scrittura e verifica |
| `wiki/wiki.css` | modificato | `.w-note ul, .w-note ol` impaginate una volta sola, così il blocco "palestra" non ha bisogno di stili inline |

## Riordino della cartella, stessa occasione

Contestuale e indipendente dai principi, ma è il momento in cui la radice è
stata rimessa in ordine:

- `AgentFE.md`, `AgentAutore.md` e `OVERVIEW.md` scendono in `docs/`. In radice
  restano `README.md`, `AGENTS.md`, `CLAUDE.md` (convenzioni che gli strumenti
  cercano per nome) e `INDEX.md` (la mappa si vede aprendo la cartella).
- `docs/superpowers/specs/` → `docs/decisioni/`: "superpowers" è il nome di uno
  strumento, non una categoria di questo progetto.
- `.thumbnail` e `screenshots/` rimossi e messi in `.gitignore`. Erano ~136 KB
  di anteprime mai referenziate, che `OVERVIEW.md` segnalava già come orfane.
- **I `.dc.html` restano in radice**: sono gli URL pubblici di GitHub Pages.
  Spostarli romperebbe i link già condivisi.

## Come si verifica che funzioni

Il collaudo non è tecnico: si chiede il prossimo modulo con un prompt secco,
senza nominare i principi, e si controlla il risultato con la checklist di
`AgentAutore.md`. Se serve ancora ricordare il metodo a voce, il gancio non sta
funzionando.
