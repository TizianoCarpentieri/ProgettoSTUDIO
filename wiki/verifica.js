#!/usr/bin/env node
/* ==========================================================================
   WIKI · VERIFICA DEI LIBRI
   --------------------------------------------------------------------------
   Uso:  node wiki/verifica.js
         node wiki/verifica.js Dentro-la-Macchina.dc.html    (un file solo)

   Perché esiste. Fino a ieri la forma di un libro era descritta in due
   documenti (AgentFE.md, AgentAutore.md) e garantita da niente. Bastava
   scrivere `w-page` invece di `w-page--toc`, o mettere le tappe fuori da
   `.w-main`, o dimenticare un `id`, e l'indice laterale spariva senza che
   nessuno se ne accorgesse: la pagina resta bella e smette di essere
   navigabile. Questo script rende quella catena controllabile.

   Due severità, e la differenza conta:

     ERRORE   rompe la navigazione o viola uno dei due divieti di AGENTS.md.
              Non è opinabile. Fa uscire lo script con codice 1.
     avviso   sintomo di deriva: il libro funziona ma si sta allontanando
              dagli altri. Non blocca niente — dice dove guardare.

   Nessuna dipendenza, nessuna build: lo stesso vincolo del resto del
   progetto. Non sostituisce la prova nel browser (tema scuro, demo, binding
   `{{ }}` irrisolti): controlla ciò che si può controllare senza aprire una
   finestra, che è quasi tutta la struttura.
   ========================================================================== */

'use strict';

var fs = require('fs');
var path = require('path');

var RADICE = path.join(__dirname, '..');

/* --------------------------------------------------------------------------
   Lettura delle fonti di dati
   --------------------------------------------------------------------------
   `wiki-index.js` e `skeleton.js` sono scritti per il browser: assegnano a
   `window`. Si eseguono qui con una finestra finta, così esiste una sola
   copia di quei dati e non una versione "per Node" che diverge.
   -------------------------------------------------------------------------- */

function caricaFonte(relativo, nome) {
  var sorgente = fs.readFileSync(path.join(RADICE, relativo), 'utf8');
  var finestra = {};
  new Function('window', sorgente)(finestra);
  return finestra[nome];
}

var INDICE = caricaFonte('wiki/wiki-index.js', 'WIKI_INDEX');
var SCHELETRO = caricaFonte('wiki/graph/skeleton.js', 'WIKI_SKELETON');
var CIELO = caricaFonte('wiki/graph/cielo.js', 'WIKI_CIELO');
var MODELLO = require('./graph/graph-model.js');

/* --------------------------------------------------------------------------
   Il registro dei rilievi
   -------------------------------------------------------------------------- */

var rilievi = [];

function segnala(livello, file, messaggio, riga) {
  rilievi.push({ livello: livello, file: file, messaggio: messaggio, riga: riga || null });
}
function errore(file, messaggio, riga) { segnala('ERRORE', file, messaggio, riga); }
function avviso(file, messaggio, riga) { segnala('avviso', file, messaggio, riga); }

/* --------------------------------------------------------------------------
   Attrezzi per leggere l'HTML
   --------------------------------------------------------------------------
   Non è un parser: è quanto basta per rispondere a domande di struttura su
   pagine che scriviamo noi e che seguono un template. Un parser vero sarebbe
   una dipendenza, e le dipendenze qui non ci sono.
   -------------------------------------------------------------------------- */

function riga(html, indice) {
  return html.slice(0, indice).split('\n').length;
}

function haClasse(tag, classe) {
  return new RegExp('class="[^"]*\\b' + classe + '\\b[^"]*"').test(tag);
}

function attributo(tag, nome) {
  var m = tag.match(new RegExp('\\b' + nome + '="([^"]*)"'));
  return m ? m[1] : null;
}

/* Estensione di un elemento che porta una certa classe: dall'inizio del suo
   tag di apertura alla fine del tag di chiusura corrispondente, contando gli
   annidamenti dello stesso nome di tag. */
