/* ==========================================================================
   WIKI · VALIDATORE DEL GRAFO  (da riga di comando, con Node)
   --------------------------------------------------------------------------
   Controlla che le due fonti del grafo siano coerenti PRIMA di dichiarare
   finita una pagina nuova. Nessun framework di test: solo Node, coerente con
   lo zero-build del progetto.

     node wiki/graph/valida.js

   Esce con codice 0 se tutto è a posto, 1 se trova problemi (utile in un hook
   o in CI). Controlla: id duplicati, parent orfani nello scheletro, moduli
   agganciati a nodi inesistenti, collegamenti verso id inesistenti.
   ========================================================================== */

global.window = global;
var path = require('path');
var dir = __dirname;

require(path.join(dir, 'skeleton.js'));       /* → global.WIKI_SKELETON */
require(path.join(dir, '..', 'wiki-index.js')); /* → global.WIKI_INDEX */
var model = require(path.join(dir, 'graph-model.js'));

var r = model.validaGrafo(global.WIKI_SKELETON, global.WIKI_INDEX);
console.log('Grafo del sapere — ' + JSON.stringify(r.statistiche));

if (!r.problemi.length) {
  console.log('OK · nessun problema. Il grafo è coerente.');
  process.exit(0);
}
console.error('\nTrovati ' + r.problemi.length + ' problemi:');
r.problemi.forEach(function (p) { console.error('  · ' + p); });
process.exit(1);
