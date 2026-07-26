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

   Campi di uno scaffale
   ---------------------
     scaffale    il nome della materia
     descrizione facoltativa: di che parla lo scaffale e in che ordine si legge
     moduli      l'elenco dei libri

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
  },

  {
    scaffale: "Il pensiero computazionale",
    descrizione: "Sei libri da leggere in ordine: si parte da una variabile che modifica se stessa e si arriva a un programma che riscrive il proprio codice, per poi scendere sotto la staccionata dell'astrazione e guardare la memoria in faccia. L'ultimo libro risponde alla domanda che tutti fanno: ha ancora senso studiare tutto questo, oggi?",
    moduli: [

      {
        id: "04",
        file: "Il-Primo-Soffio.dc.html",
        titolo: "Il primo soffio di vita",
        sottotitolo: "x = x + 1: l'equazione che nessun matematico firmerebbe, e da cui nasce il tempo. Stato, salto condizionale, cicli, invarianti e il problema della fermata.",
        icona: "tappa",
        accento: "arancio",
        stato: "pronto",
        tag: ["6 tappe", "3 demo interattive", "l'autoreferenzialità"],

        nodo: "sub-1712",   /* Informatica › Software */
        concetti: [
          { id: "m04-assegnazione", label: "Assegnazione" },
          { id: "m04-stato",        label: "Stato e memoria" },
          { id: "m04-salto",        label: "Salto condizionale" },
          { id: "m04-ciclo",        label: "Cicli e invarianti" },
          { id: "m04-terminazione", label: "Terminazione" },
          { id: "m04-mutazione",    label: "Aliasing e mutazione" }
        ],
        collegamenti: [
          { da: "m04-terminazione", a: "sub-1703", tipo: "approfondisce" }
        ]
      },

      {
        id: "05",
        file: "La-Cristallizzazione.dc.html",
        titolo: "La cristallizzazione",
        sottotitolo: "Racchiudere la logica dietro un nome. Subroutine, contratti, stack di chiamata, e la distinzione che cambia la testa: funzioni pure contro side-effect.",
        icona: "key",
        accento: "blu",
        stato: "pronto",
        tag: ["6 tappe", "2 demo interattive", "il riuso vero"],

        nodo: "sub-1712",   /* Informatica › Software */
        concetti: [
          { id: "m05-subroutine", label: "Subroutine" },
          { id: "m05-contratto",  label: "Parametri e ritorno" },
          { id: "m05-stack",      label: "Stack di chiamata" },
          { id: "m05-pure",       label: "Funzioni pure" },
          { id: "m05-effetti",    label: "Side-effect" },
          { id: "m05-ordine-sup", label: "Ordine superiore" }
        ],
        collegamenti: [
          { da: "mod-05",       a: "mod-04",       tipo: "prerequisito" },
          { da: "m05-pure",     a: "m04-mutazione", tipo: "approfondisce" }
        ]
      },

      {
        id: "06",
        file: "La-Vertigine.dc.html",
        titolo: "La vertigine",
        sottotitolo: "Lisp e l'abisso della ricorsione. Caso base, chiamate in coda, s-expression, eval e apply — fino alle macro: il linguaggio che scrive se stesso.",
        icona: "expert",
        accento: "viola",
        stato: "pronto",
        tag: ["6 tappe", "3 demo interattive", "omoiconicità"],

        nodo: "sub-1703",   /* Informatica › Teoria della Computazione */
        concetti: [
          { id: "m06-ricorsione", label: "Ricorsione" },
          { id: "m06-lisp",       label: "Lisp e s-expression" },
          { id: "m06-costo",      label: "Costo e profondità" },
          { id: "m06-tail-call",  label: "Chiamata in coda" },
          { id: "m06-eval",       label: "eval e apply" },
          { id: "m06-macro",      label: "Macro" }
        ],
        collegamenti: [
          { da: "mod-06",        a: "mod-05",       tipo: "prerequisito" },
          { da: "m06-ricorsione", a: "m05-stack",   tipo: "approfondisce" },
          { da: "m06-costo",      a: "m05-pure",    tipo: "collegato" }
        ]
      },

      {
        id: "07",
        file: "Eleganza-Esoterica.dc.html",
        titolo: "Eleganza esoterica",
        sottotitolo: "Linguaggi a pila e concatenativi — Forth, Joy — e il Santo Graal del controllo: call/cc, che congela l'istante presente di un programma e lo risveglia dopo.",
        icona: "idea",
        accento: "rosso",
        stato: "pronto",
        tag: ["6 tappe", "2 demo interattive", "continuazioni"],

        nodo: "sub-1703",   /* Informatica › Teoria della Computazione */
        concetti: [
          { id: "m07-postfissa",   label: "Notazione postfissa" },
          { id: "m07-forth",       label: "Forth" },
          { id: "m07-joy",         label: "Concatenativi" },
          { id: "m07-continuazione", label: "Continuazioni" },
          { id: "m07-callcc",      label: "call/cc" },
          { id: "m07-delimitate",  label: "Continuazioni delimitate" }
        ],
        collegamenti: [
          { da: "mod-07",             a: "mod-06",          tipo: "prerequisito" },
          { da: "m07-joy",            a: "m05-ordine-sup",  tipo: "approfondisce" },
          { da: "m07-continuazione",  a: "m04-salto",       tipo: "approfondisce" }
        ]
      },

      {
        id: "08",
        file: "Il-Fantasma-nella-Macchina.dc.html",
        titolo: "Il fantasma nella macchina",
        sottotitolo: "Sotto la staccionata dell'astrazione: indirizzi, stack e heap, registri e istruzioni, bytecode della JVM. E la regola su quando conviene davvero scendere.",
        icona: "memory",
        accento: "verde",
        stato: "pronto",
        tag: ["6 tappe", "3 demo interattive", "puntatori e bytecode"],

        nodo: "sub-1708",   /* Informatica › Hardware e Architetture */
        concetti: [
          { id: "m08-indirizzi", label: "Indirizzi e puntatori" },
          { id: "m08-stack",     label: "Stack frame" },
          { id: "m08-heap",      label: "Heap e garbage collection" },
          { id: "m08-registri",  label: "Registri e istruzioni" },
          { id: "m08-bytecode",  label: "Macchine virtuali" },
          { id: "m08-staccionata", label: "Astrazioni bucate" }
        ],
        collegamenti: [
          { da: "mod-08",       a: "mod-07",           tipo: "prerequisito" },
          { da: "m08-stack",    a: "m05-stack",        tipo: "approfondisce" },
          { da: "m08-heap",     a: "m06-eval",         tipo: "collegato" },
          { da: "m08-bytecode", a: "m07-postfissa",    tipo: "approfondisce" },
          { da: "m08-registri", a: "m04-assegnazione", tipo: "approfondisce" }
        ]
      },

      {
        id: "09",
        file: "Perche-Studiare-Oggi.dc.html",
        titolo: "Perché studiare, oggi",
        sottotitolo: "Ha ancora senso capire tutto questo nell'era degli LLM? Ne ha il doppio. I due studi che vanno letti insieme, tre bug che nessuna rilettura trova, e il piacere di capire.",
        icona: "book",
        accento: "blu",
        stato: "pronto",
        tag: ["4 tappe", "1 demo interattiva", "il messaggio finale"],

        nodo: "sub-1702",   /* Informatica › Intelligenza Artificiale */
        concetti: [
          { id: "m09-traduzione", label: "La traduzione senza la lingua" },
          { id: "m09-plausibile", label: "Plausibile ≠ corretto" },
          { id: "m09-misure",     label: "Le misure di produttività" },
          { id: "m09-piacere",    label: "L'archeologo" }
        ],
        collegamenti: [
          { da: "mod-09",         a: "mod-08",          tipo: "prerequisito" },
          { da: "m09-plausibile", a: "mod-01",          tipo: "approfondisce" },
          { da: "m09-misure",     a: "m08-staccionata", tipo: "collegato" }
        ]
      }

    ]
  }

];