function regioni(html, classe) {
  var trovate = [];
  var cerca = new RegExp('class="[^"]*\\b' + classe + '\\b[^"]*"', 'g');
  var m;

  while ((m = cerca.exec(html))) {
    var apre = html.lastIndexOf('<', m.index);
    if (apre < 0) continue;

    var nome = (html.slice(apre + 1).match(/^[a-zA-Z][\w-]*/) || [])[0];
    var fineApertura = html.indexOf('>', m.index);
    if (!nome || fineApertura < 0) continue;

    var profondita = 1;
    var fine = html.length;
    var tag = new RegExp('<(/?)' + nome + '\\b', 'g');
    tag.lastIndex = fineApertura + 1;
    var t;

    while (profondita > 0 && (t = tag.exec(html))) {
      profondita += t[1] ? -1 : 1;
      if (profondita === 0) fine = tag.lastIndex;
    }

    trovate.push([apre, fine]);
    cerca.lastIndex = fine;   /* la prossima ricerca riparte dopo il blocco */
  }
  return trovate;
}

/* Regioni delimitate da una coppia fissa di marcatori: script e commenti.
   I commenti servono esclusi perché le pagine CITANO le regole («mai
   style="…"») e una citazione non è una violazione. */
function regioniFra(html, apertura, chiusura) {
  var trovate = [];
  var i = 0;
  while ((i = html.indexOf(apertura, i)) >= 0) {
    var fine = html.indexOf(chiusura, i + apertura.length);
    fine = fine < 0 ? html.length : fine + chiusura.length;
    trovate.push([i, fine]);
    i = fine;
  }
  return trovate;
}

function regioniIgnorate(html) {
  return regioniFra(html, '<script', '</script>').concat(regioniFra(html, '<!--', '-->'));
}

function dentro(elenco, indice) {
  for (var i = 0; i < elenco.length; i++) {
    if (indice >= elenco[i][0] && indice <= elenco[i][1]) return true;
  }
  return false;
}

/* Le sezioni della pagina, in ordine di apparizione, con la loro estensione
   (una sezione arriva fino all'inizio della successiva: non si annidano). */
function sezioni(html) {
  var trovate = [];
  var re = /<section\b[^>]*>/g;
  var m;
  while ((m = re.exec(html))) {
    trovate.push({ tag: m[0], inizio: m.index, id: attributo(m[0], 'id') });
  }
  trovate.forEach(function (s, i) {
    s.fine = i + 1 < trovate.length ? trovate[i + 1].inizio : html.length;
    s.corpo = html.slice(s.inizio, s.fine);
  });
  return trovate;
}

function conta(testo, ago) {
  return testo.split(ago).length - 1;
}

/* ==========================================================================
   1. LA CATENA DELL'INDICE LATERALE
   --------------------------------------------------------------------------
   Sono le condizioni che `wiki.js:105-148` richiede per costruire l'indice.
   Se una salta, l'indice non c'è — e la pagina non lo dice.
   ========================================================================== */

function verificaIndiceLaterale(file, html) {
  var pagina = regioni(html, 'w-page--toc');
  if (!pagina.length) {
    errore(file, 'manca `w-page--toc`: senza quel contenitore la pagina non ha ' +
                 'indice laterale (wiki.js lo cerca lì). Le pagine a colonna singola ' +
                 'usano `w-page`, ma un libro non è una pagina a colonna singola');
    return;
  }

  var corpoPagina = html.slice(pagina[0][0], pagina[0][1]);

  if (!/class="[^"]*\bw-main\b/.test(corpoPagina)) {
    errore(file, 'manca `w-main` dentro `w-page--toc`: l\'indice si costruisce ' +
                 'leggendo le tappe dentro la colonna di lettura');
    return;
  }

  var main = regioni(corpoPagina, 'w-main')[0];
  var corpoMain = corpoPagina.slice(main[0], main[1]);
  var tappeDentro = (corpoMain.match(/<section\b[^>]*class="[^"]*\bw-tappa\b/g) || []).length;
  var tappeTotali = (html.match(/<section\b[^>]*class="[^"]*\bw-tappa\b/g) || []).length;

  if (tappeDentro === 0) {
    errore(file, 'nessuna tappa dentro `w-main`: l\'indice resterebbe vuoto');
  } else if (tappeDentro < tappeTotali) {
    errore(file, (tappeTotali - tappeDentro) + ' tappe stanno fuori da `w-main`: ' +
                 'non compariranno nell\'indice');
  }

  if (!/<aside\b[^>]*class="[^"]*\bw-toc\b/.test(html)) {
    avviso(file, 'nessun `<aside class="w-toc">` scritto nella pagina: l\'indice ' +
                 'viene creato lo stesso, ma senza titolo né piede (`data-titolo`, `data-pie`)');
  } else {
    var aside = (html.match(/<aside\b[^>]*class="[^"]*\bw-toc\b[^>]*>/) || [])[0] || '';
    if (!attributo(aside, 'data-titolo')) {
      avviso(file, 'l\'indice laterale non ha `data-titolo`: si intitolerà "Indice" ' +
                   'invece di "Modulo NN · Indice"');
    }
  }
}

