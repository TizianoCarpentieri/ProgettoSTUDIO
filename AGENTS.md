# Istruzioni per gli agenti

Valgono per qualsiasi assistente o modello linguistico che lavori in questa
cartella, e per chiunque preferisca leggere una pagina sola.

## Che cos'è questo progetto

Una biblioteca di studio interattiva in italiano sugli LLM. Ogni "libro" è un
file `.dc.html` autonomo che si apre nel browser con un doppio clic: testo,
formule, piccole demo. Nessuna build. La homepage è `Biblioteca.dc.html`.

## La regola d'oro

**Prima di creare o modificare un file `.dc.html`, apri due documenti:**

| Documento | Risponde a |
|---|---|
| [AgentFE.md](docs/AgentFE.md) | **Com'è fatta** una pagina: classi, colori, icone, la procedura in tre passi |
| [AgentAutore.md](docs/AgentAutore.md) | **Come si scrive** un libro: i sette principi didattici, il procedimento, la verifica |

Vale nei tre casi: libro nuovo chiesto a voce, libro nuovo ricavato da un
documento fornito, modifica o ampliamento di un libro esistente. Non serve che
la richiesta lo ricordi — è il modo di lavorare predefinito del progetto.

## Il ciclo di lavoro

1. Stabilisci da dove parte il lettore. Se non è deducibile, chiedilo.
2. **Cerca le fonti online prima di scrivere.** Numeri, date e attribuzioni si
   verificano; ciò che non è verificato si riscrive al ribasso. Su questi temi
   cambia molto in fretta.
3. Scegli le analogie portanti, una per concetto difficile.
4. Disegna le tappe: da quale noto parte ognuna, cosa aggiunge, quale concetto
   precedente riapre.
5. Scrivi partendo da `_TEMPLATE.dc.html`.
6. Registra il modulo in `wiki/wiki-index.js` — senza quel passo la pagina
   esiste ma non compare nella Biblioteca.
7. Verifica: la checklist di contenuto in `docs/AgentAutore.md`, quella di forma in
   `docs/AgentFE.md`.

## I due divieti che contano

- **Mai `style="..."`, mai colori scritti a mano.** Tutto passa dalle classi
  `w-` e dai token di `wiki/wiki.css`. Le altre tre regole di forma stanno in
  `docs/AgentFE.md`.
- **Mai un dato non verificato.** Nessun numero, primato, data o attribuzione
  che non regga a un controllo. È l'unica regola di questo progetto senza
  eccezioni: vedi il principio 4 in `docs/AgentAutore.md`.

## Dove vanno le cose

| Cosa | Dove |
|---|---|
| I libri (`.dc.html`) e `index.html` | in **radice** — sono gli URL pubblici di GitHub Pages, non spostarli |
| Il connettore condiviso | `wiki/` |
| La documentazione | `docs/` — tranne `README.md`, `AGENTS.md`, `CLAUDE.md`, `INDEX.md`, che stanno in radice per convenzione |
| Le decisioni di progettazione | `docs/decisioni/`, un file per decisione, `AAAA-MM-GG-argomento-design.md` |

## Non toccare

`support.js` — è il runtime `dc-runtime` compilato altrove.

---

Mappa completa della documentazione: [INDEX.md](INDEX.md).
