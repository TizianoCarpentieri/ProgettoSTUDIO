/* ==========================================================================
   WIKI · LA MAPPA DEL SAPERE
   --------------------------------------------------------------------------
   La home della biblioteca. Non è un ornamento in fondo alla pagina: è la
   porta d'ingresso, ed è il modo con cui si arriva a un libro — anzi, alla
   singola tappa di un libro.

   L'IDEA, IN UNA RIGA: una mappa ha livelli di zoom.

   Il difetto della versione precedente non era mostrare tutto lo scibile: era
   mostrarlo tutto alla stessa distanza. Trecento nodi in una schermata non si
   leggono e non si cliccano, e da lì nasceva la tentazione di rimpicciolire
   la mappa — che è esattamente ciò che questo progetto non deve fare. Nessuno
   dice che un mappamondo è inutile perché non ci si leggono i numeri civici:
   ci si avvicina. Qui ci si avvicina in tre passi, e a ogni passo restano
   poche decine di nodi.

       IL CIELO       le otto regioni del sapere        (wiki/graph/cielo.js)
         └ LA REGIONE   i suoi campi                    (OpenAlex)
             └ IL CAMPO   i suoi rami e i libri che ci vivono
                 └ IL LIBRO  le sue tappe → aprono la pagina AL PUNTO GIUSTO

   I RAMI SPENTI NON SI NASCONDONO. Sono la parte più importante della mappa:
   dicono quanto sapere c'è ancora da scrivere. Cliccandone uno non si trova
   un vicolo cieco ma la promessa di che cosa ci andrà — il campo `attesa`
   delle regioni. Il vuoto è un invito, non un buco.

   Costruita su `3d-force-graph` (three.js + d3-force) da CDN: nessuna build.
   POTENZIAMENTO PROGRESSIVO: se manca WebGL, la libreria o la rete, la mappa
   non parte e resta l'indice testuale della pagina, che è completo. Una
   visualizzazione non può mai essere l'unico modo di raggiungere una cosa.
   ========================================================================== */