/* ==========================================================================
   2. LE TAPPE
   --------------------------------------------------------------------------
   Numerazione consecutiva `c1…cN` più `#fine`. Gli id non sono decorazione:
   sono le àncore su cui puntano l'indice, i ponti fra libri e — da oggi — i
   concetti del grafo.

   Qui vive anche LA CHIUSURA DI TAPPA, la convenzione del Modulo 01 scelta
   come standard per tutta la biblioteca:

       … → w-note--expert → w-note--paper

   cioè: prima il premio per chi ha letto fino in fondo, poi le fonti che
   reggono quello che si è appena affermato. Il Modulo 01 la rispetta 9 volte
   su 9, ed è il motivo per cui si legge come un libro solo invece che come
   nove pagine affiancate. Sono avvisi, non errori: aggiungere un riquadro
   fonti significa trovare fonti vere, e quello lo fa una persona, non un
   controllo.
   ========================================================================== */

function verificaTappe(file, html) {
  var tutte = sezioni(html).filter(function (s) { return haClasse(s.tag, 'w-tappa'); });
  var normali = tutte.filter(function (s) { return !haClasse(s.tag, 'w-tappa--fine'); });
  var finali = tutte.filter(function (s) { return haClasse(s.tag, 'w-tappa--fine'); });

  if (!normali.length) errore(file, 'nessuna tappa `w-tappa` con id');

  normali.forEach(function (s, i) {
    var atteso = 'c' + (i + 1);
    if (!s.id) {
      errore(file, 'tappa in posizione ' + (i + 1) + ' senza `id`: non è raggiungibile ' +
                   'né dall\'indice né dal grafo', riga(html, s.inizio));
    } else if (s.id !== atteso) {
      errore(file, 'tappa in posizione ' + (i + 1) + ' ha id `' + s.id + '`, atteso `' +
                   atteso + '`: la numerazione dev\'essere consecutiva', riga(html, s.inizio));
    }
    if (!/class="[^"]*\bw-tappa-title\b/.test(s.corpo)) {
      errore(file, 'tappa `' + (s.id || i + 1) + '` senza `w-tappa-title`: nell\'indice ' +
                   'comparirebbe il suo id al posto del titolo', riga(html, s.inizio));
    }
    if (!/class="[^"]*\bw-tappa-lead\b/.test(s.corpo)) {
      avviso(file, 'tappa `' + (s.id || i + 1) + '` senza `w-tappa-lead`: è la frase che ' +
                   'aggancia al noto (principio 1 di AgentAutore.md)', riga(html, s.inizio));
    }
    var esperti = conta(s.corpo, 'w-note--expert');
    if (esperti > 2) {
      avviso(file, 'tappa `' + (s.id || i + 1) + '` ha ' + esperti + ' riquadri ' +
                   '`w-note--expert`: sopra i due il libro cambia pubblico senza dirlo',
                   riga(html, s.inizio));
    }

    /* La chiusura di tappa del Modulo 01 — vedi il blocco qui sotto. */
    if (!esperti) {
      avviso(file, 'tappa `' + (s.id || i + 1) + '` non chiude con `w-note--expert`',
             riga(html, s.inizio));
    }
    if (!conta(s.corpo, 'w-note--paper')) {
      avviso(file, 'tappa `' + (s.id || i + 1) + '` non chiude con `w-note--paper`: ' +
                   'le affermazioni si ancorano dove vengono fatte', riga(html, s.inizio));
    } else {
      var ultimoE = s.corpo.lastIndexOf('w-note--expert');
      var ultimoP = s.corpo.lastIndexOf('w-note--paper');
      if (ultimoE >= 0 && ultimoP < ultimoE) {
        avviso(file, 'tappa `' + (s.id || i + 1) + '`: le fonti vengono prima del livello ' +
                     'esperto. L\'ordine è esperto → fonti', riga(html, s.inizio));
      }
    }
  });

  /* Il capolettera è un accento, non un'intestazione: se apre ogni tappa
     smette di segnalare qualcosa. Il Modulo 01 ne usa tre su nove. */
  var conDrop = normali.filter(function (s) { return /class="[^"]*\bw-drop\b/.test(s.corpo); }).length;
  if (normali.length >= 4 && conDrop > Math.ceil(normali.length / 2)) {
    avviso(file, 'il capolettera `w-drop` apre ' + conDrop + ' tappe su ' + normali.length +
                 ': se è ovunque non comunica più niente (il Modulo 01 ne usa 3 su 9)');
  }

  if (!finali.length) {
    errore(file, 'manca l\'epilogo `<section class="w-tappa w-tappa--fine" id="fine">`');
  } else if (finali[0].id !== 'fine') {
    errore(file, 'l\'epilogo ha id `' + finali[0].id + '`, atteso `fine`', riga(html, finali[0].inizio));
  }

  return normali;
}

