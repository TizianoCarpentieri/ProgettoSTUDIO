/* ==========================================================================
   WIKI · INDICE DEI CONTENUTI  (una delle due fonti del grafo)
   --------------------------------------------------------------------------
   Questo è l'elenco di tutto ciò che ESISTE nella biblioteca. Due usi:
     · la homepage costruisce le sue card leggendo da qui (non si scrivono a mano);
     · il cervello 3D lo fonde con lo scheletro del sapere (wiki/graph/skeleton.js)
       per illuminare i rami che abbiamo scritto.

   PER AGGIUNGERE UN MODULO: aggiungi una voce a `moduli`. Nient'altro.
   PER AGGIUNGERE UNO SCAFFALE (una nuova materia): aggiungi un blocco
   { scaffale, slug, accento, descrizione, moduli: [...] } a questo array.

   Dopo ogni modifica: `node wiki/verifica.js`. Controlla che ciò che è scritto
   qui e ciò che sta nei file non abbiano preso strade diverse.

   Campi di uno scaffale
   ---------------------
     scaffale     il nome della materia
     slug         identificatore della sua vista: Biblioteca.dc.html#scaffale=llm
                  (minuscole, cifre, trattini)
     accento      blu | rosso | verde | arancio | viola — il colore della materia
     descrizione  una frase: di cosa tratta questo scaffale


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
     concetti     [{ id, label, tappa }] — i nodi interni del modulo. Sono le
                  sue tappe: uno per tappa, nello stesso ordine, e `tappa` è
                  l'àncora dentro il file ("c4"). È ciò che permette al grafo di
                  aprire il libro AL PUNTO GIUSTO invece che in cima, e quindi di
                  essere l'indice della biblioteca al livello del paragrafo.
                  Convenzione id: "mNN-slug" (es. "m01-embedding").
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
    slug: "llm",
    accento: "rosso",
    descrizione: "Come una macchina arriva a scrivere: il percorso che fa una frase dentro il modello, e la matematica che lo rende possibile.",
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
          { id: "m01-tokenizer",   label: "Tokenizer",             tappa: "c1" },
          { id: "m01-embedding",   label: "Embedding",             tappa: "c2" },
          { id: "m01-transformer", label: "Blocco Transformer",    tappa: "c3" },
          { id: "m01-kv-cache",    label: "KV Cache",              tappa: "c4" },
          { id: "m01-flash",       label: "FlashAttention",        tappa: "c5" },
          { id: "m01-lm-head",     label: "LM Head",               tappa: "c6" },
          { id: "m01-sampling",    label: "Sampling",              tappa: "c7" },
          { id: "m01-speculative", label: "Speculative Decoding",  tappa: "c8" },
          { id: "m01-detokenizer", label: "Detokenizer",           tappa: "c9" }
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
          { id: "m02-vettori",   label: "Vettori",                      tappa: "c1" },
          { id: "m02-matrici",   label: "Matrici",                      tappa: "c2" },
          { id: "m02-embedding", label: "Embedding come geometria",     tappa: "c3" },
          { id: "m02-softmax",   label: "Softmax",                      tappa: "c4" },
          { id: "m02-gradienti", label: "Derivate e Gradienti",         tappa: "c5" },
          { id: "m02-attention", label: "Attention",                    tappa: "c6" },
          { id: "m02-sintesi",   label: "Dall'algebra al Transformer",  tappa: "c7" }
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
    slug: "pensiero-computazionale",
    accento: "arancio",
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
          { id: "m04-assegnazione", label: "Assegnazione", tappa: "c1" },
          { id: "m04-stato",        label: "Stato e memoria", tappa: "c2" },
          { id: "m04-salto",        label: "Salto condizionale", tappa: "c3" },
          { id: "m04-ciclo",        label: "Cicli e invarianti", tappa: "c4" },
          { id: "m04-terminazione", label: "Terminazione", tappa: "c5" },
          { id: "m04-mutazione",    label: "Aliasing e mutazione", tappa: "c6" }
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
          { id: "m05-subroutine", label: "Subroutine", tappa: "c1" },
          { id: "m05-contratto",  label: "Parametri e ritorno", tappa: "c2" },
          { id: "m05-stack",      label: "Stack di chiamata", tappa: "c3" },
          { id: "m05-pure",       label: "Funzioni pure", tappa: "c4" },
          { id: "m05-effetti",    label: "Side-effect", tappa: "c5" },
          { id: "m05-ordine-sup", label: "Ordine superiore", tappa: "c6" }
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
          { id: "m06-ricorsione", label: "Ricorsione", tappa: "c1" },
          { id: "m06-lisp",       label: "Lisp e s-expression", tappa: "c2" },
          { id: "m06-costo",      label: "Costo e profondità", tappa: "c3" },
          { id: "m06-tail-call",  label: "Chiamata in coda", tappa: "c4" },
          { id: "m06-eval",       label: "eval e apply", tappa: "c5" },
          { id: "m06-macro",      label: "Macro", tappa: "c6" }
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
          { id: "m07-postfissa",   label: "Notazione postfissa", tappa: "c1" },
          { id: "m07-forth",       label: "Forth", tappa: "c2" },
          { id: "m07-joy",         label: "Concatenativi", tappa: "c3" },
          { id: "m07-continuazione", label: "Continuazioni", tappa: "c4" },
          { id: "m07-callcc",      label: "call/cc", tappa: "c5" },
          { id: "m07-delimitate",  label: "Continuazioni delimitate", tappa: "c6" }
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
          { id: "m08-indirizzi", label: "Indirizzi e puntatori", tappa: "c1" },
          { id: "m08-stack",     label: "Stack frame", tappa: "c2" },
          { id: "m08-heap",      label: "Heap e garbage collection", tappa: "c3" },
          { id: "m08-registri",  label: "Registri e istruzioni", tappa: "c4" },
          { id: "m08-bytecode",  label: "Macchine virtuali", tappa: "c5" },
          { id: "m08-staccionata", label: "Astrazioni bucate", tappa: "c6" }
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
          { id: "m09-traduzione", label: "La traduzione senza la lingua", tappa: "c1" },
          { id: "m09-plausibile", label: "Plausibile ≠ corretto", tappa: "c2" },
          { id: "m09-misure",     label: "Le misure di produttività", tappa: "c3" },
          { id: "m09-piacere",    label: "L'archeologo", tappa: "c4" }
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
