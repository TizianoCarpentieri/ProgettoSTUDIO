# La mappa del sapere: il cielo, le regioni, i livelli di zoom

Data: 2026-07-27 (sera)
Stato: prima versione costruita, composizione da rifinire
Corregge: la decisione del [26-07](2026-07-26-cervello-secondario-design.md) — il
grafo in fondo alla home — e il paragrafo *«Lo scheletro OpenAlex smette di
essere disegnato»* della [decisione del 27-07 mattina](2026-07-27-navigazione-biblioteca-design.md)

## L'errore che questa decisione ripara

Due decisioni prese in due sessioni diverse, entrambe difendibili, hanno prodotto
insieme un risultato che tradiva il progetto.

La prima constatava che il grafo occupava `92vh` in cima alla home e spingeva
l'indice sotto la piega: l'ha spostato **in fondo**, con l'occhiello *«Un di più
· da guardare quando hai finito di leggere»*. La seconda constatava che 282 nodi
di cui venti accesi non si navigano: proponeva di **smettere di disegnare** lo
scheletro e di mostrare solo ciò che era scritto.

Ciascuna risolveva un difetto vero. Insieme retrocedevano a ornamento facoltativo
l'unica cosa che diceva che cos'è questo posto — **una biblioteca di tutto lo
scibile, in cui quasi tutto è ancora da scrivere** — e restringevano l'accoglienza
a «come funzionano le macchine che pensano», cioè a una biblioteca di informatica.

L'errore di analisi è stato trattare i rami spenti come rumore. Non sono rumore:
sono la dichiarazione di ambizione. Una mappa in cui il 95% è buio non sta dicendo
«è vuoto», sta dicendo *«ecco quanto c'è da fare»*.

## Il vero difetto era un altro: la mappa non aveva livelli di zoom

Nessuno dice che un mappamondo è inutile perché non ci si leggono i numeri
civici: ci si avvicina. Il grafo mostrava tutto alla stessa distanza, e a quella
distanza non si legge e non si clicca. La soluzione non è rimpicciolire la mappa
— è darle le distanze.

```
IL CIELO        8 regioni                      leggibili tutte insieme
  └ LA REGIONE    i suoi campi                 poche decine di nodi
      └ IL CAMPO    i suoi rami e i suoi libri  poche decine di nodi
          └ IL LIBRO   le sue tappe → aprono la pagina AL PUNTO GIUSTO
```

A ogni livello restano poche decine di nodi: le etichette ci stanno tutte e il
clic è preciso. È anche il motivo per cui **il 2D proposto la mattina non serve
più**: nasceva dal bisogno di cliccare in mezzo a 282 nodi, e quel bisogno lo
tolgono i livelli, non la seconda dimensione.

## Il cielo: otto regioni scritte a mano

`wiki/graph/cielo.js`. Sotto resta OpenAlex, intatto — 26 campi, 252 sottocampi:
è la **profondità**, ed è generata da altri e mantenuta da altri. Sopra ci sono
otto regioni scritte a mano, che raggruppano i 26 campi e danno alla mappa una
**porta d'ingresso umana**:

| Regione | Campi OpenAlex |
|---|---|
| Le macchine che pensano | Informatica, Scienze delle Decisioni |
| Il linguaggio dei numeri | Matematica |
| La materia e il cosmo | Fisica e Astronomia, Chimica, Materiali, Terra, Energia |
| Il vivente | Biologia, Biochimica, Immunologia, Neuroscienze, Farmacologia |
| Il corpo e la cura | Medicina, Infermieristica, Veterinaria, Odontoiatria, Professioni sanitarie |
| Costruire il mondo | Ingegneria, Ingegneria chimica, Scienze ambientali |
| La mente e le società | Psicologia, Scienze sociali, Economia, Management |
| Le parole e le forme | Arti e studi umanistici |

Si entra da «Le macchine che pensano», non da «Scienze Fisiche», e due clic più
giù si è comunque dentro la mappa vera. La copertura è totale e **verificata**:
`node wiki/verifica.js` fallisce se un campo resta senza regione, perché un campo
senza casa sparirebbe dalla mappa in silenzio portandosi via tutto il suo ramo.

## I rami spenti sono l'invito

Restano tutti visibili, con la tinta della loro regione molto scurita — da lontano
la mappa è divisa in zone di colore anche dov'è tutta da scrivere. Cliccandone uno
non si trova un vicolo cieco: il pannello dice **che cosa ci andrà** (il campo
`attesa` di ogni regione). Il vuoto è un indice di lavori futuri, non un buco.

## Scelte tecniche che vale la pena ricordare

**Le regioni sono fissate a mano, non a forza.** Sono otto radici senza archi fra
loro: il motore a forze le respinge e basta, quindi scappano all'infinito e la
mappa non si inquadra più. Sono fissate su una sfera con la spirale aurea. In più
un cielo sempre uguale si impara; uno che cambia a ogni visita no.

**Cambiare livello non rimuove nodi: li nasconde** (`nodeVisibility`). Rimuoverli
sembrava naturale ed era la causa di un difetto vero: la libreria tiene i propri
oggetti tridimensionali agganciati ai dati, e per un fotogramma dopo la
sostituzione il raycaster del mouse trova un oggetto i cui dati non esistono più.

**Niente particelle sugli archi.** Stessa famiglia di problema, e sono
decorazione: un ornamento non può costare la navigazione.

**I colori stanno in `wiki.css`** come token `--reg-*` e si leggono a runtime. Un
canvas ha bisogno di valori e non di classi, ed è così che nella versione
precedente erano finiti dodici colori scritti a mano dentro il codice.

## Che cosa non è ancora a posto

Va detto, perché è visibile: **dentro una regione la composizione è ancora
stretta.** Le altre regioni recedono correttamente e le etichette dei rami fuori
strada spariscono, ma la camera non si avvicina abbastanza al sottoalbero aperto,
e i nomi dei libri e dei sottocampi si toccano. Le prossime mosse, in ordine:

1. inquadratura vera del sottoalbero all'ingresso in una regione (`zoomToFit` con
   filtro non basta: serve una camera portata sul baricentro dei figli);
2. sfoltimento delle etichette che si sovrappongono, a favore di quelle accese;
3. sul telefono, dove ruotare una scena con un dito è scomodo: entrare in una
   regione dovrebbe proporre l'elenco, con la mappa a richiesta.

## Non obiettivi

- Non si tocca `support.js`, non si introduce una build, non si aggiunge un
  framework.
- Il 3D non diventa l'unica via: sotto la mappa l'indice in chiaro resta completo,
  ed è ciò che si vede senza WebGL o senza rete.
- OpenAlex non viene sostituito né potato: resta la profondità della mappa.