/* ==========================================================================
   3. I DUE DIVIETI DI AGENTS.md
   --------------------------------------------------------------------------
   Mai `style="..."`, mai colori scritti a mano. L'eccezione dichiarata in
   AgentFE.md sono le demo, dove uno stile calcolato è il punto stesso della
   demo. Fuori di lì è un errore: ogni eccezione fatta oggi è una pagina che
   resterà indietro il giorno in cui si cambia il tema.
   ========================================================================== */

function verificaStili(file, html) {
  var demo = regioni(html, 'w-demo');
  var ignorate = regioniIgnorate(html);
  var esente = function (i) { return dentro(demo, i) || dentro(ignorate, i); };

  var re = /style="/g;
  var m;
  while ((m = re.exec(html))) {
    if (esente(m.index)) continue;
    var frammento = html.slice(m.index, html.indexOf('"', m.index + 7) + 1);
    errore(file, 'stile inline fuori da una demo: ' +
                 (frammento.length > 70 ? frammento.slice(0, 67) + '…"' : frammento),
           riga(html, m.index));
  }

  var colore = /#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?\b|\b(?:rgb|hsl)a?\(/g;
  while ((m = colore.exec(html))) {
    if (dentro(ignorate, m.index)) continue;
    var dove = dentro(demo, m.index);
    var testo = 'colore scritto a mano (`' + m[0] + '`): usa i token `var(--blu)`, ' +
                '`var(--ink)`… o le classi `a-*`';
    if (dove) avviso(file, testo + ' — è dentro una demo, ma vale lo stesso', riga(html, m.index));
    else errore(file, testo, riga(html, m.index));
  }
}

/* ==========================================================================
   3-bis. LE ICONE LE METTE IL FOGLIO DI STILE
   --------------------------------------------------------------------------
   Diverse classi disegnano da sole la loro icona (`.w-nav-next::after` la
   freccia, i `w-note--*` il loro simbolo). Scriverla anche nel testo la
   raddoppia — un difetto che si vede a schermo e non si vede nel markup, e
   che infatti è già successo convertendo i due libri.
   ========================================================================== */

