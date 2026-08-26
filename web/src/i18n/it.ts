import type { Dictionary } from './dictionary';

/** Redatto dall’IA, non ancora rivisto da un madrelingua italiano — vedi `common.translationNotice`. */
export const it: Dictionary = {
  common: {
    skipToContent: 'Vai al contenuto',
    nav: {
      whatThisIs: 'Cos’è',
      faq: 'Domande frequenti',
      directive: 'Direttiva',
      privacy: 'Privacy',
      press: 'Stampa',
    },
    footerTagline: 'Un progetto artistico. Non affiliato a nessun governo, religione o marchio.',
    translationNotice:
      'Questa pagina è una traduzione redatta dall’IA e non è ancora stata rivista da un madrelingua italiano. In caso di discrepanza, prevale la versione inglese.',
  },

  whatThisIs: {
    title: 'Cos’è davvero Manourying',
    description:
      'Una spiegazione in linguaggio semplice del progetto, dell’equinozio, di cosa fa l’app al tuo telefono e di cosa non affermiamo.',
    eyebrow: 'In linguaggio semplice',
    h1: 'Cos’è, davvero',
    intro:
      'Nessun mistero qui, di proposito. L’unica cosa veramente segreta è il testo esatto della direttiva, e anche quello verrà pubblicato sette giorni prima dell’equinozio, con la sua impronta già disponibile ora. Tutto il resto è scritto qui sotto.',
    sections: [
      {
        heading: 'Cosa succede',
        body: 'In un istante fisso — l’equinozio di settembre — chiunque abbia questa app emette lo stesso suono nello stesso momento. Quattro secondi di vocale aperta, poi il proprio nome, poi dieci secondi di silenzio. Sedici secondi in totale. Poi finisce.',
      },
      {
        heading: 'Perché l’equinozio',
        body: 'Perché nessuno lo ha scelto. L’equinozio è fissato dalla meccanica orbitale, avviene due volte l’anno, e non appartiene a nessuna religione, nazione o calendario. È l’unico istante in cui l’intero pianeta condivide un giorno e una notte di uguale durata, e significa la stessa cosa in ogni lingua.',
      },
      {
        heading: 'Cosa è sigillato, e cosa no',
        body: 'Il testo esatto della direttiva viene pubblicato sette giorni prima dell’equinozio, in tutte le lingue contemporaneamente. Nient’altro è nascosto. L’impronta SHA-256 del testo sigillato viene pubblicata ora, così che in seguito chiunque possa verificare che ciò che gli è stato dato è ciò che è stato sigillato. La struttura — tono, nome, silenzio — è scritta in questa pagina e non è una sorpresa.',
      },
      {
        heading: 'Cosa fa questa app al tuo telefono',
        body: 'Quando armi il momento, viene programmata una sveglia locale sul tuo dispositivo con la marca temporale corretta già incorporata. Quella sveglia scatta senza segnale, senza server e senza notifica push. Tra l’armamento e l’equinozio, questa app invia esattamente due notifiche: l’apertura della direttiva, e il momento stesso. È tutto il budget di notifiche, di proposito.',
      },
      {
        heading: 'Il microfono',
        body: 'La registrazione è facoltativa, disattivata per impostazione predefinita, e richiesta separatamente. Se la attivi, il registratore cattura sei secondi fissi e si ferma da solo via codice. Il file resta sul tuo telefono. Non viene mai caricato a meno che tu non lo ascolti e poi scelga di caricarlo. Non esiste alcuna impostazione di caricamento automatico.',
      },
      {
        heading: 'Cosa non affermiamo',
        body: 'Un miliardo di voci non muoverà un sismometro, e non diciamo il contrario. Le forme d’onda in questa app sono texture, non misurazioni. Dove mostriamo dati sismici reali, provengono da IRIS e EMSC e sono etichettati come tali — anche quando non mostrano nulla.',
      },
      {
        heading: 'Perché il tuo tempismo sarà «sbagliato»',
        body: 'Il suono viaggia a 343 metri al secondo, quindi due persone distanti 340 metri fisicamente non possono sentirsi nello stesso istante. La simultaneità globale perfetta non è possibile e non è l’obiettivo. La tua deviazione dalla media globale è la cosa più interessante che questa app ti dirà mai su te stesso.',
      },
    ],
    whoBehindHeading: 'Chi c’è dietro',
    whoBehindBody:
      'Un piccolo progetto indipendente, non un’azienda, né una campagna, né un movimento. Non vende nulla, non raccoglie identificatori pubblicitari, e non è affiliato a nessun governo, religione o marchio. Se vuoi fare una domanda direttamente, scrivi a',
    closingFine:
      'Questa pagina esiste perché un’app di conto alla rovescia inspiegata che chiede l’accesso al microfono e aiuta a organizzare raduni pubblici sembra, agli occhi di uno scettico ragionevole, qualcosa di diverso da un progetto artistico. Quel sospetto è legittimo. Ecco la risposta.',
  },

  index: {
    title: 'Manourying',
    description:
      'Nell’istante dell’equinozio di settembre, chiunque abbia l’app emette lo stesso suono nello stesso momento. Sedici secondi, poi finisce.',
    eyebrow: 'Un istante · equinozio di settembre 2026',
    h1: 'Tutti emettono lo stesso suono nello stesso momento.',
    ledePrefix: 'Quattro secondi di vocale aperta. Poi il proprio nome. Poi dieci secondi di silenzio. ',
    ledeSuffix: ' secondi in totale, su ogni continente insieme — e poi si ferma per sei mesi.',
    ctaGetApp: 'Scarica l’app',
    ctaWhatThisIs: 'Cos’è davvero',
    scoreEyebrow: 'La forma che prende',
    score: [
      {
        at: '00:00',
        heading: 'Tieni una vocale aperta — «ah»',
        detail: 'Qualsiasi tono tu riesca a raggiungere comodamente. Se riesci a fare 110 Hz, fallo. Quattro secondi. Non gridare.',
      },
      {
        at: '00:04',
        heading: 'Di’ il tuo nome. Una volta.',
        detail: 'A voce normale. Qualunque nome a cui rispondi davvero.',
      },
      {
        at: '00:06',
        heading: 'Poi fermati.',
        detail: 'Dieci secondi di silenzio, ovunque tu sia. Questa parte non è facoltativa — è la parte per cui esistono le registrazioni.',
      },
    ],
    scoreFineBefore: 'Il testo esatto è sigillato fino a sette giorni prima. La sua impronta SHA-256 è pubblicata ora, così puoi verificare in seguito che nulla sia cambiato.',
    scoreFineLink: 'Vedi l’impronta',
    factsPitchEyebrow: 'Il tono',
    factsPitchNote: 'Abbastanza basso perché qualsiasi voce lo raggiunga. Nessun addestramento, nessuna lingua.',
    factsInstantEyebrow: 'L’istante',
    factsInstantNote: 'Fissato dalla meccanica orbitale, non da nessuno. Significa la stessa cosa ovunque.',
    factsNotifEyebrow: 'Notifiche',
    factsNotifValue: 'Due',
    factsNotifNote: 'L’apertura della direttiva, e il momento stesso. È tutto il budget, di proposito.',
    closingHeading: 'Perché il tuo tempismo sarà «sbagliato»',
    closingBody:
      'Il suono viaggia a 343 metri al secondo, quindi due persone distanti 340 metri fisicamente non possono sentirsi nello stesso istante. La simultaneità globale perfetta non è possibile e non è l’obiettivo. Dopo, l’app ti dice la tua deviazione dalla media globale, in millisecondi — la cosa più interessante che ti dirà mai su te stesso.',
    moreLink: 'Domande che le persone fanno davvero →',
    countdown: {
      fallback: 'L’equinozio di settembre.',
      wherePrefix: 'Da dove sei, sono le',
      whereMidnight: '— nel cuore della tua notte.',
      whereEarlyMorning: '— presto la mattina, da te.',
      wherePeriod: '.',
      passed: 'Il momento è passato.',
      daysUntil: 'Mancano {{DAYS}} giorni al momento.',
    },
  },

  faq: {
    title: 'Manourying — FAQ',
    description: 'Risposte dirette su inviti, microfono, dati, e se questo è una setta.',
    eyebrow: 'Domande',
    h1: 'Cosa chiedono davvero le persone',
    items: [
      {
        q: 'È una setta, una protesta o una campagna di marca?',
        a: 'Nessuna delle tre. A nessuno viene chiesto di credere in qualcosa, unirsi a qualcosa, opporsi a qualcosa o comprare qualcosa. Succede una volta, dura sedici secondi, e poi si ferma. Non c’è nessuna organizzazione a cui appartenere dopo.',
      },
      {
        q: 'Perché l’app vuole il mio microfono?',
        a: 'Non lo vuole, a meno che tu non attivi tu stesso la registrazione. La versione attuale viene distribuita con la cattura del microfono completamente disattivata — il permesso non viene nemmeno richiesto. Quando verrà introdotta, sarà disattivata per impostazione predefinita, richiesta separatamente, catturerà sei secondi fissi, e il file resterà sul tuo telefono a meno che tu non lo ascolti e scelga di caricarlo.',
      },
      {
        q: 'Ho bisogno di un invito?',
        a: 'Per rivendicare un posto, sì. Ogni posto porta tre inviti che non si rinnovano. Se sei arrivato senza codice, puoi invece riservare un posto in lista d’attesa, e i posti vengono rilasciati lì.',
      },
      {
        q: 'Perché solo tre inviti?',
        a: 'Un posto che può invitare chiunque è una mailing list. Tre bastano per raggiungere le persone accanto alle quali ti metteresti davvero, e sono pochi abbastanza perché spenderne uno sia una decisione.',
      },
      {
        q: 'Cosa succede se sto dormendo quando avviene?',
        a: 'Per gran parte del pianeta cade nel cuore della notte, e l’app te lo dice chiaramente quando scegli dove ti troverai. Se armi il momento, il tuo telefono programma una sveglia locale che scatta senza segnale e senza rete. Se ti alzi o no, sono affari tuoi.',
      },
      {
        q: 'Funziona senza internet?',
        a: 'Il giorno stesso, completamente. Tutto il necessario — la partitura, il tono di riferimento, la marca temporale corretta — è memorizzato sul dispositivo con largo anticipo. L’app è costruita sul presupposto che i nostri server saranno meno disponibili proprio quando saranno più richiesti.',
      },
      {
        q: 'Perché {{TONE_HZ}} Hz?',
        a: 'È abbastanza basso perché quasi ogni voce adulta lo raggiunga comodamente, e una singola nota non richiede addestramento né una lingua condivisa. Se non riesci a raggiungerlo, tieni il tono che ti è comodo — è scritto nella direttiva stessa.',
      },
      {
        q: 'Quali dati raccogliete?',
        a: 'Un posto è un token opaco, non un nome, un’email o un numero di telefono. Non c’è account, nessun identificatore pubblicitario, e nessuna analisi di terze parti. Vedi la pagina privacy per la posizione completa.',
      },
      {
        q: 'Questo apparirà sui sismometri?',
        a: 'No, e non lo affermeremo. Un miliardo di voci non muoverà un sismometro. Le reti sismiche urbane dense registrano effettivamente attività umana — ben documentato durante i lockdown del 2020 — e dove mostriamo quei dati provengono da IRIS ed EMSC e sono etichettati onestamente, anche quando non mostrano nulla.',
      },
      {
        q: 'Chi paga per questo?',
        a: 'Nessuno, nel senso che conta: non c’è raccolta fondi, nessuno sponsor, e nulla in vendita. Se questo cambia, sarà detto qui per primo.',
      },
      {
        q: 'Qualcosa non va / ho una domanda a cui non avete risposto.',
        a: 'Scrivi a {{CONTACT_EMAIL}}. Una persona vera lo legge.',
      },
    ],
  },

  privacy: {
    title: 'Manourying — Privacy',
    description: 'Cosa memorizza l’app, cosa non raccoglie mai, e la posizione sulla registrazione di terzi presenti in luoghi pubblici.',
    eyebrow: 'Privacy',
    h1: 'Cosa conserviamo, e cosa ci rifiutiamo di conservare',
    lede: 'In breve: non c’è account, nessun nome, nessuna email, nessun identificatore pubblicitario, e nessuna analisi di terze parti. Nulla di registrato sul tuo telefono lo lascia a meno che tu non decida che debba farlo.',
    seatHeading: 'Cos’è un posto',
    seatBody:
      'Un posto è un token casuale opaco memorizzato sul tuo dispositivo. Non è derivato dal tuo numero di telefono, dalla tua email, dall’identificatore del tuo dispositivo, né da nient’altro su di te, e non può essere invertito verso nessuno di questi. Due posti non possono essere collegati alla stessa persona da noi.',
    storesHeading: 'Cosa memorizza l’app sul tuo dispositivo',
    storesItems: [
      'Il tuo token del posto, nell’archiviazione sicura del sistema operativo.',
      'Lo scarto misurato tra l’orologio del tuo telefono e l’ora reale.',
      'In quale fuso UTC hai detto che ti troverai.',
      'Se hai armato il momento, e la sveglia locale programmata.',
    ],
    storesFooter: 'Tutto ciò viene rimosso quando disinstalli l’app. Nulla di ciò è un identificatore personale.',
    neverHeading: 'Cosa non raccogliamo mai',
    neverItems: [
      'Il tuo nome, indirizzo email o numero di telefono.',
      'La tua posizione precisa. L’app chiede in quale fuso UTC sarai — una scelta da un elenco di ventiquattro, non una coordinata.',
      'Identificatori pubblicitari, tracciamento tra app, o SDK di analisi di terze parti.',
      'A chi hai inviato un invito. Inviare un codice apre il tuo menu di condivisione; l’invito viene consumato quando qualcuno lo riscatta, e l’unica cosa che ti torna indietro è un conteggio.',
    ],
    micHeading: 'Il microfono, detto con precisione',
    micIntro:
      'La registrazione non è affatto presente nella versione attuale. Il permesso non viene richiesto e il codice di cattura non viene distribuito. Quando verrà aggiunto, queste sono le regole a cui dovrà attenersi, e sono già scritte nel codice come un contratto che ogni implementazione deve rispettare:',
    micItems: [
      'Richiesto separatamente, con parole proprie. Armare il momento non viene mai trattato come consenso a registrare.',
      'Una finestra fissa di sei secondi, fermata via codice piuttosto che da un timer di cui ci si fida che l’interfaccia rispetti.',
      'Memorizzato solo sul dispositivo. Non esiste alcuna impostazione di caricamento automatico che possa essere configurata male.',
      'Nulla viene caricato a meno che tu non l’abbia riascoltato e poi scelto di caricarlo.',
    ],
    bystanderHeading: 'Il problema degli astanti',
    bystanderP1:
      'Questa è la parte che merita una risposta diretta piuttosto che un paragrafo di frasi fatte. Una registrazione di sei secondi fatta in una piazza pubblica cattura le voci di persone che non hanno mai installato questa app, non hanno mai acconsentito a nulla, e non possono essere interpellate in seguito.',
    bystanderP2:
      'La nostra posizione: le registrazioni restano sul dispositivo per impostazione predefinita, proprio per evitare che la domanda si ponga affatto. Qualsiasi archivio pubblico di audio catturato sarà composto da contributi approvati individualmente — una persona che decide, dopo aver ascoltato la propria registrazione, che quella specifica può essere pubblicata — piuttosto che un’aggregazione in blocco di tutto ciò che i microfoni hanno captato. Se questo standard non può essere soddisfatto per una data registrazione, non entra nell’archivio.',
    bystanderP3Before: 'Se credi che una registrazione pubblicata ti contenga e tu non abbia acconsentito, scrivi a',
    bystanderP3After: 'e verrà rimossa. Non devi giustificarti né dimostrare nulla.',
    siteHeading: 'Questo sito web',
    siteBody:
      'Non vengono impostati cookie e non gira alcuna analisi. I font web sono caricati da Google Fonts, il che significa che i server di Google vedono la richiesta — se questo ti importa, un’estensione che blocca i font non rompe nulla qui.',
    rightsHeading: 'I tuoi diritti',
    rightsBefore:
      'Ai sensi del GDPR puoi chiedere cosa viene conservato su di te, chiederne la cancellazione, e reclamare presso la tua autorità di controllo nazionale. Poiché un posto è un token anonimo, nella maggior parte dei casi la risposta onesta a «cosa conservate su di me» è «nulla che ti identifichi» — e disinstallare l’app cancella il resto. Per qualsiasi altra cosa, scrivi a',
    rightsAfter: '.',
    lastUpdatedPrefix: 'Ultimo aggiornamento il',
    lastUpdatedSuffix: '. I cambiamenti sostanziali saranno datati qui, non modificati silenziosamente.',
    legalReviewNotice:
      'Questa traduzione non ha ricevuto una revisione legale. La versione inglese su /privacy prevale in caso di discrepanza.',
  },

  press: {
    title: 'Manourying — Stampa',
    description: 'Una descrizione semplice del progetto, i fatti da verificare, e come raggiungere una persona.',
    eyebrow: 'Stampa',
    h1: 'Per chiunque scriva di questo',
    lede: 'Prendi qualsiasi cosa in questa pagina e usala senza chiedere. Se qualcosa qui non è chiaro o pensi sia sbagliato, dillo — una correzione prima della pubblicazione vale per noi più di un articolo lusinghiero.',
    oneParagraphHeading: 'In un paragrafo',
    quoteBefore:
      'Manourying è un progetto artistico costruito attorno a un unico istante. All’equinozio di settembre — il momento in cui l’intero pianeta condivide un giorno e una notte di uguale durata — chiunque abbia l’app emette lo stesso suono nello stesso momento: quattro secondi di vocale aperta a circa',
    quoteAfter:
      'Hz, poi il proprio nome, poi dieci secondi di silenzio. Sedici secondi in totale. L’app è solo su invito, non fa quasi nulla fino al giorno, e invia esattamente due notifiche nei mesi precedenti. Poi accade, e si ferma per sei mesi.',
    factsHeading: 'Fatti da verificare',
    factInstant: 'L’istante',
    factDuration: 'Durata',
    factDurationValue: '16 secondi',
    factPitch: 'Tono di riferimento',
    factCadence: 'Cadenza',
    factCadenceValue: 'Due volte l’anno, ad ogni equinozio',
    factEntry: 'Accesso',
    factEntryValue: 'Solo su invito · tre per posto · non rinnovabile',
    factPlatforms: 'Piattaforme',
    factPlatformsValue: 'iOS e Android',
    factCost: 'Costo',
    factCostValue: 'Gratuito · niente in vendita · nessuna pubblicità',
    threeThingsHeading: 'Tre cose che non vi lasceremo stampare',
    threeThingsIntro: 'Non perché siano poco lusinghiere, ma perché sono false, e preferiamo che le sentiate da noi:',
    thingSeismic: {
      strong: 'Che verrà registrato dai sismometri.',
      rest: 'Non lo sarà. Un miliardo di voci non muove un sismometro. Le reti sismiche urbane dense mostrano effettivamente firme di attività umana — ben documentato durante i lockdown del 2020 — ed è una storia genuinamente interessante, ma non è la stessa affermazione.',
    },
    thingSimultaneous: {
      strong: 'Che è perfettamente simultaneo.',
      rest: 'Il suono viaggia a 343 m/s. Due persone distanti 340 metri non possono sentirsi nello stesso istante; la fisica lo vieta. Il progetto tratta questo come la parte interessante piuttosto che fingere il contrario.',
    },
    thingCampaign: {
      strong: 'Che è una protesta, una religione o una campagna di marca.',
      rest: 'A nessuno viene chiesto di credere in qualcosa, opporsi a qualcosa, unirsi a qualcosa o comprare qualcosa.',
    },
    contactHeading: 'Contatto',
    contactBefore: '',
    contactAfter: '— una persona vera, di solito entro un giorno. Per verifiche con scadenza urgente, indicalo nell’oggetto.',
    canonicalLabel: 'Spiegazione canonica:',
  },

  install: {
    title: 'Manourying — Installazione',
    description: 'Dove trovare l’app, su Android e iOS.',
    eyebrow: 'Installazione',
    h1: 'Scaricare l’app',
    lede: 'Manourying non è ancora su App Store o Google Play. Le versioni sono distribuite direttamente, il che comporta un paio di tocchi in più e un avviso dall’aspetto allarmante dal tuo telefono.',
    platformLabel: { android: 'Android', ios: 'iOS' },
    notYet: 'Non ancora',
    installFor: 'Installa per',
    haveCodeHeading: 'Hai già un codice?',
    haveCodeBody:
      'Installa prima l’app, poi aprila e digita il tuo codice di sei caratteri al varco. Toccare un link di invito prima che l’app sia installata non fa nulla — è un limite del link, non un problema con il tuo codice.',
    noCodeHeading: 'Nessun codice?',
    noCodeBody:
      'Installa comunque e prenota un posto in lista d’attesa. Ogni posto porta tre inviti che non si rinnovano, e i posti vengono rilasciati in lista man mano che si liberano.',
    brokenBefore: 'Qualcosa non funziona?',
  },

  directive: {
    title: 'Manourying — La direttiva sigillata',
    description: 'L’impronta SHA-256 della direttiva sigillata, pubblicata in anticipo per poter essere verificata in seguito.',
    eyebrowSealed: 'Direttiva 02 · sigillata',
    eyebrowOpen: 'Direttiva 02 · aperta',
    h1: 'Il sigillo',
    lede: 'Il testo esatto della direttiva viene pubblicato sette giorni prima dell’equinozio. La sua impronta viene pubblicata ora, così che in seguito chiunque possa verificare che il testo che gli è stato dato è quello che è stato sigillato — anche se non si fida di noi.',
    sealEyebrow: 'SHA-256 della direttiva sigillata',
    copyButton: 'Copia impronta',
    copiedLabel: 'Copiato',
    checkHeading: 'Come verificarlo da solo',
    checkP1Before: 'Quando la direttiva si apre il',
    checkP1After: 'prendi la sua forma canonica — ogni passo come ora⇥titolo⇥dettaglio, uno per riga, uniti da a capo, codificati in UTF-8 — e calcolane l’impronta:',
    checkP2: 'Se ciò non produce la stringa sopra, qualcosa è cambiato tra il sigillo e la rivelazione, e dovresti dirlo ad alta voce.',
    knownHeading: 'Cosa è già noto',
    knownBody:
      'La struttura non è mai stata segreta ed è scritta nella pagina principale: quattro secondi di vocale aperta, un nome pronunciato, dieci secondi di silenzio. Ciò che è sigillato è il testo preciso — quali parole, in quale ordine, tradotte in tutte le lingue contemporaneamente.',
    footerFine:
      'La stessa impronta è mostrata all’interno dell’app, calcolata in modo indipendente sul tuo dispositivo dalla copia inclusa nel binario. Due calcoli, un numero — se mai dovessero differire, non fidarti di nessuno dei due.',
  },

  gate: {
    title: 'Manourying — Il tuo invito',
    description: 'Qualcuno ha speso un invito per te. Ecco cosa significa e cosa farne.',
    eyebrow: 'Qualcuno ha speso un invito per te',
    h1: 'Un posto a Manourying',
    codeEyebrow: 'Il tuo codice',
    copyButton: 'Copia codice',
    copiedLabel: 'Copiato',
    codeFine: 'Scrivilo. Questo link è l’unico posto in cui esiste.',
    noCodeLede: 'Ogni posto porta tre inviti, che non si rinnovano — quindi se qualcuno te ne ha inviato uno, ha rinunciato a un terzo di ciò che aveva.',
    invitedHeading: 'A cosa sei stato invitato',
    invitedBody:
      'In un istante fisso — l’equinozio di settembre — chiunque abbia l’app emette lo stesso suono nello stesso momento. Quattro secondi di vocale aperta, poi il tuo nome, poi dieci secondi di silenzio. Sedici secondi, poi finisce.',
    invitedLinkBefore: '',
    invitedLink: 'La spiegazione completa, in linguaggio semplice,',
    invitedLinkAfter: 'vale due minuti prima di installare qualsiasi cosa.',
    nextHeading: 'Cosa fare ora',
    nextSteps: [
      'Installa l’app.',
      'Aprila e inserisci il tuo codice al varco.',
      'Scegli dove ti troverai davvero, e arma il momento.',
    ],
    ctaGetApp: 'Scarica l’app',
    footerFine:
      'Se hai già installato l’app, questo link avrebbe dovuto aprirla direttamente. Che non l’abbia fatto è un limite noto mentre viene configurata la verifica dei link dell’app — inserisci il codice manualmente e funzionerà esattamente allo stesso modo.',
  },

  notFound: {
    title: 'Manourying — Non trovata',
    description: 'Quella pagina non esiste.',
    eyebrow: '404',
    h1: 'Niente qui.',
    lede: 'La pagina che hai richiesto non esiste. Ciò che esiste sicuramente:',
    linkWhatThisIs: 'Cos’è davvero',
    linkFaq: 'Domande che le persone fanno',
    linkInstall: 'Scaricare l’app',
  },
};
