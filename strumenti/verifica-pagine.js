/* ==========================================================================
   VERIFICA DELLE PAGINE  (da riga di comando, con Node e un Chrome)
   --------------------------------------------------------------------------
   Apre ogni .dc.html in un browser vero, a larghezza di telefono e di
   scrivania, e controlla le quattro cose che si rompono davvero:

     1. la pagina si è RESA (c'è testo visibile). È il controllo che viene
        prima di tutti: se il runtime non parte, la pagina resta piena di
        markup invisibile e ogni altra verifica passa per finta.
     2. nessun binding {{ … }} è rimasto irrisolto SOTTO GLI OCCHI del lettore
        (si guarda innerText, non il sorgente).
     3. niente spinge la pagina di lato: il corpo non scorre mai in
        orizzontale. Ciò che è più largo dello schermo — un listato, il
        programma di una demo, una tabella — deve scorrere DENTRO il proprio
        riquadro, e questo è permesso.
     4. le demo sono vive (hanno un'altezza), non solo presenti nel DOM.
     5. nessun testo finisce SOPRA altro testo. È il controllo che nessuna
        lettura del markup può fare: due blocchi scritti benissimo, messi in
        due punti che si accavallano.

     node strumenti/verifica-pagine.js                 # tutte le pagine
     node strumenti/verifica-pagine.js Biblioteca.dc.html
     CHROME=/percorso/chrome node strumenti/verifica-pagine.js

   Serve la rete: il runtime carica React da CDN al primo avvio. Se lo script
   dice "PAGINA NON RESA" su tutte le pagine, quasi sempre è la rete, non il
   contenuto.
   ========================================================================== */

'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const RADICE = path.join(__dirname, '..');
const LARGHEZZE = [390, 1280];          /* telefono, scrivania */
const ATTESA_MS = 4000;                 /* tempo dato al runtime per partire */

const CANDIDATI_CHROME = [
  process.env.CHROME,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell'
].filter(Boolean);

const chrome = CANDIDATI_CHROME.find((p) => { try { return fs.existsSync(p); } catch (e) { return false; } });
if (!chrome) {
  console.error('Non trovo un Chrome. Indicalo così:  CHROME=/percorso/chrome node strumenti/verifica-pagine.js');
  process.exit(2);
}

const SONDA = `
<script>
/* Non si misura una pagina mentre MathJax sta ancora impaginando: a metà
   lavoro le formule sporgono davvero, e la pagina risulta larga il doppio per
   qualche centinaio di millisecondi. Chi misura in quell'istante segnala uno
   scorrimento orizzontale che nessun lettore vedrà mai. Quindi: si aspetta la
   promessa di MathJax quando c'è, e comunque il tempo pieno. */
function misura() {
  var vw = document.documentElement.clientWidth;
  var testo = (document.body.innerText || '').trim();
  var demo = 0;
  document.querySelectorAll('.w-demo').forEach(function (d) {
    if (d.getBoundingClientRect().height > 20) demo++;
  });
  var fuori = [];
  document.querySelectorAll('body *').forEach(function (el) {
    var r = el.getBoundingClientRect();
    if (!r.width) return;
    /* Se un antenato scorre, sporgere è legittimo: è contenuto largo dentro
       il suo riquadro, non una pagina rotta. */
    var scorrevole = false, p = el.parentElement;
    while (p && p !== document.body) {
      var sp = getComputedStyle(p).overflowX;
      if (sp === 'auto' || sp === 'scroll' || sp === 'hidden') { scorrevole = true; break; }
      p = p.parentElement;
    }
    if (scorrevole) return;
    var oltre = Math.round(r.right - vw);
    var interno = el.scrollWidth - el.clientWidth;
    var suo = getComputedStyle(el).overflowX;
    if (oltre > 1) fuori.push(el.tagName.toLowerCase() + '.' + (el.className || '?') + ' sporge di ' + oltre + 'px');
    else if (interno > 1 && ['auto', 'scroll', 'hidden'].indexOf(suo) < 0)
      fuori.push(el.tagName.toLowerCase() + '.' + (el.className || '?') + ' ha ' + interno + 'px di contenuto fuori dal suo box');
  });
  /* 5. Niente testo sopra altro testo. Il caso che ha insegnato la lezione:
     il runtime dà a #dc-root height:100%, quindi ciò che segue </x-dc> si
     posizionava come se la pagina finisse allo schermo e cadeva sopra le
     card. Nessun controllo statico poteva vederlo: due blocchi corretti, in
     due punti sbagliati. Si confrontano i rettangoli dei blocchi di testo,
     saltando gli antenati e ciò che galleggia per scelta (fixed). */
  var blocchi = [], accavallati = [];
  document.querySelectorAll('p, li, h1, h2, h3, h4, td, th, .w-tappa-title, .w-note-title, .w-card-title, .w-chip').forEach(function (el) {
    var s = getComputedStyle(el);
    if (s.position === 'fixed' || s.display === 'none' || s.visibility === 'hidden') return;
    var proprio = '';
    for (var i = 0; i < el.childNodes.length; i++) {
      if (el.childNodes[i].nodeType === 3) proprio += el.childNodes[i].textContent;
    }
    if (proprio.trim().length > 2 && el.getBoundingClientRect().width) blocchi.push(el);
  });
  for (var a = 0; a < blocchi.length; a++) {
    for (var b = a + 1; b < blocchi.length; b++) {
      if (blocchi[a].contains(blocchi[b]) || blocchi[b].contains(blocchi[a])) continue;
      var ra = blocchi[a].getBoundingClientRect(), rb = blocchi[b].getBoundingClientRect();
      var ox = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
      var oy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
      if (ox > 4 && oy > 4) {
        accavallati.push('testo sovrapposto (' + Math.round(ox) + '×' + Math.round(oy) + 'px): «' +
          blocchi[a].textContent.trim().slice(0, 24) + '» sopra «' + blocchi[b].textContent.trim().slice(0, 24) + '»');
      }
    }
  }

  var unici = [];
  fuori.concat(accavallati).forEach(function (x) { if (unici.indexOf(x) < 0) unici.push(x.slice(0, 90)); });
  document.title = 'ESITO|' + document.documentElement.scrollWidth + '|' + vw + '|' +
    testo.length + '|' + (testo.match(/\\{\\{[^}]*\\}\\}/g) || []).length + '|' + demo + '|' +
    unici.slice(0, 10).join(' ;; ');
}

setTimeout(function () {
  var pronto = (window.MathJax && window.MathJax.startup && window.MathJax.startup.promise)
             ? window.MathJax.startup.promise : Promise.resolve();
  pronto.then(function () { setTimeout(misura, 600); }, function () { misura(); });
}, ${ATTESA_MS});
</script>
`;