var SIMBOLI = /[←-⇿☀-➿⬀-⯿️\u{1F300}-\u{1FAFF}]/u;

function verificaIcone(file, html) {
  var re = /<a\b[^>]*class="[^"]*\bw-nav-next\b[^"]*"[^>]*>([\s\S]*?)<\/a>/g;
  var m;
  while ((m = re.exec(html))) {
    if (SIMBOLI.test(m[1])) {
      errore(file, '`w-nav-next` contiene una freccia scritta a mano: la disegna già ' +
                   '`.w-nav-next::after`, quindi a schermo se ne vedono due', riga(html, m.index));
    }
  }

  var note = regioni(html, 'w-note');
  var titolo = /<span\b[^>]*class="[^"]*\bw-note-title\b[^"]*"[^>]*>([\s\S]*?)<\/span>/g;
  while ((m = titolo.exec(html))) {
    if (dentro(note, m.index) && SIMBOLI.test(m[1])) {
      avviso(file, 'emoji nel titolo di un riquadro («' + m[1].trim().slice(0, 30) +
                   '»): l\'icona la mette già il foglio di stile', riga(html, m.index));
    }
  }
}

/* ==========================================================================
   4. L'IMPALCATURA DEL LIBRO
   --------------------------------------------------------------------------
   Le parti che rendono un libro riconoscibile come tale. Sono avvisi, non
   errori: una pagina senza copertina funziona. Ma se un libro nuovo ne salta
   tre, non è più lo stesso oggetto degli altri — ed è esattamente così che
   una biblioteca si sfalda, un pezzo alla volta.
   ========================================================================== */

var IMPALCATURA = [
  { classe: 'w-nav',          nome: 'la barra delle briciole (`w-nav`)' },
  { classe: 'w-hero',         nome: 'la copertina (`w-hero`)' },
  /* L'apertura orienta il lettore in uno dei due modi in uso: dicendogli cosa
     imparerà, o insegnandogli il codice dei colori. Uno dei due basta. */
  { classe: ['w-note--info', 'w-legenda'],
    nome: 'l\'apertura che orienta: «cosa impari» (`w-note--info`) o la legenda delle penne (`w-legenda`)' },
  { classe: 'w-summary',      nome: 'il sommario delle tappe (`w-summary`)' },
  { classe: 'w-note--bridge', nome: 'il ponte verso un altro libro (`w-note--bridge`)' },
  { classe: 'w-footer',       nome: 'il piede (`w-footer`)' },
  { classe: 'w-note--paper',  nome: 'almeno un riquadro fonti (`w-note--paper`, principio 4)' },
  { classe: 'w-drop',         nome: 'almeno un capolettera (`w-drop`)' }
];

function verificaImpalcatura(file, html) {
  IMPALCATURA.forEach(function (parte) {
    var alternative = [].concat(parte.classe);
    var presente = alternative.some(function (c) {
      return new RegExp('class="[^"]*\\b' + c + '\\b').test(html);
    });
    if (!presente) avviso(file, 'manca ' + parte.nome);
  });
}

/* ==========================================================================
   5. IL CONTRATTO FRA IL LIBRO E IL GRAFO
   --------------------------------------------------------------------------
   Ogni `concetto` dichiarato in wiki-index.js è una tappa del libro, e lo
   dichiara con il campo `tappa`. È ciò che permette al grafo di aprire il
   libro AL PUNTO GIUSTO invece che in cima. Se la corrispondenza si rompe —
   una sezione rinominata, una tappa aggiunta — dev'essere un errore rumoroso,
   non un collegamento che porta nel posto sbagliato.
   ========================================================================== */

