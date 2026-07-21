# AgentAutore — lo standard di scrittura della wiki

Questo documento è il gemello di [AgentFE.md](AgentFE.md). Quello dice **com'è
vestita** una pagina; questo dice **come si scrive**. Vale per chiunque prepari
un libro nuovo o ne modifichi uno esistente: persone e modelli linguistici.

Non è un regolamento. È il ragionamento dietro le scelte che funzionano, messo
per iscritto perché non vada riscoperto ogni volta. Se in un punto preciso il
tuo giudizio dice altro, segui il giudizio — ma sappi cosa stai scambiando.

---

## In una frase

Ogni libro porta un lettore di media competenza fino al livello esperto senza
mai fargli sentire il salto. La forma la garantisce `AgentFE.md`. Qui si
garantisce il percorso.

---

## I sette principi

### 1. Parti dal noto, arriva all'ignoto

**Cosa dice.** Ogni passo si aggancia a qualcosa che il lettore possiede già —
la tappa precedente, un'esperienza comune, un concetto del modulo collegato —
prima di introdurre qualcosa di nuovo.

**Perché funziona.** Capire è agganciare. Un'informazione senza appiglio non
viene compresa male: non viene compresa affatto, e il lettore se ne accorge
mezza pagina dopo, quando è già in debito. Il lavoro vero della scrittura
didattica non è spiegare il nuovo, è scegliere il noto da cui partire.

**Dove si vede.** Nel `w-tappa-lead`, che è la frase con cui la tappa si
presenta, e nel `w-drop` che apre l'idea. Il Modulo 01 lo fa bene: *«Un ID come
26110 è solo un'etichetta»* — riprende l'ID della tappa precedente e lo usa come
trampolino per l'embedding.

**L'errore tipico.** Aprire una tappa con la definizione. Una definizione è
un'ottima seconda frase e una pessima prima.

---

### 2. Analogia prima, tecnicismo dopo

**Cosa dice.** L'immagine crea l'intuizione, la definizione la rende precisa.
In questo ordine.

**Perché funziona.** L'analogia costruisce lo spazio mentale dove la
definizione andrà a posarsi. Invertita, l'immagine diventa decorazione: arriva
quando il lettore ha già deciso di non aver capito. E l'ordine ha un secondo
effetto, meno ovvio: obbliga chi scrive a possedere davvero il concetto. Non si
trova un'analogia giusta per qualcosa che si è solo memorizzato.

**Dove si vede.** `w-note--demo` precede `w-formula` e `w-demo` dentro la stessa
tappa. I due moduli esistenti hanno un repertorio da cui vale la pena imparare
il taglio: *il cuoco e la dispensa*, *il talent show con 128.000 concorrenti*,
*gli appunti del verbale*, *la bozza dell'apprendista*.

**L'errore tipico.** L'analogia che regge solo per una frase e poi tradisce.
Un'analogia va scelta per dove **si rompe**, non per dove funziona: se il
lettore la estende di un passo e arriva a una conclusione falsa, l'hai
danneggiato. Quando un'immagine ha un limite, dichiaralo.

---

### 3. Poche frasi a effetto, ben piazzate

**Cosa dice.** L'impatto nasce dal contrasto con un tono pacato attorno, non
dalla densità. Una frase forte sta da sola, breve, dopo un passaggio denso —
non prima.

**Perché funziona.** Una frase forte in mezzo a dieci frasi forti è rumore; la
stessa frase dopo due paragrafi tranquilli è un colpo. Chi scrive sotto la
spinta di *"aggiungi frasi a forte effetto"* tende a metterne una per
paragrafo, e il libro finisce per suonare come una pubblicità: il lettore
smette di crederci verso pagina tre. La forza è una risorsa che si consuma.

**Dove si vede.** In `w-tappa-lead` o in chiusura di sezione. Il Modulo 01: *«Il
segreto sporco dell'inferenza: generare il token n. 1000 non deve costare come
rileggere da capo i 999 precedenti»*. Sta in apertura di tappa, è sola, e quella
tappa non ne ha altre.

**L'errore tipico.** Il superlativo al posto del dato. *«Un meccanismo
rivoluzionario»* non colpisce nessuno; *«la stessa operazione, ripetuta 96
volte»* sì. **Se una frase a effetto può essere sostituita da un numero,
sostituiscila con il numero.**

---

### 4. Ogni affermazione forte va ancorata

**Cosa dice.** Numeri, primati, date, attribuzioni, confronti di prestazioni:
si scrivono solo se verificati. La ricerca si fa **prima** di scrivere, non
dopo.

