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
};