(function () {
  'use strict';

  var ID_HOST = 'wiki-mappa';

  /* I colori NON stanno qui: stanno in wiki.css come token `--reg-*` e si
     leggono a runtime. Un canvas ha bisogno di valori, non di classi, ed è
     così che nella versione precedente erano finiti dodici colori scritti a
     mano dentro il codice — cioè il divieto n. 2 di AGENTS.md. */
  function token(nome, ripiego) {
    try {
      var v = getComputedStyle(document.documentElement).getPropertyValue(nome);
      return (v || '').trim() || ripiego;
    } catch (e) { return ripiego; }
  }
  function tintaDi(n) { return token('--reg-' + (n.tinta || 'macchine'), '#7EA6F0'); }

  /* Un ramo spento tiene la tinta della sua regione, molto scurita: da lontano
     la mappa resta divisa in zone di colore anche dov'è tutta da scrivere. */
  function spegni(hex) {
    var m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
    if (!m) return '#39404f';
    return '#' + [1, 2, 3].map(function (i) {
      var v = Math.round(parseInt(m[i], 16) * 0.40 + 20);
      return ('0' + Math.min(255, v).toString(16)).slice(-2);
    }).join('');
  }

  /* La stessa tinta, tirata verso il fondo notturno: serve per il testo, dove
     `spegni` sarebbe troppo scuro per restare leggibile. */
  function smorza(hex) {
    var m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
    if (!m) return '#8d97ad';
    return '#' + [1, 2, 3].map(function (i) {
      var v = Math.round(parseInt(m[i], 16) * 0.62 + 22);
      return ('0' + Math.min(255, v).toString(16)).slice(-2);
    }).join('');
  }

  var DIM = { regione: 130, campo: 26, sottocampo: 7, modulo: 22, concetto: 6 };
  var REL = 6;   /* nodeRelSize: il raggio del nodo è cbrt(DIM) * REL */
  var NOME  = { regione: 'Regione del sapere', campo: 'Campo', sottocampo: 'Ramo',
                modulo: 'Libro', concetto: 'Tappa' };

  function pronto(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function webglOk() {
    try {
      var c = document.createElement('canvas');
      return !!window.WebGLRenderingContext && !!(c.getContext('webgl') || c.getContext('experimental-webgl'));
    } catch (e) { return false; }
  }

  var motoRidotto = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  pronto(function () {
    var host = document.getElementById(ID_HOST);
    if (!host) return;

    var avviso = document.querySelector('.w-mappa-nope');

    if (typeof ForceGraph3D === 'undefined' || !webglOk() ||
        !window.WIKI_GRAPH || !window.WIKI_SKELETON || !window.WIKI_CIELO) {
      if (avviso) avviso.hidden = false;
      return;
    }

    var G = window.WIKI_GRAPH.build();
    var figliDi = G.figliDi;
    host.classList.add('is-live');

    /* --- Le regioni si dispongono a mano, non a forza -----------------------
       Le otto regioni non hanno archi fra loro: sono otto radici. Lasciate al
       motore a forze si respingono e basta, quindi scappano all'infinito e la
       mappa non si inquadra più. E anche potendo, non converrebbe: un cielo
       fatto sempre uguale si impara, uno che cambia a ogni visita no. Si
       fissano su una sfera con la spirale aurea — la distribuzione più
       uniforme che si ottenga per punti su una sfera — e restano lì. */
    (function disponiIlCielo() {
      var regioni = G.nodes.filter(function (n) { return n.level === 'regione'; });
      var R = 300;
      var aureo = Math.PI * (3 - Math.sqrt(5));
      regioni.forEach(function (n, i) {
        var y = 1 - (i / Math.max(1, regioni.length - 1)) * 2;   /* da +1 a −1 */
        var raggio = Math.sqrt(Math.max(0, 1 - y * y));
        var t = aureo * i;
        n.fx = n.x = Math.cos(t) * raggio * R;
        n.fy = n.y = y * R;
        n.fz = n.z = Math.sin(t) * raggio * R;
      });
    })();

    /* --- Dove siamo: tre caselle, quanti sono i livelli sotto il cielo. --- */
    var dove = { regione: null, campo: null, modulo: null };
    var scelto = null;

    function haFigli(n) { return !!(figliDi[n.id] && figliDi[n.id].length); }

    /* Quando si è entrati da qualche parte, tutto ciò che sta fuori RECEDE:
       rimpicciolisce, si smorza e perde l'etichetta. È il gesto che rende la
       mappa leggibile a ogni livello — senza, entrare in una regione vuol
       dire solo aggiungere venti nodi agli otto che c'erano già. */
    function fuoriStrada(n) {
      return !!dove.regione && n.radice !== dove.regione;
    }

    function visibile(n) {
      switch (n.level) {
        case 'regione':    return true;
        case 'campo':      return n.parent === dove.regione;
        case 'sottocampo': return n.parent === dove.campo;
        case 'modulo':     var p = G.byId[n.parent]; return !!p && visibile(p);
        case 'concetto':   return n.parent === dove.modulo;
      }
      return false;
    }

    /* Cambiare livello NON rimuove nodi dalla scena: li nasconde.
       Rimuoverli e rimetterli sembrava naturale e invece è la causa di un
       difetto vero: `3d-force-graph` tiene i propri oggetti tridimensionali
       agganciati ai dati, e per un fotogramma dopo la sostituzione il
       raycaster del passaggio del mouse trova un oggetto i cui dati non
       esistono più — errore in console e ciclo di disegno morto. Con la
       visibilità non si toglie niente a nessuno, e in più il passaggio fra
       livelli diventa una dissolvenza invece che uno strappo. */
    function arcoVisibile(l) {
      var s = typeof l.source === 'object' ? l.source : G.byId[l.source];
      var t = typeof l.target === 'object' ? l.target : G.byId[l.target];
      return !!s && !!t && visibile(s) && visibile(t);
    }

    /* --- La mappa --------------------------------------------------------- */
    var Graph = ForceGraph3D({ controlType: 'orbit' })(host)
      .backgroundColor('rgba(0,0,0,0)')
      .showNavInfo(false)
      .nodeRelSize(6)
      .nodeVal(function (n) { return (DIM[n.level] || 5) * (fuoriStrada(n) ? 0.18 : 1); })
      .nodeColor(function (n) {
        var t = tintaDi(n);
        if (fuoriStrada(n)) return spegni(t);
        return (n.contenuto || n.acceso) ? t : spegni(t);
      })
      .nodeOpacity(0.95)
      .nodeThreeObjectExtend(false)
      .nodeResolution(18)
      .nodeLabel(function (n) {
        var stato = n.contenuto ? 'scritto' : (n.acceso ? 'qualcosa c\'è' : 'ancora da scrivere');
        return '<div class="w-mappa-tip"><b>' + n.label + '</b><br><span>' +
               (NOME[n.level] || n.level) + ' · ' + stato + '</span></div>';
      })
      .linkColor(function (l) {
        return l.kind === 'collegamento' ? token('--reg-parole', '#E3D28A') : 'rgba(150,168,205,0.16)';
      })
      .linkWidth(function (l) { return l.kind === 'collegamento' ? 0.7 : 0; })
      .linkOpacity(0.45)
      /* Niente particelle lungo gli archi: sono decorazione, e tengono un
         riferimento agli archi vecchi anche dopo che il livello è cambiato —
         al primo ridisegno il motore va a leggere le coordinate di un arco
         che non esiste più e il render loop muore. Un ornamento non può
         costare la navigazione. */
      .nodeVisibility(visibile)
      .linkVisibility(arcoVisibile)
      .onNodeClick(entra)
      .onBackgroundClick(function () { risali(); });

    if (Graph.d3Force('link')) Graph.d3Force('link').distance(function (l) {
      var s = typeof l.source === 'object' ? l.source : G.byId[l.source];
      if (!s) return 50;
      /* Più si scende, più serve aria: dentro una regione i nodi sono decine
         e le etichette devono starci senza accavallarsi. */
      if (s.level === 'regione') return 150;
      if (s.level === 'campo') return 120;
      if (s.level === 'sottocampo') return 74;
      return 52;
    });
    if (Graph.d3Force('charge')) Graph.d3Force('charge').strength(-620).distanceMax(1200);
    /* Le regioni sono fissate: la forza al centro serve solo a tenere raccolto
       ciò che si apre dentro una regione, senza tirare il cielo. */
    if (Graph.d3Force('center')) Graph.d3Force('center').strength(0.04);

    Graph.graphData({ nodes: G.nodes, links: G.links });

    function ridisegna(inquadra) {
      Graph.nodeVisibility(visibile).linkVisibility(arcoVisibile);
      if (inquadra !== false) {
        /* Due volte: subito, per non lasciare la mappa ferma, e di nuovo a
           layout assestato — le forze impiegano un secondo a distendere i
           rami appena rivelati, e inquadrare prima significa inquadrare un
           grumo che poi si apre fuori campo. */
        [320, 1400].forEach(function (quando) {
          setTimeout(function () {
            try { Graph.zoomToFit(motoRidotto ? 0 : 800, 80, function (n) { return visibile(n) && !fuoriStrada(n); }); } catch (e) {}
          }, quando);
        });
      }
    }
    ridisegna();

    if (!motoRidotto) {
      try {
        var ctrl = Graph.controls();
        ctrl.autoRotate = true;
        ctrl.autoRotateSpeed = 0.38;
        ctrl.addEventListener('start', function () { ctrl.autoRotate = false; });
      } catch (e) {}
    }

    function vola(n) {
      if (n.x == null) return;
      var d = (DIM[n.level] || 6) * 3.2 + 130;
      var r = Math.hypot(n.x, n.y, n.z) || 1;
      var k = 1 + d / r;
      Graph.cameraPosition({ x: n.x * k, y: n.y * k, z: n.z * k }, n, motoRidotto ? 0 : 1000);
    }

    /* --- Entrare e risalire ----------------------------------------------- */
    function entra(n) {
      switch (n.level) {
        case 'regione':
          if (dove.regione !== n.id) {
            dove = { regione: n.id, campo: null, modulo: null };
            /* si apre subito il campo che ha già qualcosa dentro: chi entra
               deve vedere dei libri, non una stanza da aprire a mano */
            (figliDi[n.id] || []).some(function (id) {
              if (G.byId[id] && G.byId[id].acceso) { dove.campo = id; return true; }
              return false;
            });
            ridisegna();
          }
          break;
        case 'campo':
          dove.campo = (dove.campo === n.id) ? null : n.id;
          dove.modulo = null;
          ridisegna();
          break;
        case 'modulo':
          dove.modulo = (dove.modulo === n.id) ? null : n.id;
          ridisegna(false);
          break;
        case 'concetto':
          if (n.file) { window.location.href = n.file + (n.tappa ? '#' + n.tappa : ''); return; }
          break;
      }
      vola(n);
      seleziona(n);
    }

    function risali() {
      if (dove.modulo) dove.modulo = null;
      else if (dove.campo) dove.campo = null;
      else if (dove.regione) dove.regione = null;
      else { seleziona(null); return; }
      seleziona(null);
      ridisegna();
    }

    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') risali(); });

    /* --- La sovrapposizione: dove sei, che cos'è, quanto manca ------------- */
    var ui = document.createElement('div');
    ui.className = 'w-mappa-ui';
    ui.innerHTML =
      '<nav class="w-mappa-via" aria-label="dove sei nella mappa"></nav>' +
      '<div class="w-mappa-pannello" hidden></div>' +
      '<div class="w-mappa-conta"></div>';
    host.appendChild(ui);

    var via = ui.querySelector('.w-mappa-via');
    var pannello = ui.querySelector('.w-mappa-pannello');
    var conta = ui.querySelector('.w-mappa-conta');

    var quanti = { regioni: 0, campi: 0, rami: 0, libri: 0 };
    G.nodes.forEach(function (n) {
      if (n.level === 'regione') quanti.regioni++;
      else if (n.level === 'campo') quanti.campi++;
      else if (n.level === 'sottocampo') quanti.rami++;
      else if (n.level === 'modulo') quanti.libri++;
    });
    conta.textContent = quanti.regioni + ' regioni · ' + quanti.campi + ' campi · ' +
                        quanti.rami + ' rami · ' + quanti.libri + ' libri accesi';

    function sentiero() {
      var passi = [{ label: 'Il cielo', livello: '' }];
      ['regione', 'campo', 'modulo'].forEach(function (k) {
        var n = dove[k] && G.byId[dove[k]];
        if (n) passi.push({ label: n.label, livello: k });
      });
      via.innerHTML = passi.map(function (p, i) {
        var ultimo = i === passi.length - 1;
        return (i ? '<span class="w-mappa-sep">›</span>' : '') +
          (ultimo ? '<span class="w-mappa-qui">' + p.label + '</span>'
                  : '<button type="button" class="w-mappa-su" data-livello="' + p.livello + '">' + p.label + '</button>');
      }).join('');
      Array.prototype.forEach.call(via.querySelectorAll('.w-mappa-su'), function (b) {
        b.addEventListener('click', function () {
          var l = b.getAttribute('data-livello');
          if (!l) dove = { regione: null, campo: null, modulo: null };
          else if (l === 'regione') { dove.campo = null; dove.modulo = null; }
          else if (l === 'campo') { dove.modulo = null; }
          seleziona(null);
          ridisegna();
        });
      });
    }

    function seleziona(n) {
      scelto = n;
      sentiero();
      if (!n) { pannello.hidden = true; return; }

      var strada = [], p = n;
      while (p) { strada.unshift(p.label); p = p.parent ? G.byId[p.parent] : null; }

      var html = '<div class="w-mappa-dove">' + (strada.slice(0, -1).join(' › ') || 'Il cielo del sapere') + '</div>' +
                 '<div class="w-mappa-nome">' + n.label + '</div>' +
                 '<div class="w-mappa-cosa">' + (NOME[n.level] || n.level) +
                   (n.contenuto ? ' · scritto' : (n.acceso ? ' · qualcosa c\'è' : ' · ancora da scrivere')) + '</div>';

      if (n.level === 'concetto' && n.file) {
        html += '<a class="w-mappa-apri" href="' + n.file + (n.tappa ? '#' + n.tappa : '') + '">Apri il libro qui →</a>';
      } else if (n.level === 'modulo' && n.file) {
        html += '<a class="w-mappa-apri" href="' + n.file + '">Apri il libro →</a>' +
                '<div class="w-mappa-nota">Clicca il nodo per vedere le sue tappe: ognuna apre la pagina al punto giusto.</div>';
      } else if (!n.acceso) {
        html += '<div class="w-mappa-attesa">' +
                (n.attesa || 'Questo ramo aspetta: nessuno ci ha ancora scritto niente. Si vede proprio per questo.') +
                '</div>';
      } else if (haFigli(n)) {
        html += '<div class="w-mappa-nota">Clicca per entrare.</div>';
      }
      pannello.innerHTML = html;
      pannello.hidden = false;
    }
    sentiero();

    /* --- Ridimensionamento ------------------------------------------------ */
    function misura() { Graph.width(host.clientWidth).height(host.clientHeight); }
    misura();
    window.addEventListener('resize', misura);

    /* ====================================================================
       ETICHETTE PROIETTATE
       --------------------------------------------------------------------
       Non `three-spritetext` (si romperebbe da file://): si proiettano i nodi
       in coordinate schermo e si posizionano dei <div> con i font veri del
       progetto. A ogni livello i nodi sono poche decine, quindi le etichette
       ci stanno tutte — che è poi il motivo per cui esistono i livelli.
       ==================================================================== */
    var strato = document.createElement('div');
    strato.className = 'w-mappa-etichette';
    host.appendChild(strato);

    var etichette = {};

    function creaEtichetta(n) {
      var el = document.createElement('div');
      el.className = 'w-mappa-et is-' + n.level + (n.contenuto ? ' is-scritto' : (n.acceso ? ' is-acceso' : ''));
      el.textContent = n.label;
      /* Il nome di una regione ancora tutta da scrivere si legge, ma non
         reclama: tiene la sua tinta, smorzata verso il fondo notturno. */
      el.style.color = (n.acceso || n.contenuto) ? tintaDi(n) : smorza(tintaDi(n));
      strato.appendChild(el);
      return el;
    }

    function davanti(n, cam, targ) {
      var fx = targ.x - cam.x, fy = targ.y - cam.y, fz = targ.z - cam.z;
      var vx = n.x - cam.x, vy = n.y - cam.y, vz = n.z - cam.z;
      return (fx * vx + fy * vy + fz * vz) > 0;
    }

    function aggiorna() {
      var cam = Graph.camera(), ctr = Graph.controls();
      var targ = (ctr && ctr.target) ? ctr.target : { x: 0, y: 0, z: 0 };
      var w = host.clientWidth, h = host.clientHeight, visti = {};

      for (var i = 0; i < G.nodes.length; i++) {
        var n = G.nodes[i];
        if (!visibile(n) || n.x == null) continue;
        /* i rami senza contenuto si etichettano solo da vicino: da lontano
           sarebbero duecento parole illeggibili una sull'altra */
        if (fuoriStrada(n)) continue;
        if (n.level === 'sottocampo' && !n.acceso && !dove.campo) continue;

        var el = etichette[n.id] || (etichette[n.id] = creaEtichetta(n));
        if (!davanti(n, cam.position, targ)) { el.style.opacity = '0'; continue; }
        var sc = Graph.graph2ScreenCoords(n.x, n.y, n.z);
        if (!sc || sc.x < -80 || sc.x > w + 80 || sc.y < -40 || sc.y > h + 40) { el.style.opacity = '0'; continue; }

          /* Quanto è grande QUESTO nodo, in pixel, a QUESTA distanza: si
           proietta un secondo punto alto quanto il suo raggio e si misura.
           Un'etichetta a distanza fissa finirebbe dentro la sfera da vicino e
           lontanissima da lontano. */
        var raggio = Math.cbrt(DIM[n.level] || 5) * REL;
        var so = Graph.graph2ScreenCoords(n.x, n.y + raggio, n.z);
        var stacco = so ? Math.abs(so.y - sc.y) : 12;
        el.style.transform = 'translate(-50%,-50%) translate(' +
          Math.round(sc.x) + 'px,' + Math.round(sc.y + stacco + 13) + 'px)';
        el.style.opacity = (scelto && scelto.id === n.id) ? '1' : '.92';
        visti[n.id] = true;
      }
      for (var id in etichette) { if (!visti[id]) etichette[id].style.opacity = '0'; }
      requestAnimationFrame(aggiorna);
    }
    requestAnimationFrame(aggiorna);
  });

})();