**Perché funziona.** È l'unico principio che non riguarda l'efficacia ma la
verità, ed è per questo l'unico non negoziabile. Un libro didattico ha
un'autorità che il lettore non è in grado di mettere in discussione — è
esattamente perché non sa che sta leggendo. Un dato inventato in un contesto
del genere non è un errore di stile: è un abuso di quella fiducia. E ne basta
uno scoperto per far crollare la credibilità di tutto il resto, comprese le
novantanove cose giuste.

**Dove si vede.** `w-note--paper`, con autore, titolo, anno e riferimento
verificabile. Nei moduli esistenti il riquadro si chiama *«I paper che lo
dimostrano»*: mantieni quel titolo, è già una convenzione.

**In pratica.** Cerca online i temi prima di impostare le tappe: serve a
verificare, ma serve anche a scoprire cosa è cambiato dopo la tua data di
addestramento — su questi argomenti cambia molto in fretta. Ciò che non riesci
a verificare non sparisce: si riscrive al ribasso. *«Circa il 40% più veloce»*
diventa *«sensibilmente più veloce»*, e va bene così. Una semplificazione
dichiarata è onesta; un numero inventato no.

**L'errore tipico.** La citazione plausibile. Nome d'autore giusto, anno
sbagliato; paper vero, risultato attribuito male. Sono gli errori che passano
la rilettura proprio perché suonano bene.

---

### 5. I concetti tornano più volte, a profondità crescente

**Cosa dice.** Dalla seconda tappa in poi, ogni tappa riapre esplicitamente
almeno un concetto già visto e ci aggiunge uno strato. Nessuna idea importante
si esaurisce al primo passaggio.

**Perché funziona.** Al primo incontro un concetto si capisce; al secondo si
riconosce; al terzo si possiede. Un libro che dice ogni cosa una volta sola è
un elenco corretto che non insegna niente. In più il richiamo fa un lavoro di
struttura: tiene insieme le tappe, e la sua assenza è il sintomo affidabile di
un libro che si sta sfaldando in capitoli indipendenti.

**Dove si vede.** Di solito nel `w-tappa-lead` — *«Adesso hai tutti i pezzi:
vettori, prodotto scalare, matrici, softmax»* — oppure in un `w-note--key` che
riprende qualcosa di stabilito prima e lo precisa.

**L'errore tipico.** Il richiamo per formalità: *«come abbiamo visto»* seguito
da nulla di nuovo. Un richiamo che non aggiunge uno strato è una riga sprecata.
Il richiamo è un rilancio, non una nota a piè di pagina.

---

### 6. Il codice visivo resta coerente dall'inizio alla fine

**Cosa dice.** Colori, icone e riquadri significano sempre la stessa cosa, dalla
prima pagina all'ultimo modulo della biblioteca.

**Perché funziona.** Dopo due tappe il lettore ha imparato il codice senza
accorgersene: vede il rosso e si mette in guardia, vede il compasso e sa che
arriva matematica. Quel riconoscimento è memoria di lettura guadagnata, e si
distrugge alla prima eccezione — perché da quel momento ogni riquadro va letto
per capire di che tipo è.

**Dove si vede.** La tabella *«Il significato dei colori»* di
[AgentFE.md](AgentFE.md) e i tipi di `w-note`. Il colore lo sceglie il
significato, mai l'estetica della pagina.

**L'errore tipico.** Usare `w-note--warn` perché rosso spezza bene una sequenza
di riquadri blu. Se una pagina sembra monotona il problema è il testo, non i
riquadri.

---

### 7. Si chiude con un'azione, non con un riassunto

**Cosa dice.** L'epilogo (`w-tappa--fine`) dà al lettore qualcosa da fare, non
un elenco di ciò che ha appena letto.

**Perché funziona.** Alla fine di un libro il lettore ha capito e non sa ancora
niente — la differenza fra le due cose la fa solo la pratica. Un riassunto lo
lascia con la sensazione gradevole di aver imparato, che è precisamente
l'illusione da non regalargli. Un'azione lo mette in condizione di scoprire cosa
gli manca.

**Dove si vede.** Il Modulo 01 lo fa già, ed è il modello da seguire: *«Dal
livello medio all'esperto assoluto: la palestra»* — cinque esercizi concreti e
crescenti, dal giocare con un tokenizer al leggere cinque paper in un ordine
preciso. Poi `w-note--bridge` manda al modulo successivo.

**L'errore tipico.** Confondere la sintesi con la chiusura. Una sintesi ci sta —
il Modulo 01 ne ha una, un paragrafo che rilegge tutto il percorso in un
respiro — ma è il penultimo gesto. L'ultimo è l'azione.

---

## Il procedimento, dalla richiesta al libro

