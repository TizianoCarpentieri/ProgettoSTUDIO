/* ==========================================================================
   WIKI · MODELLO DEL GRAFO
   --------------------------------------------------------------------------
   Fonde le DUE fonti del grafo in un unico grafo per il cervello 3D:

     · wiki/graph/skeleton.js   → window.WIKI_SKELETON  (lo scheletro universale)
     · wiki/wiki-index.js       → window.WIKI_INDEX      (ciò che abbiamo scritto)

   Logica pura: niente three.js, niente DOM. Per questo si può caricare tanto
   nel browser (via <script>, espone window.WIKI_GRAPH) quanto in Node (per la
   validazione da riga di comando, senza framework di test — coerente con lo
   zero-build del progetto).

   Gerarchia prodotta:  dominio → campo → sottocampo → modulo → concetto
   ========================================================================== */

(function (root) {
  'use strict';

  /* Ogni dominio del sapere ha un colore, uno dei quattro accenti del design
     system. I figli lo ereditano risalendo la catena dei genitori. */
  var DOMINIO_ACCENTO = {
    'dom-3': 'blu',      /* Scienze Fisiche  (Informatica, Matematica, Fisica…) */
    'dom-1': 'verde',    /* Scienze della Vita */
    'dom-2': 'arancio',  /* Scienze Sociali (Arti e Studi Umanistici…) */
    'dom-4': 'rosso'     /* Scienze della Salute */
  };

  function elencaModuli(index) {
    var out = [];
    (index || []).forEach(function (scaffale) {
      (scaffale.moduli || []).forEach(function (m) { out.push(m); });
    });
    return out;
  }

  /* Costruisce { nodes, links, byId, figliDi } dai due strati. */
  function costruisciGrafo(skeleton, index) {
    var nodes = [];
    var byId = {};

    function aggiungi(n) {
      if (byId[n.id]) return byId[n.id];   /* mai due nodi con lo stesso id */
      byId[n.id] = n;
      nodes.push(n);
      return n;
    }

    /* --- Strato 1: lo scheletro (tutto spento all'inizio) ------------------ */
    (skeleton || []).forEach(function (s) {
      aggiungi({
        id: s.id, label: s.label, level: s.level, parent: s.parent || null,
        contenuto: false, acceso: false, file: null, moduloId: null
      });
    });

    /* --- Strato 2: moduli e concetti (contenuto vero) --------------------- */
    elencaModuli(index).forEach(function (m) {
      if (!m.nodo) return;                 /* "previsto": esiste solo come card */
      var modId = 'mod-' + m.id;

      aggiungi({
        id: modId, label: m.titolo, level: 'modulo', parent: m.nodo,
        contenuto: true, acceso: true, file: m.file || null,
        moduloId: m.id, accento: m.accento || null
      });

      (m.concetti || []).forEach(function (c) {
        aggiungi({
          id: c.id, label: c.label, level: 'concetto', parent: modId,
          contenuto: true, acceso: true, file: m.file || null, moduloId: m.id
        });
      });
    });

    /* --- Dominio radice di ogni nodo (per il colore) ---------------------- */
    var cacheDom = {};
    function dominioDi(id) {
      if (cacheDom[id] !== undefined) return cacheDom[id];
      var n = byId[id], visti = {};
      while (n && n.parent && !visti[n.id]) {
        visti[n.id] = true;
        if (byId[n.parent] && byId[n.parent].level === 'dominio') { break; }
        n = byId[n.parent];
      }
      var domId = n ? (n.level === 'dominio' ? n.id : n.parent) : null;
      cacheDom[id] = domId || null;
      return cacheDom[id];
    }
    nodes.forEach(function (n) {
      n.dominio = dominioDi(n.id);
      /* Colore del cervello: per DOMINIO, così i 4 domini sono 4 regioni
         cromatiche coerenti. L'accento proprio del modulo (per la card della
         homepage) resta in n.accento, ma il grafo usa n.dominioAccento. */
      n.dominioAccento = DOMINIO_ACCENTO[n.dominio] || 'blu';
    });

    /* --- Propagazione dell'accensione: ogni antenato di un contenuto si
           accende (illumina il sentiero dal dominio fino al modulo) --------- */
    nodes.forEach(function (n) {
      if (!n.contenuto) return;
      var p = n.parent, visti = {};
      while (p && byId[p] && !visti[p]) {
        visti[p] = true;
        byId[p].acceso = true;
        p = byId[p].parent;
      }
    });

    /* --- Archi ------------------------------------------------------------ */
    var links = [];
    var figliDi = {};
    nodes.forEach(function (n) {
      if (n.parent && byId[n.parent]) {
        links.push({ source: n.parent, target: n.id, kind: 'albero' });
        (figliDi[n.parent] = figliDi[n.parent] || []).push(n.id);
      }
    });

    /* Collegamenti incrociati dichiarati nei moduli (i "ponti" resi dati). */
    elencaModuli(index).forEach(function (m) {
      (m.collegamenti || []).forEach(function (c) {
        if (byId[c.da] && byId[c.a]) {
          links.push({ source: c.da, target: c.a, kind: 'collegamento', tipo: c.tipo || 'collegato' });
        }
      });
    });

    return { nodes: nodes, links: links, byId: byId, figliDi: figliDi };
  }

  /* Validazione: torna i problemi trovati e qualche statistica. Nessun effetto
     collaterale. Usata dal check Node prima di dichiarare il grafo a posto. */
  function validaGrafo(skeleton, index) {
    var problemi = [];
    var idVisti = {};
    (skeleton || []).forEach(function (s) {
      if (idVisti[s.id]) problemi.push('id duplicato nello scheletro: ' + s.id);
      idVisti[s.id] = true;
    });
    (skeleton || []).forEach(function (s) {
      if (s.parent && !idVisti[s.parent]) problemi.push('parent orfano: ' + s.id + ' → ' + s.parent);
    });

    var g = costruisciGrafo(skeleton, index);
    elencaModuli(index).forEach(function (m) {
      if (m.stato === 'previsto') return;
      if (!m.nodo) { problemi.push('modulo ' + m.id + ' senza campo `nodo`'); return; }
      if (!g.byId[m.nodo]) problemi.push('modulo ' + m.id + ' agganciato a un nodo inesistente: ' + m.nodo);
      (m.concetti || []).forEach(function (c) {
        if (!c.id || !c.label) problemi.push('modulo ' + m.id + ': concetto senza id/label');
      });
      (m.collegamenti || []).forEach(function (c) {
        if (!g.byId[c.da]) problemi.push('modulo ' + m.id + ': collegamento da id inesistente: ' + c.da);
        if (!g.byId[c.a])  problemi.push('modulo ' + m.id + ': collegamento verso id inesistente: ' + c.a);
      });
    });

    var accesi = g.nodes.filter(function (n) { return n.acceso; }).length;
    var contenuto = g.nodes.filter(function (n) { return n.contenuto; }).length;
    return {
      problemi: problemi,
      statistiche: {
        nodiTotali: g.nodes.length, archi: g.links.length,
        nodiAccesi: accesi, nodiContenuto: contenuto,
        nodiSpenti: g.nodes.length - accesi
      }
    };
  }

  var API = {
    DOMINIO_ACCENTO: DOMINIO_ACCENTO,
    costruisciGrafo: costruisciGrafo,
    validaGrafo: validaGrafo,
    /* comodità nel browser: legge le due fonti globali già caricate */
    build: function () { return costruisciGrafo(root.WIKI_SKELETON, root.WIKI_INDEX); }
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  if (root) root.WIKI_GRAPH = API;

})(typeof window !== 'undefined' ? window : this);
