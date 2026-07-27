# Il cervello 3D torna a essere un di più

**Data:** 2026-07-26 · **Stato:** applicata

## Il problema

Il grafo 3D occupava `92vh` in cima a `Biblioteca.dc.html`. Conseguenze
misurate aprendo la pagina:

- l'esposizione classica — scaffali e card, cioè l'indice vero della
  biblioteca — cominciava **sotto la piega**: chi apriva la home non vedeva un
  solo titolo di libro;
- il grafo era l'unico modo di esplorare percepito come disponibile, e non è
  un buon modo: con tutti e quattro i domini aperti si vedevano una trentina di
  nodi e altrettante etichette in un fondo scuro, senza un ordine di lettura;
- il costo (WebGL, rotazione continua, libreria da CDN) si pagava sempre,
  anche per chi voleva solo cliccare su un libro.

Il grafo era diventato la porta d'ingresso. Doveva essere una finestra.

## La decisione

Il cervello resta, ma **dopo** l'esposizione classica e dentro una cornice.

1. **Posizione.** `#wiki-brain` sta in fondo alla pagina, dentro
   `.w-brainwrap`, con un titolo e una spiegazione scritti nella pagina (non
   sul canvas). Resta fratello di `<x-dc>` e non figlio, perché il runtime dc
   sostituisce quell'elemento.
2. **Dimensione.** `height: min(58vh, 520px)`, bordo e ombra del design
   system: è una figura, non uno sfondo. Chi vuole esplorare davvero preme
   **schermo intero** (`.w-brainwrap.is-full`, si esce col pulsante o con Esc).
3. **Avvio pigro.** Il grafo si costruisce quando entra in vista
   (`IntersectionObserver`, `rootMargin: 200px`). Chi legge le card non paga
   niente. Senza `IntersectionObserver` si parte subito, come prima.
4. **Meno caos all'apertura.** Si aprono solo i rami **accesi**: i domini in
   cui abbiamo scritto qualcosa, e sotto di loro campi e sottocampi accesi
   fino ai moduli. Gli altri tre domini restano quattro sfere chiuse da
   cliccare. Prima si aprivano tutti e quattro i domini a prescindere.
5. **Assenza dichiarata.** Se mancano WebGL o la libreria, compare una riga di
   avviso (`.w-brain-nope`) invece del silenzio: l'utente sa che non gli manca
   contenuto, perché l'indice è sopra.

## Cosa si è scartato

- **Togliere il grafo.** È la parte più bella della homepage e mostra a colpo
  d'occhio quanto sapere resta da scrivere. Il problema era la gerarchia, non
  la sua esistenza.
- **Tenerlo in cima ma più basso.** Sposta il problema di qualche centinaio di
  pixel: finché sta sopra, è lui la porta.
- **Avviarlo solo con un pulsante.** Più esplicito, ma toglie la sorpresa:
  arrivare in fondo e trovare il cervello che si accende da solo è metà del
  suo valore.

## Regola che ne resta

Nella Biblioteca **il contenuto viene prima della sua rappresentazione**.
Qualunque visualizzazione futura — mappe, timeline, cluster — si aggiunge in
fondo, dentro una cornice, e si accende quando la si raggiunge.
