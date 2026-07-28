/* ==========================================================================
   WIKI · IL CIELO DEL SAPERE  (lo strato che si naviga)
   --------------------------------------------------------------------------
   Otto regioni. Sono la porta d'ingresso della biblioteca: quello che vedi
   quando apri la home, prima di qualunque libro.

   Perché esistono. Sotto c'è la gerarchia di OpenAlex — 4 domini, 26 campi,
   252 sottocampi — che è una tassonomia della *ricerca accademica*: precisa,
   completa, e con vertici che a un lettore curioso non dicono niente
   («Scienze della Salute», «Scienze delle Decisioni»). Serviva profondità, e
   OpenAlex la dà; serviva una porta d'ingresso umana, e OpenAlex no. Questo
   file è la porta: raggruppa i 26 campi in otto regioni con un nome che
   significa qualcosa per chi arriva, e lascia intatto tutto ciò che sta
   sotto. Si entra da «Le macchine che pensano», non da «Scienze Fisiche», e
   due clic più giù si è comunque dentro la mappa vera.

   Ogni regione:
     id        "reg-…"
     label     il nome che si legge nel cielo
     tinta     il token colore della regione (--reg-… in wiki.css)
     campi     gli id dei campi OpenAlex che ci vivono (skeleton.js)
     attesa    che cosa ci andrà, quando il ramo è ancora spento. Non è un
               riempitivo: è la promessa che rende il vuoto un invito invece
               che un buco.

   I 26 campi sono coperti tutti: nessuna regione orfana, nessun campo senza
   casa. Lo controlla `node wiki/verifica.js`.
   ========================================================================== */

window.WIKI_CIELO = [

  {
    id: "reg-macchine",
    label: "Le macchine che pensano",
    tinta: "macchine",
    campi: ["fld-17", "fld-18"],
    attesa: "Come una macchina arriva a scrivere, a decidere, a sbagliare. È la regione da cui questa biblioteca è partita."
  },

  {
    id: "reg-numeri",
    label: "Il linguaggio dei numeri",
    tinta: "numeri",
    campi: ["fld-26"],
    attesa: "La lingua con cui si dicono le cose che il linguaggio comune non regge: quantità, struttura, incertezza, cambiamento."
  },

  {
    id: "reg-materia",
    label: "La materia e il cosmo",
    tinta: "materia",
    campi: ["fld-31", "fld-16", "fld-25", "fld-19", "fld-21"],
    attesa: "Di che cosa è fatto quello che tocchi, e di che cosa è fatto quello che non potrai mai toccare."
  },

  {
    id: "reg-vivente",
    label: "Il vivente",
    tinta: "vivente",
    campi: ["fld-11", "fld-13", "fld-24", "fld-28", "fld-30"],
    attesa: "La chimica che a un certo punto ha cominciato a copiarsi da sola, e tutto quello che ne è seguito."
  },

  {
    id: "reg-corpo",
    label: "Il corpo e la cura",
    tinta: "corpo",
    campi: ["fld-27", "fld-29", "fld-34", "fld-35", "fld-36"],
    attesa: "Che cosa succede quando il vivente sei tu, e qualcosa non funziona."
  },

  {
    id: "reg-costruire",
    label: "Costruire il mondo",
    tinta: "costruire",
    campi: ["fld-22", "fld-15", "fld-23"],
    attesa: "Il salto dal capire al fare: ponti, motori, reti, e il conto che il pianeta presenta."
  },

  {
    id: "reg-societa",
    label: "La mente e le società",
    tinta: "societa",
    campi: ["fld-32", "fld-33", "fld-20", "fld-14"],
    attesa: "Perché una persona sceglie quello che sceglie, e che cosa succede quando le persone sono milioni."
  },

  {
    id: "reg-parole",
    label: "Le parole e le forme",
    tinta: "parole",
    campi: ["fld-12"],
    attesa: "Storia, filosofia, lingue, musica, immagini: tutto ciò che l'umanità ha fatto per dirsi chi è."
  }

];
