/* ==========================================================================
   WIKI · INDICE DEI CONTENUTI
   --------------------------------------------------------------------------
   Questo è l'elenco di tutto ciò che esiste nella biblioteca. La homepage
   (Biblioteca.dc.html) costruisce le sue card leggendo da qui: non si
   scrivono card a mano.

   PER AGGIUNGERE UN MODULO: aggiungi una voce a `moduli`. Nient'altro.
   PER AGGIUNGERE UNO SCAFFALE (una nuova materia): aggiungi un blocco
   { scaffale: "...", moduli: [...] } a questo array.

   Campi di un modulo:
     id          "01", "02", … — il numero mostrato sulla card
     file        nome del file .dc.html, oppure null se non esiste ancora
     titolo      il nome del modulo
     sottotitolo una frase che spiega di cosa parla
     icona       nome di un'icona del set (vedi AgentFE.md): tappa, math,
                 book, memory, demo, formula, orient, key, bridge, expert…
     accento     blu | rosso | verde | arancio | viola
     stato       pronto | bozza | previsto   ("previsto" disegna la card
                 tratteggiata e non la rende cliccabile)
     tag         etichette brevi mostrate in fondo alla card
   ========================================================================== */

window.WIKI_INDEX = [

  {
    scaffale: "Large Language Models",
    moduli: [

      {
        id: "01",
        file: "Dentro-la-Macchina.dc.html",
        titolo: "Dentro la Macchina",
        sottotitolo: "Come un LLM genera testo, passo per passo — dal tasto Invio all'ultima parola. Tokenizer, embedding, attention, KV-cache, sampling.",
        icona: "tappa",
        accento: "rosso",
        stato: "pronto",
        tag: ["il flusso completo", "5 demo interattive", "9 tappe", "livello: intuitivo → esperto"]
      },

      {
        id: "02",
        file: "Fondamenti-Matematici-LLM.dc.html",
        titolo: "La Matematica nascosta",
        sottotitolo: "Vettori, matrici, softmax, gradienti e attention. La lingua segreta con cui un LLM pensa, con demo interattive e formule vere.",
        icona: "math",
        accento: "blu",
        stato: "pronto",
        tag: ["7 tappe", "6 esperimenti interattivi", "algebra → Transformer"]
      },

      {
        id: "03",
        file: null,
        titolo: "Prossimo capitolo…",
        sottotitolo: "Lo spazio dove crescerà la base: fine-tuning, RAG, agenti, valutazione… Dillo tu — questo scaffale è fatto per riempirsi.",
        icona: "book",
        accento: "blu",
        stato: "previsto",
        tag: []
      }

    ]
  }

];
