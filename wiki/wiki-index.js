/* ==========================================================================
   WIKI · INDICE DEI CONTENUTI  (una delle due fonti del grafo)
   --------------------------------------------------------------------------
   Questo è l'elenco di tutto ciò che ESISTE nella biblioteca. Due usi:
     · la homepage costruisce le sue card leggendo da qui (non si scrivono a mano);
     · il cervello 3D lo fonde con lo scheletro del sapere (wiki/graph/skeleton.js)
       per illuminare i rami che abbiamo scritto.

   PER AGGIUNGERE UN MODULO: aggiungi una voce a `moduli`. Nient'altro.
   PER AGGIUNGERE UNO SCAFFALE (una nuova materia): aggiungi un blocco
   { scaffale: "...", moduli: [...] } a questo array.

   Campi di un modulo
   ------------------
     id          "01", "02", … — il numero mostrato sulla card
     file        nome del file .dc.html, oppure null se non esiste ancora
     titolo      il nome del modulo
     sottotitolo una frase che spiega di cosa parla
     icona       nome di un'icona del set (vedi AgentFE.md)
     accento     blu | rosso | verde | arancio | viola
     stato       pronto | bozza | previsto   ("previsto" = card tratteggiata)
     tag         etichette brevi mostrate in fondo alla card

   Campi del GRAFO (facoltativi finché il modulo è "previsto")
   -----------------------------------------------------------
     nodo         id di uno nodo di skeleton.js a cui il modulo si aggancia:
                  lo ACCENDE nel cervello. Es. "sub-1702" (Intelligenza
                  Artificiale). L'intera catena di genitori si illumina con lui.
     concetti     [{ id, label }] — i nodi interni del modulo (le sue tappe).
                  Diventano i "rami" che sbocciano quando apri il modulo nel
                  cervello. Convenzione id: "mNN-slug" (es. "m01-embedding").
     collegamenti [{ da, a, tipo }] — archi in più fra nodi del grafo (i "ponti"
                  resi dati anziché prosa). `da`/`a` sono id di concetti, di
                  moduli ("mod-01") o di skeleton. `tipo`:
                  prerequisito | approfondisce | collegato

   Il modulo stesso è un nodo del cervello con id "mod-" + id (es. "mod-01"),
   figlio di `nodo`; i suoi `concetti` sono figli del modulo. Gerarchia:
   dominio → campo → sottocampo → modulo → concetto.
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
        tag: ["il flusso completo", "5 demo interattive", "9 tappe", "livello: intuitivo → esperto"],

        nodo: "sub-1702",   /* Informatica › Intelligenza Artificiale */
        concetti: [
          { id: "m01-tokenizer",   label: "Tokenizer" },
          { id: "m01-embedding",   label: "Embedding" },
          { id: "m01-transformer", label: "Blocco Transformer" },
          { id: "m01-kv-cache",    label: "KV Cache" },
          { id: "m01-flash",       label: "FlashAttention" },
          { id: "m01-lm-head",     label: "LM Head" },
          { id: "m01-sampling",    label: "Sampling" },
          { id: "m01-speculative", label: "Speculative Decoding" },
          { id: "m01-detokenizer", label: "Detokenizer" }
        ],
        collegamenti: [
          { da: "m01-embedding",   a: "m02-embedding", tipo: "approfondisce" },
          { da: "m01-transformer", a: "m02-attention", tipo: "approfondisce" },
          { da: "m01-sampling",    a: "m02-softmax",   tipo: "approfondisce" }
        ]
      },

      {
        id: "02",
        file: "Fondamenti-Matematici-LLM.dc.html",
        titolo: "La Matematica nascosta",
        sottotitolo: "Vettori, matrici, softmax, gradienti e attention. La lingua segreta con cui un LLM pensa, con demo interattive e formule vere.",
        icona: "math",
        accento: "blu",
        stato: "pronto",
        tag: ["7 tappe", "6 esperimenti interattivi", "algebra → Transformer"],

        nodo: "sub-2604",   /* Matematica › Matematica Applicata */
        concetti: [
          { id: "m02-vettori",   label: "Vettori" },
          { id: "m02-matrici",   label: "Matrici" },
          { id: "m02-embedding", label: "Embedding come geometria" },
          { id: "m02-softmax",   label: "Softmax" },
          { id: "m02-gradienti", label: "Derivate e Gradienti" },
          { id: "m02-attention", label: "Attention" },
          { id: "m02-sintesi",   label: "Dall'algebra al Transformer" }
        ],
        collegamenti: [
          { da: "mod-02", a: "mod-01", tipo: "prerequisito" }
        ]
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