function pagine() {
  const chiesti = process.argv.slice(2);
  if (chiesti.length) return chiesti;
  return fs.readdirSync(RADICE)
    .filter((f) => f.endsWith('.dc.html') && !f.startsWith('_'))
    .sort();
}

function provaUna(file, larghezza) {
  const sorgente = fs.readFileSync(path.join(RADICE, file), 'utf8');
  const tmp = path.join(RADICE, '.verifica-tmp.html');
  fs.writeFileSync(tmp, sorgente.replace('</body>', SONDA + '</body>'));
  try {
    const dom = execFileSync(chrome, [
      '--headless', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
      '--window-size=' + larghezza + ',900',
      '--virtual-time-budget=' + (ATTESA_MS + 9000),
      '--dump-dom', 'file://' + tmp
    ], { encoding: 'utf8', maxBuffer: 80 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });

    const m = dom.match(/<title>ESITO\|(\d+)\|(\d+)\|(\d+)\|(\d+)\|(\d+)\|([^<]*)<\/title>/);
    if (!m) return { ok: false, righe: ['la sonda non è stata eseguita: il browser non ha caricato la pagina'] };

    const [, largaPagina, vw, testo, buchi, demo, lista] = m;
    const righe = [];
    if (parseInt(testo, 10) < 500) righe.push('PAGINA NON RESA: nessun testo visibile (runtime non partito? serve la rete al primo avvio)');
    if (buchi !== '0') righe.push(buchi + ' binding {{ … }} visibili al lettore');
    if (parseInt(largaPagina, 10) > parseInt(vw, 10) + 1) righe.push('la pagina scorre in orizzontale: ' + largaPagina + 'px su ' + vw + 'px di schermo');
    lista.split(' ;; ').filter(Boolean).forEach((x) => righe.push(x));
    return { ok: !righe.length, righe, demo, testo };
  } finally {
    try { fs.unlinkSync(tmp); } catch (e) {}
  }
}

let problemi = 0;
for (const file of pagine()) {
  for (const w of LARGHEZZE) {
    const r = provaUna(file, w);
    if (r.ok) {
      console.log('✓ ' + file + ' @' + w + 'px — ' + r.testo + ' caratteri visibili, ' + r.demo + ' demo vive');
    } else {
      problemi++;
      console.error('✗ ' + file + ' @' + w + 'px');
      r.righe.forEach((x) => console.error('    · ' + x));
    }
  }
}
console.log(problemi ? '\n' + problemi + ' controlli falliti.' : '\nOK · tutte le pagine reggono su telefono e su scrivania.');
process.exit(problemi ? 1 : 0);
