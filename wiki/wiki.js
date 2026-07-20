/* ==========================================================================
   WIKI · COMPORTAMENTI CONDIVISI
   --------------------------------------------------------------------------
   Un solo file per tutte le pagine della biblioteca. Sostituisce gli script
   che prima erano copiati e incollati in ogni pagina.

   Fa sei cose, ognuna indipendente dalle altre e ognuna che NON FA NULLA se
   gli elementi che la riguardano non esistono. Per questo lo stesso file si
   può includere in qualsiasi pagina, presente o futura, senza configurarlo.

     1. tema chiaro/scuro      → pulsante, memoria, sincronia fra schede
     2. indice laterale        → letto dalle sezioni .w-tappa della pagina
     3. barra di progresso     → avanzamento della lettura
     4. comparsa allo scroll   → animazione dei blocchi
     5. card della homepage    → generate da wiki-index.js
     6. MathJax                → configurazione unica

   Istruzioni per aggiungere pagine: AgentFE.md
   ========================================================================== */

(function () {
  'use strict';

  var CHIAVE_TEMA = 'wiki-theme';
  var doc = document;
  var radice = doc.documentElement;

  /* Il movimento è consentito? Se l'utente ha chiesto meno animazioni, le
     spegniamo del tutto invece di limitarci a ridurle. */
  var moto = !window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function icona(nome) {
    return '<span class="w-ico i-' + nome + '"></span>';
  }


  /* ======================================================================
     1. TEMA CHIARO / SCURO
     ----------------------------------------------------------------------
     Nessun filtro `invert`: si imposta data-theme sull'<html> e il foglio
     di stile fa il resto con i suoi token. Alla prima visita si segue la
     preferenza di sistema.
     ====================================================================== */

  function leggiTema() {
    try {
      var salvato = localStorage.getItem(CHIAVE_TEMA);
      if (salvato === 'dark' || salvato === 'light') return salvato;
    } catch (e) { /* localStorage non disponibile: si continua col default */ }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  }

  function applicaTema(tema) {
    radice.setAttribute('data-theme', tema);
    var btn = doc.getElementById('wiki-themebtn');
    if (btn) {
      var scuro = tema === 'dark';
      btn.innerHTML = icona(scuro ? 'sun' : 'moon');
      btn.setAttribute('aria-label', scuro ? 'Passa al tema chiaro' : 'Passa al tema scuro');
      btn.setAttribute('aria-pressed', scuro ? 'true' : 'false');
    }
  }

  function avviaTema() {
    var tema = leggiTema();
    applicaTema(tema);

    if (doc.getElementById('wiki-themebtn')) return;
    var btn = doc.createElement('button');
    btn.id = 'wiki-themebtn';
    btn.type = 'button';
    btn.className = 'w-themebtn';
    doc.body.appendChild(btn);

    btn.addEventListener('click', function () {
      tema = tema === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(CHIAVE_TEMA, tema); } catch (e) {}
      applicaTema(tema);
    });

    applicaTema(tema);

    /* Se l'utente cambia tema in un'altra scheda, questa si adegua. */
    window.addEventListener('storage', function (ev) {
      if (ev.key !== CHIAVE_TEMA || !ev.newValue) return;
      tema = ev.newValue;
      applicaTema(tema);
    });
  }

  /* Il tema si applica il prima possibile, prima ancora che il documento sia
     pronto, per non mostrare un lampo di bianco a chi legge al buio. */
  radice.setAttribute('data-theme', leggiTema());


  /* ======================================================================
     2. INDICE LATERALE
     ----------------------------------------------------------------------
     Si costruisce leggendo le sezioni della pagina: il contenuto di una
     pagina resta descritto in un solo posto, la pagina stessa.
     ====================================================================== */

  function avviaIndice() {
    var contenitore = doc.querySelector('.w-page--toc');
    if (!contenitore) return;

    var main = contenitore.querySelector('.w-main');
    if (!main) return;

    var sezioni = main.querySelectorAll('section.w-tappa[id]');
    if (!sezioni.length) return;

    var aside = doc.querySelector('.w-toc');
    if (!aside) {
      aside = doc.createElement('aside');
      aside.className = 'w-toc';
      contenitore.insertBefore(aside, main);
    }

    var titolo = aside.getAttribute('data-titolo') || 'Indice';
    var html = '<div class="w-toc-title">' + titolo + '</div>';
    var n = 0;

    for (var i = 0; i < sezioni.length; i++) {
      var sez = sezioni[i];
      var finale = sez.classList.contains('w-tappa--fine');
      var etichetta = sez.getAttribute('data-toc');

      if (!etichetta) {
        var h = sez.querySelector('.w-tappa-title');
        etichetta = h ? h.textContent.trim() : sez.id;
      }

      var prefisso = '';
      if (!finale) {
        n++;
        prefisso = (n < 10 ? '0' + n : n) + ' · ';
      }

      html += '<a href="#' + sez.id + '" data-toc-for="' + sez.id + '">' + prefisso + etichetta + '</a>';
    }

    var pie = aside.getAttribute('data-pie');
    if (pie) html += '<div class="w-toc-foot">' + pie + '</div>';

    aside.innerHTML = html;

    /* Evidenziazione della tappa corrente durante lo scorrimento. */
    var link = {};
    var voci = aside.querySelectorAll('a[data-toc-for]');
    for (var j = 0; j < voci.length; j++) link[voci[j].getAttribute('data-toc-for')] = voci[j];

    if (!('IntersectionObserver' in window)) return;

    var visibili = {};
    var osservatore = new IntersectionObserver(function (voci) {
      for (var k = 0; k < voci.length; k++) {
        visibili[voci[k].target.id] = voci[k].isIntersecting;
      }
      var attiva = null;
      for (var m = 0; m < sezioni.length; m++) {
        if (visibili[sezioni[m].id]) { attiva = sezioni[m].id; break; }
      }
      for (var id in link) {
        if (Object.prototype.hasOwnProperty.call(link, id)) {
          link[id].classList.toggle('is-current', id === attiva);
        }
      }
    }, { rootMargin: '-10% 0px -70% 0px' });

    for (var p = 0; p < sezioni.length; p++) osservatore.observe(sezioni[p]);
  }


  /* ======================================================================
     3. BARRA DI PROGRESSO
     ====================================================================== */

  function avviaProgresso() {
    if (!doc.querySelector('.w-main')) return;

    var barra = doc.querySelector('.w-progress');
    if (!barra) {
      barra = doc.createElement('div');
      barra.className = 'w-progress';
      barra.setAttribute('role', 'presentation');
      doc.body.insertBefore(barra, doc.body.firstChild);
    }

    var inAttesa = false;
    function aggiorna() {
      inAttesa = false;
      var scorribile = doc.body.scrollHeight - window.innerHeight;
      var quota = scorribile > 0 ? (window.pageYOffset / scorribile) * 100 : 0;
      barra.style.width = Math.max(0, Math.min(100, quota)) + '%';
    }

    window.addEventListener('scroll', function () {
      if (inAttesa) return;
      inAttesa = true;
      window.requestAnimationFrame(aggiorna);
    }, { passive: true });

    aggiorna();
  }


  /* ======================================================================
     4. COMPARSA ALLO SCROLL
     ----------------------------------------------------------------------
     La classe che nasconde i blocchi viene messa da qui, non dal CSS: se il
     JavaScript non parte, il contenuto resta visibile. Non si può mai
     perdere del testo per colpa di un'animazione.
     ====================================================================== */

  function avviaComparse() {
    if (!moto || !('IntersectionObserver' in window)) return;

    var bersagli = doc.querySelectorAll(
      '.w-main > section, .w-main > .w-note, .w-main > .w-demo, .w-grid > *, .w-figure'
    );
    if (!bersagli.length) return;

    radice.classList.add('w-anim');

    var osservatore = new IntersectionObserver(function (voci) {
      for (var j = 0; j < voci.length; j++) {
        if (!voci[j].isIntersecting) continue;
        voci[j].target.classList.add('is-in');
        osservatore.unobserve(voci[j].target);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: .06 });

    var nascosti = [];
    var soglia = window.innerHeight * 0.9;

    for (var i = 0; i < bersagli.length; i++) {
      /* Ciò che è già sotto gli occhi di chi legge non si nasconde mai:
         si anima solo quello che deve ancora entrare dal basso. */
      if (bersagli[i].getBoundingClientRect().top < soglia) continue;
      bersagli[i].classList.add('w-reveal');
      nascosti.push(bersagli[i]);
      osservatore.observe(bersagli[i]);
    }

    /* Rete di sicurezza: se per qualsiasi motivo l'osservatore non scattasse,
       dopo due secondi si mostra tutto. Un'animazione non può far sparire
       del contenuto. */
    window.setTimeout(function () {
      for (var n = 0; n < nascosti.length; n++) nascosti[n].classList.add('is-in');
    }, 2000);
  }


  /* ======================================================================
     5. CARD DELLA HOMEPAGE
     ----------------------------------------------------------------------
     Legge window.WIKI_INDEX (wiki-index.js) e costruisce scaffali e card.
     Aggiungere un modulo alla biblioteca = aggiungere una voce a quel file.
     ====================================================================== */

  var STATI = {
    pronto:   { testo: '● pronto',    colore: 'var(--verde)' },
    bozza:    { testo: '◐ in lavoro', colore: 'var(--arancio)' },
    previsto: { testo: '○ previsto',  colore: 'var(--ink-faint)' }
  };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function cardHtml(m) {
    var previsto = m.stato === 'previsto';
    var stato = STATI[m.stato] || STATI.pronto;
    var tag = m.tag || [];
    var classi = 'w-card a-' + (m.accento || 'blu') + (previsto ? ' w-card--ghost' : '');

    var dentro =
      '<div class="w-card-head">' +
        '<span class="w-card-id">MODULO ' + esc(m.id) + '</span>' +
        '<span class="w-card-state" style="color:' + stato.colore + '">' + stato.testo + '</span>' +
      '</div>' +
      '<h2 class="w-card-title">' +
        (m.icona ? '<span class="w-card-ico i-' + esc(m.icona) + '"></span>' : '') +
        esc(m.titolo) +
      '</h2>' +
      '<p class="w-card-sub">' + esc(m.sottotitolo) + '</p>' +
      '<div class="w-chips">' +
        tag.map(function (t) { return '<span class="w-chip">' + esc(t) + '</span>'; }).join('') +
      '</div>';

    if (previsto || !m.file) return '<div class="' + classi + '">' + dentro + '</div>';
    return '<a class="' + classi + '" href="' + esc(m.file) + '">' + dentro + '</a>';
  }

  function avviaScaffali() {
    var host = doc.getElementById('wiki-scaffali');
    if (!host || !window.WIKI_INDEX) return;

    var html = '';
    for (var i = 0; i < window.WIKI_INDEX.length; i++) {
      var scaffale = window.WIKI_INDEX[i];
      html += '<div class="w-shelf-title"><span>Scaffale · ' + esc(scaffale.scaffale) + '</span></div>';
      html += '<div class="w-grid">';
      for (var j = 0; j < scaffale.moduli.length; j++) html += cardHtml(scaffale.moduli[j]);
      html += '</div>';
    }
    host.innerHTML = html;
  }


  /* ======================================================================
     6. MATHJAX — configurazione unica per tutta la wiki
     ====================================================================== */

  if (!window.MathJax) {
    window.MathJax = {
      tex: { inlineMath: [['\\(', '\\)']], displayMath: [['\\[', '\\]']] },
      chtml: { scale: 1.02 }
    };
  }


  /* ======================================================================
     AVVIO
     ====================================================================== */

  function avvia() {
    avviaTema();
    avviaScaffali();   /* prima dell'indice: crea le card che poi si animano */
    avviaIndice();
    avviaProgresso();
    avviaComparse();
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', avvia);
  } else {
    avvia();
  }

  /* Il runtime dc-runtime monta i componenti React dopo il caricamento: se il
     contenuto arriva più tardi, si rifà il giro una volta sola. */
  window.addEventListener('load', function () {
    if (!doc.querySelector('.w-toc a')) avviaIndice();
    if (!doc.querySelector('#wiki-scaffali .w-card')) avviaScaffali();
  });

})();
