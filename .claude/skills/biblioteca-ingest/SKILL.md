---
name: biblioteca-ingest
description: Use when creating a new page/module for THIS project's study wiki ("biblioteca") — turning an idea or a set of sources into a finished .dc.html page, sized correctly, styled with the w- design system, and wired into the knowledge graph so it lights up in the 3D brain. Trigger words: "nuovo modulo", "aggiungi una pagina", "crea una pagina della biblioteca", "ingest", "/biblioteca-ingest".
---

# Biblioteca · Ingest

Guida la creazione di una pagina nuova dall'idea (o dalle fonti) fino alla
pagina finita e agganciata al grafo. È l'automazione dei sei passi di
**[INGEST.md](../../../INGEST.md)**; lo standard grafico è in
**[AgentFE.md](../../../docs/AgentFE.md)**. Leggi entrambi prima di iniziare.

## Regola d'oro

Fai una cosa alla volta e **fermati a chiedere solo ai due bivi che
contano**: dove agganciare la pagina (passo 2) e quanto deve essere lunga
(passo 3), quando il materiale non basta a deciderlo da solo. Tutto il resto è
meccanico: eseguilo senza chiedere.

## Procedura

Crea un todo per ciascuno di questi passi e completali in ordine.

1. **Intake.** Raccogli in tre righe: argomento in una frase, pubblico/livello,
   e se ci sono fonti (quali) o si va di conoscenza generale. Se l'utente non
   le ha date e servono, chiedile ora.

2. **Posizionamento.** Trova il nodo di aggancio nello scheletro:
   `grep -i "<parola chiave>" wiki/graph/skeleton.js`. Scegli il sottocampo più
   calzante (il suo `id` = campo `nodo`). Se manca, aggancia al vicino o
   aggiungi un nodo `usr-…` a `skeleton.js`. Individua i moduli vicini già
   scritti (serviranno per i `collegamenti`). **Se l'aggancio è ambiguo,
   proponi 2 opzioni e chiedi.**

3. **Profondità.** Scegli il taglio — panoramica (3–4 tappe) / standard (5–7) /
   approfondito (8+). Con fonti: ~1 tappa per tema portante, la densità conta
   più del numero. Senza fonti: per centralità e pubblico, nel dubbio standard.
   Decidi demo (0–5) e se servono formule. **Se la lunghezza è ambigua e le
   fonti non la dettano, proponi un taglio e chiedi conferma.** Esito: elenco
   dei titoli delle tappe.

4. **Bozza.** Copia `_TEMPLATE.dc.html` in `Nome-Della-Pagina.dc.html`. Riempi
   seguendo AgentFE.md: copertina → cosa impari → sommario → tappe `#c1…#cN` →
   epilogo `#fine` → ponti → piede. Solo classi `w-`, accento per significato.
   Ricorda: una tappa = un concetto = un nodo del grafo.

5. **Aggancio.** Aggiungi la voce a `wiki/wiki-index.js` con i campi base +
   `nodo`, `concetti` (uno per tappa, id `mNN-slug`), `collegamenti` (i ponti
   verso i vicini: `{da,a,tipo}`, tipo `prerequisito|approfondisce|collegato`).

6. **Verifica.** Esegui `node wiki/graph/valida.js` (deve dare 0 problemi).
   Poi ricorda all'utente il controllo nel browser: pagina in chiaro/scuro,
   reticolo su tutta l'altezza, indice laterale, demo funzionanti, nessun
   binding `{{ }}` irrisolto, e il nodo **acceso** nel cervello della
   Biblioteca che apre la pagina.

## Al termine

Riepiloga: file creato, dove si è agganciato nel grafo (dominio › campo ›
sottocampo), quante tappe, quali collegamenti, e l'esito del validatore.