Sei passi. L'ordine conta più della loro esecuzione puntuale: gran parte degli
errori nasce dallo scrivere prima di aver fatto i primi tre.

**1. Stabilisci da dove parte il lettore.** Cosa sa già, in concreto? È il
riferimento che rende decidibile ogni scelta successiva — cosa spiegare, cosa
dare per scontato, quale analogia userà. Senza questo passo, "spiegare bene"
non ha un significato operativo. Se la richiesta non lo dice e non è deducibile
dai moduli già esistenti, chiedilo: è l'unica domanda che vale la pena fare
prima di cominciare.

**2. Cerca le fonti.** Prima di impostare le tappe, non mentre scrivi. Serve a
verificare i numeri e a scoprire cosa è cambiato di recente. Se stai digerendo
un documento fornito — un paper, degli appunti — leggilo tutto prima di
decidere la scaletta: la struttura giusta si vede solo dall'insieme.

**3. Scegli le analogie portanti.** Una per ogni concetto difficile, scelta
prima di scrivere. Sono l'ossatura: se ne cambi una a metà libro, la tappa
successiva non regge più.

**4. Disegna le tappe.** Ogni tappa: da quale noto parte, cosa aggiunge, quale
concetto precedente riapre. Se non sai dire il richiamo di una tappa, quella
tappa è nel posto sbagliato — o non serve.

**5. Scrivi.** Ora l'ordine dentro la tappa viene quasi da sé: aggancio →
analogia → meccanica → cosa ricordare → dove sbagliano tutti → livello esperto
→ fonti. È l'ordine in cui il template è già disposto.

**6. Verifica.** La checklist qui sotto, più quella di forma in `AgentFE.md`.

---

## Il senso della misura

Nessun tetto numerico: contare le analogie non ha mai migliorato un libro. Ma
tre eccessi tornano con regolarità, e vale la pena riconoscerli.

**Troppe frasi a effetto.** Il più frequente, e nasce quasi sempre dalla
richiesta stessa — *"aggiungi frasi a forte effetto"* è un'istruzione che si
tende a eseguire troppo. Se due paragrafi di fila alzano la voce, uno dei due va
abbassato.

**Troppe analogie per lo stesso concetto.** Tre immagini per la stessa idea non
la chiariscono tre volte: costringono il lettore a capire quale delle tre deve
tenere. Una, e portata fino in fondo.

**Troppo livello esperto.** Il `w-note--expert` è un premio per chi legge fino
in fondo, e funziona finché resta raro. Quando ce ne sono due o tre per tappa
il libro ha cambiato pubblico senza dichiararlo, e il lettore di media
competenza — quello per cui il libro esiste — si sente escluso a casa propria.

Nel dubbio, il criterio è uno: **se un elemento è presente ovunque, non
comunica più niente.**

---

## Come si verifica un libro

Domande da farsi a libro finito, non caselle da spuntare. Ognuna, se la risposta
è no, indica cosa aggiustare.

1. **La prima frase di ogni tappa si aggancia a qualcosa che il lettore già ha?**
   Se apre con una definizione, riscrivila.
2. **Ogni concetto difficile ha la sua analogia, e l'analogia viene prima della
   formula?** Controlla l'ordine dei blocchi dentro la tappa.
3. **Ogni numero, data e attribuzione è stato verificato?** Quelli che non lo
   sono: riscritti al ribasso o tolti. Nessuna eccezione.
4. **Ogni tappa dalla seconda in poi riapre un concetto precedente aggiungendoci
   qualcosa?** Se un richiamo non aggiunge uno strato, non è un richiamo.
5. **Le frasi a effetto sono poche e distanziate?** Leggi solo quelle, di
   seguito: se sembrano lo slogan di un prodotto, sono troppe.
6. **I colori e i riquadri seguono il loro significato, mai l'estetica?**
   Confronta con la tabella in `AgentFE.md`.
7. **L'epilogo dà qualcosa da fare?** Un riassunto in chiusura è una chiusura
   mancata.
8. **Leggendo solo i `w-tappa-title` in fila, si vede una storia?** Se sembra un
   indice di argomenti, manca il filo — ed è un problema di struttura, non di
   scrittura.

---

## I file collegati

| File | Contenuto |
|---|---|
| [AgentFE.md](AgentFE.md) | La forma: classi, colori, icone, la procedura in tre passi |
| [_TEMPLATE.dc.html](../_TEMPLATE.dc.html) | Lo scheletro, con i richiami ai principi al punto giusto |
| [AGENTS.md](../AGENTS.md) | Il gancio: cosa leggere prima di toccare un `.dc.html` |
| `Dentro-la-Macchina.dc.html` | Il riferimento pratico: analogie, epilogo con azione, `w-note--paper` |