function verificaConcetti(file, html, modulo, tappe) {
  var concetti = modulo.concetti || [];
  var idTappe = tappe.map(function (t) { return t.id; });

  if (!concetti.length) {
    if (modulo.nodo) {
      errore('wiki/wiki-index.js', 'modulo ' + modulo.id + ': nessun `concetti`, ' +
             'il libro resta un nodo solo nel grafo');
    }
    return;
  }

  if (concetti.length !== tappe.length) {
    errore('wiki/wiki-index.js', 'modulo ' + modulo.id + ': ' + concetti.length +
           ' concetti per ' + tappe.length + ' tappe. Devono corrispondere uno a uno');
  }

  concetti.forEach(function (c, i) {
    if (!c.tappa) {
      errore('wiki/wiki-index.js', 'modulo ' + modulo.id + ': il concetto `' + c.id +
             '` non dichiara la sua `tappa`');
      return;
    }
    if (idTappe.indexOf(c.tappa) < 0) {
      errore('wiki/wiki-index.js', 'modulo ' + modulo.id + ': il concetto `' + c.id +
             '` punta alla tappa `' + c.tappa + '`, che in ' + file + ' non esiste');
      return;
    }
    if (idTappe[i] && c.tappa !== idTappe[i]) {
      avviso('wiki/wiki-index.js', 'modulo ' + modulo.id + ': il concetto `' + c.id +
             '` è in posizione ' + (i + 1) + ' ma punta a `' + c.tappa +
             '`. L\'ordine dei concetti dovrebbe seguire quello delle tappe');
    }
  });
}

/* ==========================================================================
   6. L'INDICE DELLA BIBLIOTECA
   ========================================================================== */

var STATI = ['pronto', 'bozza', 'previsto'];
var ACCENTI = ['blu', 'rosso', 'verde', 'arancio', 'viola'];

function verificaIndice() {
  var file = 'wiki/wiki-index.js';
  var slugVisti = {};
  var idVisti = {};

  (INDICE || []).forEach(function (scaffale, i) {
    var dove = 'scaffale «' + (scaffale.scaffale || '#' + (i + 1)) + '»';

    if (!scaffale.scaffale) errore(file, dove + ': manca il nome');
    if (!scaffale.slug) {
      errore(file, dove + ': manca `slug`, l\'identificatore della sua vista ' +
             '(Biblioteca.dc.html#scaffale=…)');
    } else if (!/^[a-z0-9-]+$/.test(scaffale.slug)) {
      errore(file, dove + ': `slug` "' + scaffale.slug + '" non valido (minuscole, cifre, trattini)');
    } else if (slugVisti[scaffale.slug]) {
      errore(file, dove + ': `slug` "' + scaffale.slug + '" già usato da un altro scaffale');
    }
    if (scaffale.slug) slugVisti[scaffale.slug] = true;

    if (scaffale.accento && ACCENTI.indexOf(scaffale.accento) < 0) {
      errore(file, dove + ': accento "' + scaffale.accento + '" inesistente');
    } else if (!scaffale.accento) {
      avviso(file, dove + ': senza `accento` non ha un colore proprio nella sala');
    }
    if (!scaffale.descrizione) {
      avviso(file, dove + ': senza `descrizione` la sala non può dire di cosa tratta');
    }

    (scaffale.moduli || []).forEach(function (m) {
      var q = 'modulo ' + (m.id || '?');
      if (!m.id) errore(file, dove + ': un modulo senza `id`');
      else if (idVisti[m.id]) errore(file, q + ': id duplicato');
      idVisti[m.id] = true;

      if (!m.titolo) errore(file, q + ': manca `titolo`');
      if (!m.sottotitolo) avviso(file, q + ': manca `sottotitolo`, la card resta muta');
      if (STATI.indexOf(m.stato) < 0) errore(file, q + ': stato "' + m.stato + '" inesistente (' + STATI.join(' | ') + ')');
      if (ACCENTI.indexOf(m.accento) < 0) errore(file, q + ': accento "' + m.accento + '" inesistente');
      if (m.stato === 'pronto' && !m.file) errore(file, q + ': dichiarato `pronto` ma senza `file`');
      if (m.file && !fs.existsSync(path.join(RADICE, m.file))) errore(file, q + ': il file `' + m.file + '` non esiste');
      if (m.file && !m.nodo) avviso(file, q + ': senza `nodo` resta spento nel grafo');
    });
  });
}

