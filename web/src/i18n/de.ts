import type { Dictionary } from './dictionary';

/** KI-verfasst, noch nicht von einem deutschen Muttersprachler geprüft — siehe `common.translationNotice`. */
export const de: Dictionary = {
  common: {
    skipToContent: 'Zum Inhalt springen',
    nav: {
      whatThisIs: 'Worum es geht',
      faq: 'FAQ',
      directive: 'Direktive',
      privacy: 'Datenschutz',
      press: 'Presse',
    },
    footerTagline: 'Ein Kunstprojekt. Nicht verbunden mit einer Regierung, Religion oder Marke.',
    translationNotice:
      'Diese Seite ist eine KI-verfasste Übersetzung und wurde noch nicht von einem deutschen Muttersprachler geprüft. Bei Abweichungen gilt die englische Fassung.',
  },

  whatThisIs: {
    title: 'Was Manourying wirklich ist',
    description:
      'Eine Erklärung in einfacher Sprache: das Projekt, die Tagundnachtgleiche, was die App mit deinem Telefon macht, und was wir nicht behaupten.',
    eyebrow: 'In einfacher Sprache',
    h1: 'Was das hier wirklich ist',
    intro:
      'Hier gibt es absichtlich kein Geheimnis. Das einzig wirklich Geheime ist der genaue Wortlaut der Direktive, und selbst der wird sieben Tage vor der Tagundnachtgleiche veröffentlicht, mit einem von Anfang an verfügbaren Hashwert. Alles andere steht unten.',
    sections: [
      {
        heading: 'Was passiert',
        body: 'Zu einem festen Zeitpunkt — der Tagundnachtgleiche im September — machen alle, die diese App haben, gleichzeitig das gleiche Geräusch. Vier Sekunden ein offener Vokal, dann der eigene Name, dann zehn Sekunden Stille. Sechzehn Sekunden insgesamt. Dann ist es vorbei.',
      },
      {
        heading: 'Warum die Tagundnachtgleiche',
        body: 'Weil niemand sie ausgewählt hat. Die Tagundnachtgleiche ist durch die Himmelsmechanik festgelegt, geschieht zweimal im Jahr und gehört keiner Religion, Nation oder keinem Kalender. Es ist der eine Moment, in dem der ganze Planet gleich lange Tag und Nacht hat, und er bedeutet in jeder Sprache dasselbe.',
      },
      {
        heading: 'Was versiegelt ist, und was nicht',
        body: 'Der genaue Wortlaut der Direktive wird sieben Tage vor der Tagundnachtgleiche veröffentlicht, in allen Sprachen gleichzeitig. Nichts anderes ist verborgen. Der SHA-256-Hash des versiegelten Textes wird jetzt veröffentlicht, damit du später überprüfen kannst, dass das, was du erhalten hast, auch das ist, was versiegelt wurde. Die Struktur — Ton, Name, Stille — steht auf dieser Seite und ist keine Überraschung.',
      },
      {
        heading: 'Was diese App mit deinem Telefon macht',
        body: 'Wenn du den Moment aktivierst, plant sie einen lokalen Alarm auf deinem Gerät, mit dem korrigierten Zeitstempel bereits eingebaut. Dieser Alarm löst ohne Signal, ohne Server und ohne Push-Benachrichtigung aus. Zwischen dem Aktivieren und der Tagundnachtgleiche sendet diese App genau zwei Benachrichtigungen: die Öffnung der Direktive und den Moment selbst. Das ist das gesamte Benachrichtigungsbudget, absichtlich.',
      },
      {
        heading: 'Das Mikrofon',
        body: 'Die Aufnahme ist optional, standardmäßig deaktiviert, und wird gesondert abgefragt. Wenn du sie aktivierst, nimmt der Rekorder sechs feste Sekunden auf und stoppt sich per Code selbst. Die Datei bleibt auf deinem Telefon. Sie wird niemals hochgeladen, es sei denn, du hörst sie an und entscheidest dich dann für den Upload. Es gibt keine automatische Upload-Einstellung.',
      },
      {
        heading: 'Was wir nicht behaupten',
        body: 'Eine Milliarde Stimmen wird kein Seismometer bewegen, und das Gegenteil behaupten wir nicht. Die Wellenformen in dieser App sind Textur, keine Messungen. Wo wir echte seismische Daten zeigen, stammen sie von IRIS und EMSC und sind entsprechend gekennzeichnet — auch wenn sie gar nichts zeigen.',
      },
      {
        heading: 'Warum dein Timing „falsch" sein wird',
        body: 'Schall bewegt sich mit 343 Metern pro Sekunde, sodass zwei 340 Meter voneinander entfernte Personen sich physikalisch nicht im selben Moment hören können. Perfekte globale Gleichzeitigkeit ist nicht möglich und nicht das Ziel. Danach teilt dir die App deine eigene Abweichung vom globalen Mittelwert mit, in Millisekunden — das Interessanteste, was sie dir jemals über dich selbst sagen wird.',
      },
    ],
    whoBehindHeading: 'Wer dahintersteckt',
    whoBehindBody:
      'Ein kleines unabhängiges Projekt, kein Unternehmen, keine Kampagne, keine Bewegung. Es verkauft nichts, sammelt keine Werbekennungen und ist mit keiner Regierung, Religion oder Marke verbunden. Wenn du direkt etwas fragen möchtest, schreibe an',
    closingFine:
      'Diese Seite existiert, weil eine unerklärte Countdown-App, die Mikrofonzugriff verlangt und öffentliche Zusammenkünfte organisiert, für einen vernünftigen Skeptiker wie etwas anderes als ein Kunstprojekt aussieht. Dieser Verdacht ist berechtigt. Hier ist die Antwort darauf.',
  },

  index: {
    title: 'Manourying',
    description:
      'Im Moment der Tagundnachtgleiche im September machen alle, die die App haben, gleichzeitig das gleiche Geräusch. Sechzehn Sekunden, dann ist es vorbei.',
    eyebrow: 'Ein Moment · Tagundnachtgleiche September 2026',
    h1: 'Alle machen gleichzeitig das gleiche Geräusch.',
    ledePrefix: 'Vier Sekunden ein offener Vokal. Dann der eigene Name. Dann zehn Sekunden Stille. ',
    ledeSuffix: ' Sekunden insgesamt, auf jedem Kontinent gleichzeitig — und dann ist für sechs Monate Ruhe.',
    ctaGetApp: 'App holen',
    ctaWhatThisIs: 'Was das wirklich ist',
    scoreEyebrow: 'Die Form, die es annimmt',
    score: [
      {
        at: '00:00',
        heading: 'Halte einen offenen Vokal — „ah"',
        detail: 'Jede Tonhöhe, die du bequem erreichen kannst. Wenn du 110 Hz treffen kannst, tu es. Vier Sekunden. Nicht schreien.',
      },
      {
        at: '00:04',
        heading: 'Sag deinen eigenen Namen. Einmal.',
        detail: 'In normaler Lautstärke. Welchen Namen auch immer du tatsächlich beantwortest.',
      },
      {
        at: '00:06',
        heading: 'Dann aufhören.',
        detail: 'Zehn Sekunden Stille, wo auch immer du bist. Dieser Teil ist nicht optional — dafür sind die Aufnahmen da.',
      },
    ],
    scoreFineBefore:
      'Der genaue Wortlaut ist bis sieben Tage vorher versiegelt. Sein SHA-256-Hash wird jetzt veröffentlicht, damit du danach überprüfen kannst, dass sich nichts geändert hat.',
    scoreFineLink: 'Hash ansehen',
    factsPitchEyebrow: 'Der Ton',
    factsPitchNote: 'Tief genug, dass jede Stimme ihn erreicht. Kein Training, keine Sprache nötig.',
    factsInstantEyebrow: 'Der Moment',
    factsInstantNote: 'Durch Himmelsmechanik festgelegt, von niemandem. Er bedeutet überall dasselbe.',
    factsNotifEyebrow: 'Benachrichtigungen',
    factsNotifValue: 'Zwei',
    factsNotifNote: 'Die Öffnung der Direktive, und der Moment selbst. Das ist das gesamte Budget, absichtlich.',
    closingHeading: 'Warum dein Timing „falsch" sein wird',
    closingBody:
      'Schall bewegt sich mit 343 Metern pro Sekunde, sodass zwei 340 Meter voneinander entfernte Personen sich physikalisch nicht im selben Moment hören können. Perfekte globale Gleichzeitigkeit ist nicht möglich und nicht das Ziel. Danach teilt dir die App deine eigene Abweichung vom globalen Mittelwert mit, in Millisekunden — das Interessanteste, was sie dir jemals über dich selbst sagen wird.',
    moreLink: 'Fragen, die Leute wirklich stellen →',
    countdown: {
      fallback: 'Die Tagundnachtgleiche im September.',
      wherePrefix: 'Bei dir ist es',
      whereMidnight: '— mitten in der Nacht bei dir.',
      whereEarlyMorning: '— früh am Morgen bei dir.',
      wherePeriod: '.',
      passed: 'Der Moment ist vorbei.',
      daysUntil: 'Noch {{DAYS}} Tage bis zum Moment.',
    },
  },

  faq: {
    title: 'Manourying — FAQ',
    description: 'Direkte Antworten zu Einladungen, dem Mikrofon, den Daten, und ob das hier eine Sekte ist.',
    eyebrow: 'Fragen',
    h1: 'Was Leute wirklich fragen',
    items: [
      {
        q: 'Ist das eine Sekte, ein Protest oder eine Markenkampagne?',
        a: 'Keins von den dreien. Niemand wird gebeten, an etwas zu glauben, irgendetwas beizutreten, sich gegen etwas zu stellen oder etwas zu kaufen. Es passiert einmal, dauert sechzehn Sekunden, und hört dann auf. Danach gibt es keine Organisation, der man angehören würde.',
      },
      {
        q: 'Warum will die App mein Mikrofon?',
        a: 'Will sie nicht, es sei denn, du aktivierst die Aufnahme selbst. Die aktuelle Version wird mit vollständig deaktivierter Mikrofonaufnahme ausgeliefert — die Berechtigung wird nicht einmal angefragt. Wenn sie eingeführt wird, ist sie standardmäßig aus, wird gesondert abgefragt, nimmt sechs feste Sekunden auf, und die Datei bleibt auf deinem Telefon, es sei denn, du hörst sie an und entscheidest dich für den Upload.',
      },
      {
        q: 'Brauche ich eine Einladung?',
        a: 'Um einen Platz zu beanspruchen, ja. Jeder Platz trägt drei Einladungen, die sich nicht erneuern. Wenn du ohne Code gekommen bist, kannst du stattdessen einen Platz in der Warteliste einnehmen, und Plätze werden dorthin freigegeben.',
      },
      {
        q: 'Warum nur drei Einladungen?',
        a: 'Ein Platz, der jeden einladen kann, ist eine Mailingliste. Drei reichen aus, um die Leute zu erreichen, neben denen man tatsächlich stehen würde, und wenige genug, damit das Ausgeben einer Einladung eine Entscheidung ist.',
      },
      {
        q: 'Was passiert, wenn ich schlafe, wenn es passiert?',
        a: 'Für einen großen Teil des Planeten fällt es mitten in die Nacht, und die App sagt das klar, wenn du auswählst, wo du stehen wirst. Wenn du den Moment aktivierst, plant dein Telefon einen lokalen Alarm, der ohne Signal und ohne Netz auslöst. Ob du aufstehst, ist deine Sache.',
      },
      {
        q: 'Funktioniert es ohne Internet?',
        a: 'Am Tag selbst, vollständig. Alles Nötige — die Partitur, der Referenzton, der korrigierte Zeitstempel — wird gut im Voraus auf dem Gerät gespeichert. Die App ist unter der Annahme gebaut, dass unsere Server genau dann am wenigsten verfügbar sein werden, wenn sie am meisten gebraucht werden.',
      },
      {
        q: 'Warum {{TONE_HZ}} Hz?',
        a: 'Tief genug, dass fast jede erwachsene Stimme ihn bequem erreicht, und ein einzelner Ton erfordert kein Training und keine gemeinsame Sprache. Wenn du ihn nicht treffen kannst, halte die Tonhöhe, die für dich bequem ist — das steht in der Direktive selbst.',
      },
      {
        q: 'Welche Daten sammelt ihr?',
        a: 'Ein Platz ist ein undurchsichtiges Token, kein Name, keine E-Mail, keine Telefonnummer. Es gibt kein Konto, keine Werbekennung und keine Analyse-Tools von Drittanbietern. Die vollständige Position steht auf der Datenschutzseite.',
      },
      {
        q: 'Wird das auf Seismometern erscheinen?',
        a: 'Nein, und das werden wir nicht behaupten. Eine Milliarde Stimmen bewegt kein Seismometer. Dichte städtische seismische Netzwerke registrieren tatsächlich menschliche Aktivität — gut dokumentiert während der Lockdowns 2020 — und wo wir diese Daten zeigen, stammen sie von IRIS und EMSC und sind ehrlich gekennzeichnet, auch wenn sie nichts zeigen.',
      },
      {
        q: 'Wer bezahlt das?',
        a: 'Niemand, im Sinne, der zählt: Es gibt keine Finanzierungsrunde, keinen Sponsor, und nichts wird verkauft. Sollte sich das ändern, wird es hier zuerst gesagt.',
      },
      {
        q: 'Etwas stimmt nicht / ich habe eine Frage, die ihr nicht beantwortet habt.',
        a: 'Schreib an {{CONTACT_EMAIL}}. Ein echter Mensch liest das.',
      },
    ],
  },

  privacy: {
    title: 'Manourying — Datenschutz',
    description: 'Was die App speichert, was sie niemals sammelt, und die Position zur Aufnahme unbeteiligter Personen an öffentlichen Orten.',
    eyebrow: 'Datenschutz',
    h1: 'Was wir aufbewahren, und was wir uns weigern aufzubewahren',
    lede: 'Kurz gesagt: Es gibt kein Konto, keinen Namen, keine E-Mail, keine Werbekennung und keine Analyse-Tools von Drittanbietern. Nichts, was auf deinem Telefon aufgenommen wird, verlässt es, außer du entscheidest, dass es das soll.',
    seatHeading: 'Was ein Platz ist',
    seatBody:
      'Ein Platz ist ein undurchsichtiges Zufallstoken, das auf deinem Gerät gespeichert wird. Es ist weder aus deiner Telefonnummer noch deiner E-Mail, deiner Gerätekennung oder irgendetwas anderem über dich abgeleitet, und kann zu keinem davon zurückverfolgt werden. Zwei Plätze können von uns nicht derselben Person zugeordnet werden.',
    storesHeading: 'Was die App auf deinem Gerät speichert',
    storesItems: [
      'Dein Platztoken, im sicheren Speicher des Betriebssystems.',
      'Die gemessene Abweichung zwischen der Uhr deines Telefons und der tatsächlichen Zeit.',
      'In welcher UTC-Zone du angegeben hast zu stehen.',
      'Ob du den Moment aktiviert hast, und den geplanten lokalen Alarm.',
    ],
    storesFooter: 'All das wird entfernt, wenn du die App deinstallierst. Nichts davon ist ein persönliches Kennzeichen.',
    neverHeading: 'Was wir niemals sammeln',
    neverItems: [
      'Deinen Namen, deine E-Mail-Adresse oder Telefonnummer.',
      'Deinen genauen Standort. Die App fragt, in welcher UTC-Zone du sein wirst — eine Wahl aus einer Liste von vierundzwanzig, keine Koordinate.',
      'Werbekennungen, App-übergreifendes Tracking oder Analyse-SDKs von Drittanbietern.',
      'An wen du eine Einladung geschickt hast. Das Senden eines Codes öffnet dein eigenes Teilen-Menü; die Einladung ist verbraucht, sobald jemand sie einlöst, und das Einzige, was an dich zurückkommt, ist eine Zahl.',
    ],
    micHeading: 'Das Mikrofon, präzise formuliert',
    micIntro:
      'Aufnahme ist in der aktuellen Version überhaupt nicht enthalten. Die Berechtigung wird nicht angefragt und der Aufnahmecode wird nicht ausgeliefert. Wenn er hinzugefügt wird, sind dies die Regeln, an die er gebunden sein wird, und sie stehen bereits im Code als Vertrag, den jede Umsetzung erfüllen muss:',
    micItems: [
      'Wird gesondert, mit eigenen Worten, abgefragt. Das Aktivieren des Moments wird niemals als Zustimmung zur Aufnahme behandelt.',
      'Ein festes Sechs-Sekunden-Fenster, per Code gestoppt, nicht durch einen Timer, dem die Oberfläche vertrauensvoll gehorchen muss.',
      'Nur auf dem Gerät gespeichert. Es gibt keine automatische Upload-Einstellung, die falsch gesetzt werden könnte.',
      'Nichts wird hochgeladen, es sei denn, du hast es dir erneut angehört und dich dann für den Upload entschieden.',
    ],
    bystanderHeading: 'Das Problem unbeteiligter Personen',
    bystanderP1:
      'Das ist der Teil, der eine direkte Antwort verdient statt eines Absatzes mit Floskeln. Eine sechssekündige Aufnahme, die auf einem öffentlichen Platz gemacht wird, erfasst die Stimmen von Menschen, die diese App nie installiert, nie irgendetwas zugestimmt haben und im Nachhinein nicht gefragt werden können.',
    bystanderP2:
      'Unsere Position: Aufnahmen bleiben standardmäßig auf dem Gerät, gerade damit sich diese Frage gar nicht erst stellt. Jedes öffentliche Archiv erfasster Audiodaten wird aus einzeln freigegebenen Beiträgen bestehen — eine Person entscheidet, nachdem sie ihre eigene Aufnahme gehört hat, dass genau diese veröffentlicht werden darf — statt aus einer Massenaggregation von allem, was die Mikrofone eingefangen haben. Wenn dieser Standard für eine bestimmte Aufnahme nicht erfüllt werden kann, kommt sie nicht ins Archiv.',
    bystanderP3Before: 'Wenn du glaubst, dass eine veröffentlichte Aufnahme dich enthält und du dem nicht zugestimmt hast, schreibe an',
    bystanderP3After: 'und sie wird entfernt. Du musst dich nicht rechtfertigen oder irgendetwas beweisen.',
    siteHeading: 'Diese Website',
    siteBody:
      'Es werden keine Cookies gesetzt und keine Analysen ausgeführt. Webschriften werden von Google Fonts geladen, was bedeutet, dass Googles Server die Anfrage sehen — falls dir das wichtig ist, bricht eine schriftblockierende Erweiterung hier nichts.',
    rightsHeading: 'Deine Rechte',
    rightsBefore:
      'Nach der DSGVO kannst du fragen, was über dich gespeichert ist, um dessen Löschung bitten, und dich bei deiner nationalen Aufsichtsbehörde beschweren. Da ein Platz ein anonymes Token ist, lautet die ehrliche Antwort auf „was speichert ihr über mich" in den meisten Fällen „nichts, das dich identifiziert" — und das Deinstallieren der App löscht den Rest. Für alles andere schreibe an',
    rightsAfter: '.',
    lastUpdatedPrefix: 'Zuletzt aktualisiert am',
    lastUpdatedSuffix: '. Wesentliche Änderungen werden hier datiert, nicht still bearbeitet.',
    legalReviewNotice:
      'Diese Übersetzung wurde keiner juristischen Prüfung unterzogen. Bei Abweichungen gilt die englische Fassung unter /privacy.',
  },

  press: {
    title: 'Manourying — Presse',
    description: 'Eine einfache Beschreibung des Projekts, überprüfenswerte Fakten, und wie man eine Person erreicht.',
    eyebrow: 'Presse',
    h1: 'Für alle, die darüber schreiben',
    lede: 'Nimm alles auf dieser Seite und verwende es ohne zu fragen. Wenn etwas hier unklar ist oder du denkst, es sei falsch, sag es — eine Korrektur vor der Veröffentlichung ist uns mehr wert als ein schmeichelhafter Artikel.',
    oneParagraphHeading: 'In einem Absatz',
    quoteBefore:
      'Manourying ist ein Kunstprojekt, das um einen einzigen Moment herum aufgebaut ist. Bei der Tagundnachtgleiche im September — dem Moment, in dem der ganze Planet gleich lange Tag und Nacht teilt — machen alle mit der App gleichzeitig das gleiche Geräusch: vier Sekunden ein offener Vokal bei etwa',
    quoteAfter:
      'Hz, dann der eigene Name, dann zehn Sekunden Stille. Sechzehn Sekunden insgesamt. Die App funktioniert nur auf Einladung, tut bis zum Tag fast nichts, und sendet in den Monaten davor genau zwei Benachrichtigungen. Dann passiert es, und für sechs Monate ist Ruhe.',
    factsHeading: 'Überprüfenswerte Fakten',
    factInstant: 'Der Moment',
    factDuration: 'Dauer',
    factDurationValue: '16 Sekunden',
    factPitch: 'Referenzton',
    factCadence: 'Rhythmus',
    factCadenceValue: 'Zweimal im Jahr, bei jeder Tagundnachtgleiche',
    factEntry: 'Zugang',
    factEntryValue: 'Nur auf Einladung · drei pro Platz · nicht erneuerbar',
    factPlatforms: 'Plattformen',
    factPlatformsValue: 'iOS und Android',
    factCost: 'Kosten',
    factCostValue: 'Kostenlos · nichts zu verkaufen · keine Werbung',
    threeThingsHeading: 'Drei Dinge, die wir euch nicht drucken lassen',
    threeThingsIntro: 'Nicht weil sie unvorteilhaft sind, sondern weil sie falsch sind, und wir hätten lieber, dass ihr es von uns hört:',
    thingSeismic: {
      strong: 'Dass es auf Seismometern registriert wird.',
      rest: 'Wird es nicht. Eine Milliarde Stimmen bewegt kein Seismometer. Dichte städtische seismische Netzwerke zeigen tatsächlich Signaturen menschlicher Aktivität — gut dokumentiert während der Lockdowns 2020 — und das ist eine wirklich interessante Geschichte, aber nicht dieselbe Behauptung.',
    },
    thingSimultaneous: {
      strong: 'Dass es perfekt gleichzeitig ist.',
      rest: 'Schall bewegt sich mit 343 m/s. Zwei 340 Meter voneinander entfernte Personen können sich nicht im selben Moment hören; die Physik verbietet es. Das Projekt behandelt das als den interessanten Teil, statt das Gegenteil vorzutäuschen.',
    },
    thingCampaign: {
      strong: 'Dass es ein Protest, eine Religion oder eine Markenkampagne ist.',
      rest: 'Niemand wird gebeten, an etwas zu glauben, sich gegen etwas zu stellen, irgendetwas beizutreten oder etwas zu kaufen.',
    },
    contactHeading: 'Kontakt',
    contactBefore: '',
    contactAfter: '— ein echter Mensch, meist innerhalb eines Tages. Für Faktenchecks unter Zeitdruck bitte in der Betreffzeile vermerken.',
    canonicalLabel: 'Kanonische Erklärung:',
  },

  install: {
    title: 'Manourying — Installation',
    description: 'Wo man die App bekommt, für Android und iOS.',
    eyebrow: 'Installation',
    h1: 'Die App holen',
    lede: 'Manourying ist noch nicht im App Store oder bei Google Play. Versionen werden direkt verteilt, was ein paar zusätzliche Klicks und eine alarmierend aussehende Warnung von deinem Telefon bedeutet.',
    platformLabel: { android: 'Android', ios: 'iOS' },
    notYet: 'Noch nicht',
    installFor: 'Installieren für',
    haveCodeHeading: 'Schon einen Code?',
    haveCodeBody:
      'Installiere zuerst die App, öffne sie dann und gib deinen sechsstelligen Code am Tor ein. Auf einen Einladungslink zu tippen, bevor die App installiert ist, bewirkt nichts — das ist eine Einschränkung des Links, kein Problem mit deinem Code.',
    noCodeHeading: 'Kein Code?',
    noCodeBody:
      'Installiere trotzdem und nimm einen Platz in der Warteliste ein. Jeder Platz trägt drei Einladungen, die sich nicht erneuern, und Plätze werden in der Liste freigegeben, sobald sie frei werden.',
    brokenBefore: 'Etwas kaputt?',
  },

  directive: {
    title: 'Manourying — Die versiegelte Direktive',
    description: 'Der SHA-256-Hash der versiegelten Direktive, im Voraus veröffentlicht, damit er später überprüft werden kann.',
    eyebrowSealed: 'Direktive 02 · versiegelt',
    eyebrowOpen: 'Direktive 02 · offen',
    h1: 'Das Siegel',
    lede: 'Der genaue Wortlaut der Direktive wird sieben Tage vor der Tagundnachtgleiche veröffentlicht. Sein Hash wird jetzt veröffentlicht, damit später jeder überprüfen kann, dass der ihm gegebene Text der ist, der versiegelt wurde — auch wenn er uns nicht vertraut.',
    sealEyebrow: 'SHA-256 der versiegelten Direktive',
    copyButton: 'Hash kopieren',
    copiedLabel: 'Kopiert',
    checkHeading: 'Wie du es selbst überprüfst',
    checkP1Before: 'Wenn sich die Direktive öffnet am',
    checkP1After: 'nimm ihre kanonische Form — jeder Schritt als Zeit⇥Überschrift⇥Detail, eine pro Zeile, durch Zeilenumbrüche verbunden, UTF-8-kodiert — und berechne den Hash:',
    checkP2: 'Wenn das nicht die obige Zeichenfolge ergibt, hat sich zwischen Versiegelung und Offenlegung etwas geändert, und du solltest das laut sagen.',
    knownHeading: 'Was bereits bekannt ist',
    knownBody:
      'Die Struktur war nie geheim und steht auf der Startseite: vier Sekunden ein offener Vokal, ein gesprochener Name, zehn Sekunden Stille. Versiegelt ist der genaue Wortlaut — welche Wörter, in welcher Reihenfolge, gleichzeitig in alle Sprachen übersetzt.',
    footerFine:
      'Derselbe Hash wird in der App angezeigt, unabhängig auf deinem eigenen Gerät berechnet aus der im Binary enthaltenen Kopie. Zwei Berechnungen, eine Zahl — sollten sie jemals abweichen, traue keiner von beiden.',
  },

  gate: {
    title: 'Manourying — Deine Einladung',
    description: 'Jemand hat eine Einladung für dich ausgegeben. Hier ist, was das bedeutet und was zu tun ist.',
    eyebrow: 'Jemand hat eine Einladung für dich ausgegeben',
    h1: 'Ein Platz bei Manourying',
    codeEyebrow: 'Dein Code',
    copyButton: 'Code kopieren',
    copiedLabel: 'Kopiert',
    codeFine: 'Schreib ihn auf. Dieser Link ist der einzige Ort, an dem er existiert.',
    noCodeLede: 'Jeder Platz trägt drei Einladungen, die sich nicht erneuern — wenn dir also jemand eine geschickt hat, hat er ein Drittel dessen aufgegeben, was er hatte.',
    invitedHeading: 'Wozu du eingeladen wurdest',
    invitedBody:
      'Zu einem festen Zeitpunkt — der Tagundnachtgleiche im September — machen alle mit der App gleichzeitig das gleiche Geräusch. Vier Sekunden ein offener Vokal, dann dein eigener Name, dann zehn Sekunden Stille. Sechzehn Sekunden, dann ist es vorbei.',
    invitedLinkBefore: '',
    invitedLink: 'Die vollständige Erklärung in einfacher Sprache',
    invitedLinkAfter: 'ist zwei Minuten wert, bevor du irgendetwas installierst.',
    nextHeading: 'Was jetzt zu tun ist',
    nextSteps: [
      'Installiere die App.',
      'Öffne sie und gib deinen Code am Tor ein.',
      'Wähle, wo du tatsächlich stehen wirst, und aktiviere den Moment.',
    ],
    ctaGetApp: 'App holen',
    footerFine:
      'Falls du die App bereits installiert hast, hätte dieser Link sie direkt öffnen sollen. Dass er das nicht getan hat, ist eine bekannte Einschränkung, während die App-Link-Verifizierung eingerichtet wird — gib den Code manuell ein, das funktioniert genau gleich.',
  },

  notFound: {
    title: 'Manourying — Nicht gefunden',
    description: 'Diese Seite gibt es nicht.',
    eyebrow: '404',
    h1: 'Nichts hier.',
    lede: 'Die Seite, die du angefordert hast, gibt es nicht. Was es definitiv gibt:',
    linkWhatThisIs: 'Was das wirklich ist',
    linkFaq: 'Fragen, die Leute stellen',
    linkInstall: 'Die App holen',
  },
};
