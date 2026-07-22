/* ==========================================================================
   WIKI · ESPLORATORE 3D  (il cervello del sapere)
   --------------------------------------------------------------------------
   Trasforma la home in un grafo 3D navigabile: lo scheletro del sapere con i
   rami spenti visibili e i rami scritti illuminati. Si espande ramo per ramo,
   vola sul nodo scelto e apre la pagina dove c'è contenuto.

   Costruito su `3d-force-graph` (three.js + d3-force), caricato da CDN come
   React e MathJax: nessuna build. Legge il grafo da wiki/graph/graph-model.js.

   POTENZIAMENTO PROGRESSIVO, non sostituzione: se manca WebGL o la libreria
   (offline, file:// senza rete) o l'utente ha chiesto meno movimento, il
   cervello non parte e restano le card della Biblioteca, che vivono altrove
   nella pagina. Un'animazione non può mai nascondere contenuto.
   ========================================================================== */

(function () {
  'use strict';

  var ID_HOST = 'wiki-brain';

  /* Accenti del design system, in versione "che brilla su fondo scuro"
     (gli stessi valori del tema scuro di wiki.css). */
  var ACCESO = {
    blu: '#7EA6F0', rosso: '#F08C7E', verde: '#6FC796',
    arancio: '#F0AC63', viola: '#B79BE0'
  };
  /* Nodo spento: non grigio uniforme, ma una tinta scura del suo dominio —
     così i 4 domini diventano 4 lobi cromatici anche dove sono ancora vuoti. */
  var SPENTO_DOM = {
    blu: '#33406b', rosso: '#6a4049', verde: '#3a5745', arancio: '#6b5636', viola: '#4d4064'
  };
  var SPENTO = '#5a6377';
  var LINEA  = 'rgba(150,168,205,0.20)';  /* rami dell'albero, tenui */
  var TIPO_COLORE = { prerequisito: '#F0AC63', approfondisce: '#7EA6F0', collegato: '#6FC796' };

  var DIM_LIVELLO = { dominio: 60, campo: 18, sottocampo: 7, modulo: 16, concetto: 5 };

  function pronto(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function webglOk() {
    try {
      var c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) { return false; }
  }

  var motoRidotto = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  pronto(function () {
    var host = document.getElementById(ID_HOST);
    if (!host) return;                                   /* non è la home */

    /* Requisiti: la libreria, WebGL e il modello del grafo. Se manca qualcosa,
       ci si ritira in silenzio e restano le card. */
    if (typeof ForceGraph3D === 'undefined' || !webglOk() || !window.WIKI_GRAPH || !window.WIKI_SKELETON) {
      host.classList.add('is-fallback');
      return;
    }

    /* Mostra il contenitore PRIMA di costruire il grafo: da nascosto avrebbe
       dimensioni 0×0 e il canvas nascerebbe invisibile. */
    host.classList.add('is-live');

    var G = window.WIKI_GRAPH.build();                   /* { nodes, links, byId, figliDi } */
    var figliDi = G.figliDi;

    function haFigli(n) { return !!(figliDi[n.id] && figliDi[n.id].length); }

    function coloreNodo(n) {
      if (n.level === 'dominio') return ACCESO[n.dominioAccento] || ACCESO.blu;
      if (n.contenuto || n.acceso) return ACCESO[n.dominioAccento] || ACCESO.blu;
      return SPENTO_DOM[n.dominioAccento] || SPENTO;
    }

    /* --- Stato di espansione: quali nodi hanno i figli rivelati ------------
       All'avvio: i domini (per mostrare i campi) e la catena ACCESA fino ai
       moduli — così i rami scritti sbocciano subito, ma i moduli restano
       "boccioli" da cliccare per rivelare i concetti. */
    var espansi = {};
    G.nodes.forEach(function (n) {
      if (n.level === 'dominio') espansi[n.id] = true;
      else if (n.acceso && (n.level === 'campo' || n.level === 'sottocampo')) espansi[n.id] = true;
    });

    function visibile(n) {
      if (n.level === 'dominio') return true;
      return !!espansi[n.parent];
    }

    function datiVisibili() {
      var nodi = G.nodes.filter(visibile);
      var vis = {};
      nodi.forEach(function (n) { vis[n.id] = true; });
      var archi = G.links.filter(function (l) {
        var s = typeof l.source === 'object' ? l.source.id : l.source;
        var t = typeof l.target === 'object' ? l.target.id : l.target;
        return vis[s] && vis[t];
      });
      return { nodes: nodi, links: archi };
    }

    /* --- Il grafo 3D ------------------------------------------------------ */
    var Graph = ForceGraph3D({ controlType: 'orbit' })(host)
      .backgroundColor('rgba(0,0,0,0)')   /* trasparente: dietro c'è la nebulosa CSS */
      .showNavInfo(false)
      .nodeRelSize(6)
      .nodeVal(function (n) { return DIM_LIVELLO[n.level] || 4; })
      .nodeColor(coloreNodo)
      .nodeOpacity(0.96)
      .nodeResolution(16)
      .nodeLabel(function (n) {
        var etich = { dominio: 'Dominio', campo: 'Campo', sottocampo: 'Sottocampo', modulo: 'Modulo', concetto: 'Concetto' };
        var stato = n.contenuto ? 'scritto' : (n.acceso ? 'in arrivo' : 'ancora vuoto');
        return '<div class="w-brain-tip"><b>' + n.label + '</b><br><span>' + (etich[n.level] || n.level) +
               ' · ' + stato + (haFigli(n) ? ' · clic per espandere' : '') + '</span></div>';
      })
      .linkColor(function (l) { return l.kind === 'collegamento' ? (TIPO_COLORE[l.tipo] || TIPO_COLORE.collegato) : LINEA; })
      .linkWidth(function (l) { return l.kind === 'collegamento' ? 0.8 : 0; })
      .linkOpacity(0.5)
      .linkDirectionalParticles(function (l) { return (!motoRidotto && l.kind === 'collegamento') ? 3 : 0; })
      .linkDirectionalParticleSpeed(0.006)
      .linkDirectionalParticleWidth(1.4)
      .onNodeClick(alClick)
      .onBackgroundClick(function () { seleziona(null); });

    /* Rende i rami dell'albero un po' più "morbidi": distanza maggiore per i
       livelli alti, così i domini si respingono e formano lobi separati. */
    if (Graph.d3Force('link')) Graph.d3Force('link').distance(function (l) {
      var s = typeof l.source === 'object' ? l.source : G.byId[l.source];
      return s && s.level === 'dominio' ? 210 : (s && s.level === 'campo' ? 95 : 46);
    });
    if (Graph.d3Force('charge')) Graph.d3Force('charge').strength(-340).distanceMax(800);

    Graph.graphData(datiVisibili());

    /* Inquadra il grafo quando il layout si ferma, ma una volta sola: le
       espansioni successive non devono strappare via la camera. */
    var inquadrato = false;
    Graph.onEngineStop(function () {
      if (inquadrato) return;
      inquadrato = true;
      try { Graph.zoomToFit(900, 34); } catch (e) {}
    });

    /* Rotazione lenta, "il cervello respira". Si ferma appena l'utente tocca. */
    if (!motoRidotto) {
      try {
        var controlli = Graph.controls();
        controlli.autoRotate = true;
        controlli.autoRotateSpeed = 0.45;
        controlli.addEventListener('start', function () { controlli.autoRotate = false; });
      } catch (e) {}
    }

    function ridisegna() { Graph.graphData(datiVisibili()); }

    function volaVerso(n) {
      var d = (DIM_LIVELLO[n.level] || 6) * 6 + 90;
      var r = Math.hypot(n.x || 0, n.y || 0, n.z || 0) || 1;
      var k = 1 + d / r;
      Graph.cameraPosition({ x: (n.x || 0) * k, y: (n.y || 0) * k, z: (n.z || 0) * k }, n, motoRidotto ? 0 : 1100);
    }

    function alClick(n) {
      if (haFigli(n)) { espansi[n.id] = !espansi[n.id]; ridisegna(); }
      volaVerso(n);
      seleziona(n);
    }

    /* --- Sovrapposizione HTML: titolo, aiuto, pannello del nodo ------------ */
    var ui = document.createElement('div');
    ui.className = 'w-brain-ui';
    ui.innerHTML =
      '<div class="w-brain-head">' +
        '<div class="w-brain-kicker">Base di conoscenza · il cervello</div>' +
        '<h2 class="w-brain-title">Esplora il <span>sapere</span></h2>' +
        '<p class="w-brain-hint">Ogni ramo è un campo del sapere. Quelli accesi li abbiamo scritti. ' +
        'Clicca un nodo per aprirlo ramo per ramo · trascina per ruotare · scorri per lo zoom.</p>' +
      '</div>' +
      '<div class="w-brain-panel" hidden></div>' +
      '<button type="button" class="w-brain-reset" hidden>↺ ricomponi</button>';
    host.appendChild(ui);

    var pannello = ui.querySelector('.w-brain-panel');
    var reset = ui.querySelector('.w-brain-reset');

    function seleziona(n) {
      if (!n) { pannello.hidden = true; return; }
      var etich = { dominio: 'Dominio del sapere', campo: 'Campo', sottocampo: 'Sottocampo', modulo: 'Modulo', concetto: 'Concetto' };
      var sentiero = [], p = n;
      while (p) { sentiero.unshift(p.label); p = p.parent ? G.byId[p.parent] : null; }
      var html =
        '<div class="w-brain-path">' + sentiero.slice(0, -1).join(' › ') + '</div>' +
        '<div class="w-brain-name">' + n.label + '</div>' +
        '<div class="w-brain-kind">' + (etich[n.level] || n.level) +
          (n.contenuto ? ' · scritto' : (n.acceso ? ' · in arrivo' : ' · ancora da scrivere')) + '</div>';
      if (n.file) html += '<a class="w-brain-open" href="' + n.file + '">Apri la pagina →</a>';
      else if (haFigli(n)) html += '<div class="w-brain-more">' + (espansi[n.id] ? 'Rami aperti' : 'Clicca il nodo per aprire i rami') + '</div>';
      else html += '<div class="w-brain-more">Ramo ancora vuoto — presto lo riempiremo.</div>';
      pannello.innerHTML = html;
      pannello.hidden = false;
      reset.hidden = false;
    }

    reset.addEventListener('click', function () {
      espansi = {};
      G.nodes.forEach(function (n) {
        if (n.level === 'dominio') espansi[n.id] = true;
        else if (n.acceso && (n.level === 'campo' || n.level === 'sottocampo')) espansi[n.id] = true;
      });
      ridisegna();
      seleziona(null);
      reset.hidden = true;
      setTimeout(function () { try { Graph.zoomToFit(700, 80); } catch (e) {} }, 300);
    });

    /* --- Ridimensionamento ------------------------------------------------ */
    function misura() { Graph.width(host.clientWidth).height(host.clientHeight); }
    misura();
    window.addEventListener('resize', misura);


    /* ====================================================================
       ETICHETTE HTML PROIETTATE
       --------------------------------------------------------------------
       Niente three-spritetext (romperebbe la libreria su file://): si
       proiettano i nodi in coordinate schermo con graph2ScreenCoords e si
       posizionano dei <div> con i font del progetto. Solo i nodi che contano
       (domini, campi, e tutto ciò che è acceso) per non intasare la vista.
       ==================================================================== */
    var stratoEt = document.createElement('div');
    stratoEt.className = 'w-brain-labels';
    host.appendChild(stratoEt);

    var etichette = {};                 /* id → elemento */
    var OFFSET = { dominio: 30, campo: 17, sottocampo: 12, modulo: 15, concetto: 11 };

    function meritaEtichetta(n) {
      return n.level === 'dominio' || n.level === 'campo' || n.acceso || n.contenuto;
    }

    function creaEtichetta(n) {
      var el = document.createElement('div');
      el.className = 'w-brain-label'
        + (n.level === 'dominio' ? ' is-dom' : '')
        + (n.contenuto ? ' is-lit' : (n.acceso ? ' is-on' : ''));
      el.textContent = n.label;
      if (n.contenuto) el.style.color = ACCESO[n.dominioAccento] || '#fff';
      stratoEt.appendChild(el);
      return el;
    }

    function inFronte(n, cam, targ) {
      var fx = targ.x - cam.x, fy = targ.y - cam.y, fz = targ.z - cam.z;
      var vx = n.x - cam.x, vy = n.y - cam.y, vz = n.z - cam.z;
      return (fx * vx + fy * vy + fz * vz) > 0;   /* nodo davanti alla camera */
    }

    function aggiornaEtichette() {
      var cam = Graph.camera(), ctr = Graph.controls();
      var targ = (ctr && ctr.target) ? ctr.target : { x: 0, y: 0, z: 0 };
      var w = host.clientWidth, h = host.clientHeight;
      var visti = {};

      for (var i = 0; i < G.nodes.length; i++) {
        var n = G.nodes[i];
        if (!visibile(n) || !meritaEtichetta(n) || n.x == null) continue;

        var el = etichette[n.id] || (etichette[n.id] = creaEtichetta(n));

        if (!inFronte(n, cam.position, targ)) { el.style.opacity = '0'; continue; }
        var sc = Graph.graph2ScreenCoords(n.x, n.y, n.z);
        if (!sc || sc.x < -60 || sc.x > w + 60 || sc.y < -30 || sc.y > h + 30) { el.style.opacity = '0'; continue; }

        el.style.transform = 'translate(-50%,-50%) translate(' +
          Math.round(sc.x) + 'px,' + Math.round(sc.y + (OFFSET[n.level] || 12)) + 'px)';
        el.style.opacity = '1';
        visti[n.id] = true;
      }
      for (var id in etichette) { if (!visti[id]) etichette[id].style.opacity = '0'; }
      requestAnimationFrame(aggiornaEtichette);
    }
    requestAnimationFrame(aggiornaEtichette);
  });

})();