/* ==========================================================================
   7. IL GRAFO
   --------------------------------------------------------------------------
   Delegato a graph-model.js, che è la stessa logica usata dal browser: un
   controllo che passasse qui e fallisse lì non servirebbe a niente.
   ========================================================================== */

function verificaGrafo() {
  var esito = MODELLO.validaGrafo(SCHELETRO, INDICE, CIELO);
  esito.problemi.forEach(function (p) { errore('wiki/graph/', p); });
  return esito.statistiche;
}

/* ==========================================================================
   Esecuzione e rapporto
   ========================================================================== */

function moduliConFile() {
  var out = [];
  (INDICE || []).forEach(function (s) {
    (s.moduli || []).forEach(function (m) { if (m.file) out.push(m); });
  });
  return out;
}

function verificaLibro(modulo) {
  var assoluto = path.join(RADICE, modulo.file);
  if (!fs.existsSync(assoluto)) return;              /* già segnalato dall'indice */
  var html = fs.readFileSync(assoluto, 'utf8');

  verificaIndiceLaterale(modulo.file, html);
  var tappe = verificaTappe(modulo.file, html);
  verificaStili(modulo.file, html);
  verificaIcone(modulo.file, html);
  verificaImpalcatura(modulo.file, html);
  verificaConcetti(modulo.file, html, modulo, tappe);
}

function verificaTemplate() {
  var file = '_TEMPLATE.dc.html';
  var assoluto = path.join(RADICE, file);
  if (!fs.existsSync(assoluto)) { errore(file, 'il template non esiste'); return; }
  var html = fs.readFileSync(assoluto, 'utf8');

  /* Il template è lo stampo: se è storto lui, nasce storto ogni libro. Le
     tappe sono due d'esempio, quindi si controlla la struttura, non il conto. */
  verificaIndiceLaterale(file, html);
  verificaTappe(file, html);
  verificaStili(file, html);
  verificaIcone(file, html);
  verificaImpalcatura(file, html);
}

function rapporto(statistiche) {
  var perFile = {};
  rilievi.forEach(function (r) { (perFile[r.file] = perFile[r.file] || []).push(r); });

  var nomi = Object.keys(perFile).sort();
  console.log('\nBiblioteca · verifica dei libri\n');

  if (!nomi.length) console.log('  Nessun rilievo.\n');

  nomi.forEach(function (nome) {
    console.log('  ' + nome);
    perFile[nome]
      .sort(function (a, b) { return (a.riga || 0) - (b.riga || 0); })
      .forEach(function (r) {
        var posizione = r.riga ? 'riga ' + r.riga + ' · ' : '';
        console.log('    ' + (r.livello === 'ERRORE' ? 'ERRORE' : 'avviso') + '  ' + posizione + r.messaggio);
      });
    console.log('');
  });

  var errori = rilievi.filter(function (r) { return r.livello === 'ERRORE'; }).length;
  var avvisi = rilievi.length - errori;

  console.log('  Grafo: ' + statistiche.nodiTotali + ' nodi, ' + statistiche.archi +
              ' archi, ' + statistiche.nodiContenuto + ' con contenuto.');
  console.log('  ' + errori + (errori === 1 ? ' errore' : ' errori') + ', ' +
              avvisi + (avvisi === 1 ? ' avviso' : ' avvisi') + '.\n');

  return errori;
}

function principale() {
  var soloQuesto = process.argv[2];

  verificaIndice();
  var statistiche = verificaGrafo();

  var moduli = moduliConFile();
  if (soloQuesto) {
    moduli = moduli.filter(function (m) { return m.file === soloQuesto; });
    if (!moduli.length && soloQuesto !== '_TEMPLATE.dc.html') {
      console.error('Nessun modulo di wiki-index.js corrisponde a "' + soloQuesto + '".');
      process.exit(2);
    }
    rilievi.length = 0;                              /* rapporto sul solo file chiesto */
  }

  moduli.forEach(verificaLibro);
  if (!soloQuesto || soloQuesto === '_TEMPLATE.dc.html') verificaTemplate();

  process.exit(rapporto(statistiche) ? 1 : 0);
}

principale();
