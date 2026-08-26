import type { Dictionary } from './dictionary';

/**
 * AI-drafted, not yet reviewed by a native French speaker — see
 * `common.translationNotice`, which is what actually surfaces that caveat on
 * every page this dictionary renders.
 */
export const fr: Dictionary = {
  common: {
    skipToContent: 'Passer au contenu',
    nav: {
      whatThisIs: 'Ce que c’est',
      faq: 'FAQ',
      directive: 'Directive',
      privacy: 'Confidentialité',
      press: 'Presse',
    },
    footerTagline:
      'Un projet artistique. Non affilié à un gouvernement, une religion ou une marque.',
    translationNotice:
      'Cette page est une traduction rédigée par IA et n’a pas encore été relue par une personne francophone native. En cas de désaccord, la version anglaise fait foi.',
  },

  whatThisIs: {
    title: 'Ce qu’est réellement Manourying',
    description:
      'Une explication en langage clair du projet, de l’équinoxe, de ce que l’application fait sur votre téléphone, et de ce que nous n’affirmons pas.',
    eyebrow: 'En langage clair',
    h1: 'Ce que c’est, réellement',
    intro:
      'Aucun mystère ici, volontairement. La seule chose qui soit véritablement secrète est le texte exact de la directive, et même celui-ci sera publié sept jours avant l’équinoxe, son empreinte étant disponible dès maintenant. Tout le reste est écrit ci-dessous.',
    sections: [
      {
        heading: 'Ce qui se passe',
        body: 'À un instant fixe — l’équinoxe de septembre — toute personne possédant cette application émet le même son au même moment. Quatre secondes de voyelle ouverte, puis son propre prénom, puis dix secondes de silence. Seize secondes au total. Puis c’est terminé.',
      },
      {
        heading: 'Pourquoi l’équinoxe',
        body: 'Parce que personne ne l’a choisi. L’équinoxe est fixé par la mécanique orbitale, survient deux fois par an, et n’appartient à aucune religion, nation ou calendrier. C’est le seul instant où la planète entière partage un jour et une nuit d’égale durée, et il signifie la même chose dans toutes les langues.',
      },
      {
        heading: 'Ce qui est scellé, et ce qui ne l’est pas',
        body: 'Le texte exact de la directive est publié sept jours avant l’équinoxe, dans toutes les langues à la fois. Rien d’autre n’est caché. L’empreinte SHA-256 du texte scellé est publiée dès maintenant, afin qu’ensuite vous puissiez vérifier que ce qui vous a été donné est bien ce qui a été scellé. La structure — tonalité, prénom, silence — est écrite sur cette page et n’est pas une surprise.',
      },
      {
        heading: 'Ce que cette application fait à votre téléphone',
        body: 'Lorsque vous armez le moment, l’application programme une alarme locale sur votre appareil, avec l’horodatage corrigé déjà intégré. Cette alarme se déclenche sans signal, sans serveur et sans notification push. Entre l’armement et l’équinoxe, cette application envoie exactement deux notifications : le descellement de la directive, et le moment lui-même. C’est là tout le budget de notifications, volontairement.',
      },
      {
        heading: 'Le microphone',
        body: 'L’enregistrement est optionnel, désactivé par défaut, et demandé séparément. Si vous l’activez, l’enregistreur capture six secondes fixes et s’arrête de lui-même par le code. Le fichier reste sur votre téléphone. Il n’est jamais téléversé, à moins que vous ne l’écoutiez et ne choisissiez ensuite de le téléverser. Il n’existe aucun paramètre de téléversement automatique.',
      },
      {
        heading: 'Ce que nous n’affirmons pas',
        body: 'Un milliard de voix ne fera pas bouger un sismomètre, et nous n’affirmons pas le contraire. Les formes d’onde de cette application sont une texture, non des mesures. Lorsque nous montrons de véritables données sismiques, elles proviennent d’IRIS et de l’EMSC et sont identifiées comme telles — y compris lorsqu’elles ne montrent rien du tout.',
      },
      {
        heading: 'Pourquoi votre synchronisation sera « fausse »',
        body: 'Le son voyage à 343 mètres par seconde ; deux personnes distantes de 340 mètres ne peuvent donc physiquement pas s’entendre au même instant. Une simultanéité mondiale parfaite n’est pas possible et n’est pas l’objectif. Votre écart par rapport à la moyenne mondiale est la chose la plus intéressante que cette application vous dira sur vous-même.',
      },
    ],
    whoBehindHeading: 'Qui est derrière',
    whoBehindBody:
      'Un petit projet indépendant, ni une entreprise, ni une campagne, ni un mouvement. Il ne vend rien, ne collecte aucun identifiant publicitaire, et n’est affilié à aucun gouvernement, religion ou marque. Si vous souhaitez poser une question directement, écrivez à',
    closingFine:
      'Cette page existe parce qu’une application de compte à rebours inexpliquée qui demande l’accès au microphone et aide à organiser des rassemblements publics ressemble, aux yeux d’un sceptique raisonnable, à autre chose qu’un projet artistique. Ce soupçon est légitime. Voici la réponse.',
  },

  index: {
    title: 'Manourying',
    description:
      'À l’instant de l’équinoxe de septembre, tous ceux qui ont l’application émettent le même son au même moment. Seize secondes, puis c’est terminé.',
    eyebrow: 'Un instant · équinoxe de septembre 2026',
    h1: 'Tout le monde émet le même son au même moment.',
    ledePrefix:
      'Quatre secondes de voyelle ouverte. Puis votre propre prénom. Puis dix secondes de silence. ',
    ledeSuffix:
      ' secondes au total, sur chaque continent à la fois — puis c’est terminé pour six mois.',
    ctaGetApp: 'Obtenir l’application',
    ctaWhatThisIs: 'Ce que c’est vraiment',
    scoreEyebrow: 'La forme que ça prend',
    score: [
      {
        at: '00:00',
        heading: 'Tenir une voyelle ouverte — « ah »',
        detail:
          'Toute hauteur que vous pouvez atteindre confortablement. Si vous pouvez atteindre 110 Hz, faites-le. Quatre secondes. Ne criez pas.',
      },
      {
        at: '00:04',
        heading: 'Dites votre propre prénom. Une fois.',
        detail: 'À voix normale. Quel que soit le prénom auquel vous répondez réellement.',
      },
      {
        at: '00:06',
        heading: 'Puis arrêtez-vous.',
        detail:
          'Dix secondes de silence, où que vous soyez. Cette partie n’est pas facultative — c’est celle pour laquelle les enregistrements existent.',
      },
    ],
    scoreFineBefore:
      'Le texte exact est scellé jusqu’à sept jours avant. Son empreinte SHA-256 est publiée dès maintenant, afin que vous puissiez vérifier ensuite que rien n’a changé.',
    scoreFineLink: 'Voir l’empreinte',
    factsPitchEyebrow: 'La tonalité',
    factsPitchNote: 'Assez basse pour que toute voix puisse l’atteindre. Aucun entraînement, aucune langue.',
    factsInstantEyebrow: 'L’instant',
    factsInstantNote:
      'Fixé par la mécanique orbitale, par personne en particulier. Il signifie la même chose partout.',
    factsNotifEyebrow: 'Notifications',
    factsNotifValue: 'Deux',
    factsNotifNote: 'Le descellement de la directive, et le moment lui-même. C’est tout le budget, volontairement.',
    closingHeading: 'Pourquoi votre synchronisation sera « fausse »',
    closingBody:
      'Le son voyage à 343 mètres par seconde ; deux personnes distantes de 340 mètres ne peuvent donc physiquement pas s’entendre au même instant. Une simultanéité mondiale parfaite n’est pas possible et n’est pas l’objectif. Ensuite, l’application vous indique votre propre écart par rapport à la moyenne mondiale, en millisecondes — la chose la plus intéressante qu’elle vous dira jamais sur vous-même.',
    moreLink: 'Les questions que les gens posent vraiment →',
    countdown: {
      fallback: 'L’équinoxe de septembre.',
      wherePrefix: 'Là où vous êtes, il est',
      whereMidnight: '— en plein milieu de votre nuit.',
      whereEarlyMorning: '— tôt le matin, chez vous.',
      wherePeriod: '.',
      passed: 'Le moment est passé.',
      daysUntil: '{{DAYS}} jours avant le moment.',
    },
  },

  faq: {
    title: 'Manourying — FAQ',
    description:
      'Des réponses directes sur les invitations, le microphone, les données, et si tout cela est une secte.',
    eyebrow: 'Questions',
    h1: 'Ce que les gens demandent vraiment',
    items: [
      {
        q: 'S’agit-il d’une secte, d’une manifestation ou d’une campagne de marque ?',
        a: 'Aucune des trois. On ne demande à personne de croire en quoi que ce soit, de rejoindre quoi que ce soit, de s’opposer à quoi que ce soit ou d’acheter quoi que ce soit. Cela arrive une fois, dure seize secondes, puis s’arrête. Il n’y a aucune organisation à laquelle appartenir ensuite.',
      },
      {
        q: 'Pourquoi l’application veut-elle mon microphone ?',
        a: 'Elle ne le veut pas, sauf si vous activez vous-même l’enregistrement. La version actuelle est livrée avec la capture microphone entièrement désactivée — la permission n’est même pas demandée. Quand elle sera activée, ce sera désactivé par défaut, demandé séparément, limité à six secondes fixes, et le fichier restera sur votre téléphone à moins que vous ne l’écoutiez et choisissiez de le téléverser.',
      },
      {
        q: 'Ai-je besoin d’une invitation ?',
        a: 'Pour réclamer une place, oui. Chaque place porte trois invitations qui ne se renouvellent pas. Si vous êtes arrivé sans code, vous pouvez à la place réserver une place dans la file d’attente, et des places y sont libérées.',
      },
      {
        q: 'Pourquoi seulement trois invitations ?',
        a: 'Une place qui peut inviter tout le monde est une liste de diffusion. Trois suffit pour atteindre les gens à côté desquels vous vous tiendriez réellement, et c’est assez peu pour qu’en dépenser une soit une décision.',
      },
      {
        q: 'Que se passe-t-il si je dors quand cela arrive ?',
        a: 'Pour une grande partie de la planète, cela tombe en pleine nuit, et l’application vous le dit clairement lorsque vous choisissez où vous vous tiendrez. Si vous armez le moment, votre téléphone programme une alarme locale qui se déclenche sans signal et sans réseau. Vous lever ou non vous regarde.',
      },
      {
        q: 'Cela fonctionne-t-il sans internet ?',
        a: 'Le jour même, entièrement. Tout ce qui est nécessaire — la partition, la tonalité de référence, l’horodatage corrigé — est stocké sur l’appareil bien à l’avance. L’application est conçue en partant du principe que nos serveurs seront le moins disponibles précisément quand ils seront le plus demandés.',
      },
      {
        q: 'Pourquoi {{TONE_HZ}} Hz ?',
        a: 'C’est assez bas pour que presque toute voix adulte puisse l’atteindre confortablement, et une seule note ne demande aucun entraînement ni langue commune. Si vous ne pouvez pas l’atteindre, tenez la hauteur qui vous est confortable — c’est écrit dans la directive elle-même.',
      },
      {
        q: 'Quelles données collectez-vous ?',
        a: 'Une place est un jeton opaque, pas un nom, un email ou un numéro de téléphone. Il n’y a aucun compte, aucun identifiant publicitaire, et aucun outil d’analyse tiers. Voir la page confidentialité pour la position complète.',
      },
      {
        q: 'Cela apparaîtra-t-il sur des sismomètres ?',
        a: 'Non, et nous n’affirmerons pas le contraire. Un milliard de voix ne fera pas bouger un sismomètre. Les réseaux sismiques urbains denses enregistrent bien une activité humaine — cela a été bien documenté pendant les confinements de 2020 — et lorsque nous montrons ces données, elles proviennent d’IRIS et de l’EMSC et sont étiquetées honnêtement, y compris lorsqu’elles ne montrent rien.',
      },
      {
        q: 'Qui finance cela ?',
        a: 'Personne, au sens qui compte : il n’y a aucune levée de fonds, aucun sponsor, et rien n’est vendu. Si cela change, ce sera annoncé ici en premier.',
      },
      {
        q: 'Quelque chose ne va pas / j’ai une question à laquelle vous n’avez pas répondu.',
        a: 'Écrivez à {{CONTACT_EMAIL}}. Une vraie personne le lit.',
      },
    ],
  },

  privacy: {
    title: 'Manourying — Confidentialité',
    description:
      'Ce que l’application stocke, ce qu’elle ne collecte jamais, et la position sur l’enregistrement de tiers dans des lieux publics.',
    eyebrow: 'Confidentialité',
    h1: 'Ce que nous détenons, et ce que nous refusons de détenir',
    lede: 'En bref : il n’y a aucun compte, aucun nom, aucun email, aucun identifiant publicitaire, et aucun outil d’analyse tiers. Rien de ce qui est enregistré sur votre téléphone n’en sort, sauf si vous décidez que cela doit être le cas.',
    seatHeading: 'Ce qu’est une place',
    seatBody:
      'Une place est un jeton aléatoire opaque stocké sur votre appareil. Il n’est dérivé ni de votre numéro de téléphone, ni de votre email, ni de l’identifiant de votre appareil, ni de rien d’autre vous concernant, et il ne peut être inversé vers aucun de ces éléments. Deux places ne peuvent pas être reliées à la même personne par nous.',
    storesHeading: 'Ce que l’application stocke sur votre appareil',
    storesItems: [
      'Votre jeton de place, dans le stockage sécurisé du système d’exploitation.',
      'L’écart mesuré entre l’horloge de votre téléphone et l’heure réelle.',
      'Le fuseau UTC dans lequel vous avez dit que vous seriez.',
      'Si vous avez armé le moment, et l’alarme locale programmée.',
    ],
    storesFooter:
      'Tout cela est supprimé lorsque vous désinstallez l’application. Rien de tout cela n’est un identifiant personnel.',
    neverHeading: 'Ce que nous ne collectons jamais',
    neverItems: [
      'Votre nom, votre adresse email ou votre numéro de téléphone.',
      'Votre localisation précise. L’application demande dans quel fuseau UTC vous serez — un choix parmi une liste de vingt-quatre, pas une coordonnée.',
      'Des identifiants publicitaires, du suivi inter-applications, ou des kits d’analyse tiers.',
      'À qui vous avez envoyé une invitation. Envoyer un code ouvre votre propre menu de partage ; l’invitation est dépensée quand quelqu’un la réclame, et la seule chose qui vous revient est un compte.',
    ],
    micHeading: 'Le microphone, énoncé avec précision',
    micIntro:
      'L’enregistrement n’est pas du tout présent dans la version actuelle. La permission n’est pas demandée et le code de capture n’est pas livré. Lorsqu’il sera ajouté, voici les règles auxquelles il devra obéir, et elles sont déjà écrites dans le code comme un contrat que toute implémentation doit respecter :',
    micItems: [
      'Demandé séparément, avec ses propres mots. Armer le moment n’est jamais considéré comme un consentement à enregistrer.',
      'Une fenêtre fixe de six secondes, arrêtée par le code plutôt que par une minuterie dont on ferait confiance à l’interface pour la respecter.',
      'Stocké uniquement sur l’appareil. Il n’existe aucun paramètre de téléversement automatique susceptible d’être mal réglé.',
      'Rien n’est téléversé à moins que vous ne l’ayez réécouté puis choisi de le téléverser.',
    ],
    bystanderHeading: 'Le problème des tiers présents',
    bystanderP1:
      'C’est la partie qui mérite une réponse directe plutôt qu’un paragraphe de langue de bois. Un enregistrement de six secondes fait sur une place publique capture les voix de personnes qui n’ont jamais installé cette application, n’ont jamais accepté quoi que ce soit, et ne peuvent pas être consultées après coup.',
    bystanderP2:
      'Notre position : les enregistrements restent sur l’appareil par défaut, précisément pour que la question ne se pose même pas. Toute archive publique d’audio capturé sera constituée de contributions validées individuellement — une personne décidant, après avoir écouté son propre enregistrement, que celui-ci précisément peut être publié — plutôt que d’une agrégation en masse de tout ce que les microphones ont capté. Si cette norme ne peut être respectée pour un enregistrement donné, il n’entre pas dans l’archive.',
    bystanderP3Before:
      'Si vous pensez qu’un enregistrement publié vous contient et que vous n’y avez pas consenti, écrivez à',
    bystanderP3After: 'et il sera retiré. Vous n’avez à vous justifier ni à prouver quoi que ce soit.',
    siteHeading: 'Ce site web',
    siteBody:
      'Aucun cookie n’est déposé et aucun outil d’analyse ne tourne. Les polices web sont chargées depuis Google Fonts, ce qui signifie que les serveurs de Google voient la requête — si cela vous importe, une extension bloquant les polices ne casse rien ici.',
    rightsHeading: 'Vos droits',
    rightsBefore:
      'En vertu du RGPD, vous pouvez demander ce qui est détenu à votre sujet, en demander la suppression, et vous plaindre auprès de votre autorité de contrôle nationale. Comme une place est un jeton anonyme, dans la plupart des cas la réponse honnête à « que détenez-vous sur moi » est « rien qui vous identifie » — et désinstaller l’application supprime le reste. Pour toute autre demande, écrivez à',
    rightsAfter: '.',
    lastUpdatedPrefix: 'Dernière mise à jour le',
    lastUpdatedSuffix: '. Les changements importants seront datés ici, jamais modifiés en silence.',
    legalReviewNotice:
      'Cette traduction n’a pas fait l’objet d’une relecture juridique. La version anglaise à /privacy fait foi en cas de divergence.',
  },

  press: {
    title: 'Manourying — Presse',
    description:
      'Une description simple du projet, les faits à vérifier, et comment joindre une personne.',
    eyebrow: 'Presse',
    h1: 'Pour quiconque écrit à ce sujet',
    lede: 'Prenez tout ce qui se trouve sur cette page et utilisez-le sans demander. Si quelque chose ici n’est pas clair ou vous semble erroné, dites-le — une correction avant publication vaut plus pour nous qu’un article flatteur.',
    oneParagraphHeading: 'En un paragraphe',
    quoteBefore:
      'Manourying est un projet artistique construit autour d’un instant unique. À l’équinoxe de septembre — le moment où la planète entière partage un jour et une nuit d’égale durée — toute personne possédant l’application émet le même son au même moment : quatre secondes de voyelle ouverte à environ',
    quoteAfter:
      'Hz, puis son propre prénom, puis dix secondes de silence. Seize secondes au total. L’application fonctionne uniquement sur invitation, ne fait presque rien avant le jour J, et envoie exactement deux notifications dans les mois qui précèdent. Puis cela arrive, et c’est terminé pour six mois.',
    factsHeading: 'Faits à vérifier',
    factInstant: 'L’instant',
    factDuration: 'Durée',
    factDurationValue: '16 secondes',
    factPitch: 'Tonalité de référence',
    factCadence: 'Cadence',
    factCadenceValue: 'Deux fois par an, à chaque équinoxe',
    factEntry: 'Entrée',
    factEntryValue: 'Sur invitation uniquement · trois par place · non renouvelable',
    factPlatforms: 'Plateformes',
    factPlatformsValue: 'iOS et Android',
    factCost: 'Coût',
    factCostValue: 'Gratuit · rien à vendre · aucune publicité',
    threeThingsHeading: 'Trois choses que nous ne vous laisserons pas imprimer',
    threeThingsIntro:
      'Non pas parce qu’elles sont peu flatteuses, mais parce qu’elles sont fausses, et nous préférons que vous l’appreniez de nous :',
    thingSeismic: {
      strong: 'Que cela sera enregistré par des sismomètres.',
      rest: 'Ce ne sera pas le cas. Un milliard de voix ne fait pas bouger un sismomètre. Les réseaux sismiques urbains denses montrent bien des signatures d’activité humaine — bien documentées pendant les confinements de 2020 — et c’est une histoire réellement intéressante, mais ce n’est pas la même affirmation.',
    },
    thingSimultaneous: {
      strong: 'Que c’est parfaitement simultané.',
      rest: 'Le son voyage à 343 m/s. Deux personnes distantes de 340 mètres ne peuvent pas s’entendre au même instant ; la physique l’interdit. Le projet traite cela comme la partie intéressante plutôt que de prétendre le contraire.',
    },
    thingCampaign: {
      strong: 'Que c’est une manifestation, une religion ou une campagne de marque.',
      rest: 'On ne demande à personne de croire en quoi que ce soit, de s’opposer à quoi que ce soit, de rejoindre quoi que ce soit, ou d’acheter quoi que ce soit.',
    },
    contactHeading: 'Contact',
    contactBefore: '',
    contactAfter: '— une vraie personne, généralement sous un jour. Pour une vérification urgente, précisez-le dans l’objet.',
    canonicalLabel: 'Explication canonique :',
  },

  install: {
    title: 'Manourying — Installation',
    description: 'Où obtenir l’application, sur Android et iOS.',
    eyebrow: 'Installation',
    h1: 'Obtenir l’application',
    lede: 'Manourying n’est pas encore sur l’App Store ni sur Google Play. Les versions sont distribuées directement, ce qui implique quelques appuis supplémentaires et un avertissement à l’air alarmant de votre téléphone.',
    platformLabel: { android: 'Android', ios: 'iOS' },
    notYet: 'Pas encore',
    installFor: 'Installer pour',
    haveCodeHeading: 'Vous avez déjà un code ?',
    haveCodeBody:
      'Installez d’abord l’application, puis ouvrez-la et saisissez votre code à six caractères au portail. Toucher un lien d’invitation avant que l’application ne soit installée ne fait rien — c’est une limite du lien, pas un problème avec votre code.',
    noCodeHeading: 'Pas de code ?',
    noCodeBody:
      'Installez quand même et réservez une place dans la file d’attente. Chaque place porte trois invitations qui ne se renouvellent pas, et des places sont libérées dans la file au fur et à mesure.',
    brokenBefore: 'Quelque chose est cassé ?',
  },

  directive: {
    title: 'Manourying — La directive scellée',
    description:
      'L’empreinte SHA-256 de la directive scellée, publiée à l’avance afin de pouvoir être vérifiée ensuite.',
    eyebrowSealed: 'Directive 02 · scellée',
    eyebrowOpen: 'Directive 02 · ouverte',
    h1: 'Le sceau',
    lede: 'Le texte exact de la directive est publié sept jours avant l’équinoxe. Son empreinte est publiée dès maintenant, afin qu’ensuite quiconque puisse vérifier que le texte qui lui a été donné est bien celui qui a été scellé — y compris s’il ne nous fait pas confiance.',
    sealEyebrow: 'SHA-256 de la directive scellée',
    copyButton: 'Copier l’empreinte',
    copiedLabel: 'Copié',
    checkHeading: 'Comment vérifier vous-même',
    checkP1Before: 'Lorsque la directive s’ouvre le',
    checkP1After:
      'prenez sa forme canonique — chaque étape sous la forme heure⇥titre⇥détail, une par ligne, jointe par des sauts de ligne, encodée en UTF-8 — et calculez son empreinte :',
    checkP2:
      'Si cela ne produit pas la chaîne ci-dessus, quelque chose a changé entre le scellement et la révélation, et vous devriez le faire savoir haut et fort.',
    knownHeading: 'Ce qui est déjà connu',
    knownBody:
      'La structure n’a jamais été secrète et est écrite sur la page d’accueil : quatre secondes de voyelle ouverte, un prénom prononcé, dix secondes de silence. Ce qui est scellé, c’est le texte précis — quels mots, dans quel ordre, traduits dans toutes les langues à la fois.',
    footerFine:
      'La même empreinte est affichée dans l’application, calculée indépendamment sur votre propre appareil à partir de la copie livrée dans le binaire. Deux calculs, un seul nombre — s’ils diffèrent un jour, ne faites confiance à aucun des deux.',
  },

  gate: {
    title: 'Manourying — Votre invitation',
    description: 'Quelqu’un a dépensé une invitation pour vous. Voici ce que cela signifie et ce qu’il faut en faire.',
    eyebrow: 'Quelqu’un a dépensé une invitation pour vous',
    h1: 'Une place à Manourying',
    codeEyebrow: 'Votre code',
    copyButton: 'Copier le code',
    copiedLabel: 'Copié',
    codeFine: 'Notez-le. Ce lien est le seul endroit où il existe.',
    noCodeLede:
      'Chaque place porte trois invitations, qui ne se renouvellent pas — donc si quelqu’un vous en a envoyé une, il a renoncé à un tiers de ce qu’il avait.',
    invitedHeading: 'À quoi vous avez été invité',
    invitedBody:
      'À un instant fixe — l’équinoxe de septembre — toute personne possédant l’application émet le même son au même moment. Quatre secondes de voyelle ouverte, puis votre propre prénom, puis dix secondes de silence. Seize secondes, puis c’est terminé.',
    invitedLinkBefore: '',
    invitedLink: 'L’explication complète, en langage clair,',
    invitedLinkAfter: 'vaut deux minutes avant d’installer quoi que ce soit.',
    nextHeading: 'Que faire maintenant',
    nextSteps: [
      'Installez l’application.',
      'Ouvrez-la et saisissez votre code au portail.',
      'Choisissez où vous serez réellement, et armez le moment.',
    ],
    ctaGetApp: 'Obtenir l’application',
    footerFine:
      'Si vous avez déjà l’application installée, ce lien aurait dû l’ouvrir directement. Le fait que ce ne soit pas le cas est une limite connue le temps que la vérification des liens d’application soit mise en place — saisissez le code manuellement et cela fonctionnera exactement pareil.',
  },

  notFound: {
    title: 'Manourying — Introuvable',
    description: 'Cette page n’existe pas.',
    eyebrow: '404',
    h1: 'Rien ici.',
    lede: 'La page que vous avez demandée n’existe pas. Ce qui existe assurément :',
    linkWhatThisIs: 'Ce que c’est vraiment',
    linkFaq: 'Les questions posées',
    linkInstall: 'Obtenir l’application',
  },
};
