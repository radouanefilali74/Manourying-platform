import type { Dictionary } from './dictionary';
import { EXPLAINER, SCORE } from '../content/explainer';

/**
 * The reviewed source text. Every other locale file is an AI-drafted
 * translation OF this file, not an independent source — if English changes,
 * the others are the ones now out of date.
 */
export const en: Dictionary = {
  common: {
    skipToContent: 'Skip to content',
    nav: {
      whatThisIs: 'What this is',
      faq: 'FAQ',
      directive: 'Directive',
      privacy: 'Privacy',
      press: 'Press',
    },
    footerTagline: 'An art project. Not affiliated with any government, religion, or brand.',
    translationNotice: null,
  },

  whatThisIs: {
    title: 'What Manourying actually is',
    description:
      'A plain-language explanation of the project, the equinox, what the app does to your phone, and what we do not claim.',
    eyebrow: 'Plain language',
    h1: 'What this actually is',
    intro:
      'No mystery here on purpose. The only thing that is genuinely secret is the exact wording of the directive, and even that is published seven days before the equinox with its hash available from the start. Everything else is written below.',
    // The parity-mirrored source (see CLAUDE.md's duplicated-values table) —
    // not re-typed here, so it can never drift into a third, undocumented copy.
    sections: EXPLAINER,
    whoBehindHeading: 'Who is behind it',
    whoBehindBody:
      'A small independent project, not a company, a campaign, or a movement. It sells nothing, collects no advertising identifiers, and is not affiliated with any government, religion, or brand. If you want to ask something directly, write to',
    closingFine:
      'This page exists because an unexplained countdown app that asks for microphone access and helps organise public gatherings looks, to a reasonable sceptic, like something other than an art project. That suspicion is fair. This is the answer to it.',
  },

  index: {
    title: 'Manourying',
    description:
      'At the instant of the September equinox, everyone holding the app makes the same sound at the same time. Sixteen seconds, then it is over.',
    eyebrow: 'One instant · September equinox 2026',
    h1: 'Everyone makes the same sound at the same time.',
    ledePrefix: 'Four seconds of an open vowel. Then your own name. Then ten seconds of silence. ',
    ledeSuffix: ' seconds in total, on every continent at once — and then it is over for six months.',
    ctaGetApp: 'Get the app',
    ctaWhatThisIs: 'What this actually is',
    scoreEyebrow: 'The shape of it',
    score: SCORE,
    scoreFineBefore:
      'The exact wording is sealed until seven days before. Its SHA-256 is published now, so you can check afterwards that nothing changed.',
    scoreFineLink: 'See the hash',
    factsPitchEyebrow: 'The pitch',
    factsPitchNote: 'Low enough that any voice can reach it. No training, no language.',
    factsInstantEyebrow: 'The instant',
    factsInstantNote: 'Fixed by orbital mechanics, not by anybody. It means the same thing everywhere.',
    factsNotifEyebrow: 'Notifications',
    factsNotifValue: 'Two',
    factsNotifNote: 'The directive unseal, and the moment. That is the entire budget, on purpose.',
    closingHeading: 'Why your timing will be “wrong”',
    closingBody:
      'Sound travels 343 metres per second, so two people 340 metres apart physically cannot hear each other at the same instant. Perfect global simultaneity is not possible and is not the goal. Afterwards the app tells you your own deviation from the global mean, in milliseconds — which is the most interesting thing it will ever tell you about yourself.',
    moreLink: 'Questions people actually ask →',
    countdown: {
      fallback: 'The September equinox.',
      wherePrefix: 'Where you are, that is',
      whereMidnight: '— the middle of your night.',
      whereEarlyMorning: '— early morning where you are.',
      wherePeriod: '.',
      passed: 'The moment has passed.',
      daysUntil: '{{DAYS}} days until the moment.',
    },
  },

  faq: {
    title: 'Manourying — FAQ',
    description:
      'Straight answers about the invites, the microphone, the data, and whether this is a cult.',
    eyebrow: 'Questions',
    h1: 'Things people actually ask',
    items: [
      {
        q: 'Is this a cult, a protest, or a brand campaign?',
        a: 'None of the three. Nobody is asked to believe anything, join anything, oppose anything, or buy anything. It happens once, lasts sixteen seconds, and then stops. There is no organisation to belong to afterwards.',
      },
      {
        q: 'Why does the app want my microphone?',
        a: 'It does not, unless you turn recording on yourself. The current build ships with microphone capture disabled entirely — the permission is not even requested. When it does ship, it will be off by default, asked for separately, capture a fixed six seconds, and keep the file on your phone unless you listen back and choose to upload it.',
      },
      {
        q: 'Do I need an invite?',
        a: 'To claim a seat, yes. Every seat carries three invites and they do not replenish. If you arrived without a code you can hold a place in the queue instead, and seats are released into it.',
      },
      {
        q: 'Why only three invites?',
        a: 'A seat that can invite everyone is a mailing list. Three is enough to reach the people you would actually stand next to, and few enough that spending one is a decision.',
      },
      {
        q: 'What happens if I am asleep when it happens?',
        a: 'For a large part of the planet it lands in the middle of the night, and the app tells you that plainly when you pick where you will be standing. If you arm the moment, your phone schedules a local alarm that fires with no signal and no network. Whether you get up is your business.',
      },
      {
        q: 'Does it work without internet?',
        a: 'On the day, entirely. Everything needed — the score, the reference tone, the corrected timestamp — is stored on the device well beforehand. The app is built on the assumption that our servers will be least available exactly when they are most wanted.',
      },
      {
        q: 'Why {{TONE_HZ}} Hz?',
        a: 'It is low enough that almost any adult voice can reach it comfortably, and one note requires no training and no shared language. If you cannot match it, hold whatever pitch is comfortable — that is written into the directive itself.',
      },
      {
        q: 'What data do you collect?',
        a: 'A seat is an opaque token, not a name, an email, or a phone number. There is no account, no advertising identifier, and no third-party analytics. See the privacy page for the full position.',
      },
      {
        q: 'Will this show up on seismometers?',
        a: 'No, and we will not claim it does. A billion voices will not move a seismometer. Dense urban seismic networks do register human activity — that was well documented during the 2020 lockdowns — and where we show that data it comes from IRIS and EMSC and is labelled honestly, including when it shows nothing.',
      },
      {
        q: 'Who pays for this?',
        a: 'Nobody, in the sense that matters: there is no funding round, no sponsor, and nothing sold. If that changes it will be said here first.',
      },
      {
        q: 'Something is wrong / I have a question you have not answered.',
        a: 'Write to {{CONTACT_EMAIL}}. A real person reads it.',
      },
    ],
  },

  privacy: {
    title: 'Manourying — Privacy',
    description:
      'What the app stores, what it never collects, and the position on recording bystanders in public places.',
    eyebrow: 'Privacy',
    h1: 'What we hold, and what we refuse to',
    lede: 'Short version: there is no account, no name, no email, no advertising identifier, and no third-party analytics. Nothing recorded on your phone leaves it unless you decide it should.',
    seatHeading: 'What a seat is',
    seatBody:
      'A seat is an opaque random token stored on your device. It is not derived from your phone number, your email, your device identifier, or anything else about you, and it cannot be reversed into any of those. Two seats cannot be linked to the same person by us.',
    storesHeading: 'What the app stores on your device',
    storesItems: [
      'Your seat token, in the operating system’s secure storage.',
      'The measured offset between your phone’s clock and real time.',
      'Which UTC zone you said you would be standing in.',
      'Whether you have armed the moment, and the scheduled local alarm.',
    ],
    storesFooter: 'All of it is removed when you uninstall the app. None of it is a personal identifier.',
    neverHeading: 'What we never collect',
    neverItems: [
      'Your name, email address, or phone number.',
      'Your precise location. The app asks which UTC zone you will be in — a choice you make from a list of twenty-four, not a coordinate.',
      'Advertising identifiers, cross-app tracking, or third-party analytics SDKs.',
      'Who you sent an invite to. Sending a code opens your own share sheet; the invite is spent when somebody claims it, and the only thing that returns to you is a count.',
    ],
    micHeading: 'The microphone, stated carefully',
    micIntro:
      'Recording is not in the current build at all. The permission is not requested and the capture code is not shipped. When it is added, these are the rules it will be built to, and they are already written into the codebase as the contract any implementation has to satisfy:',
    micItems: [
      'Asked for separately, in its own words. Arming the moment is never treated as consent to record.',
      'A fixed six-second window, stopped in code rather than by a timer the interface is trusted to honour.',
      'Stored on the device only. There is no automatic-upload setting to get wrong.',
      'Nothing is uploaded unless you have listened back to it and then chosen to upload it.',
    ],
    bystanderHeading: 'The bystander problem',
    bystanderP1:
      'This is the part that deserves a straight answer rather than a paragraph of boilerplate. A six-second recording made in a public square captures the voices of people who never installed this app, never agreed to anything, and cannot be asked afterwards.',
    bystanderP2:
      'Our position: recordings stay on the device by default, precisely because that keeps the question from arising at all. Any public archive of captured audio will be made of individually cleared submissions — a person deciding, after hearing their own recording, that this specific one may be published — rather than bulk aggregation of whatever the microphones picked up. If that standard cannot be met for a given recording, it does not go in the archive.',
    bystanderP3Before: 'If you believe a published recording contains you and you did not agree to it, write to',
    bystanderP3After: 'and it will be removed. You do not have to explain yourself or prove anything.',
    siteHeading: 'This website',
    siteBody:
      'No cookies are set and no analytics run. Web fonts are loaded from Google Fonts, which means Google’s servers see the request — if that matters to you, a font-blocking extension breaks nothing here.',
    rightsHeading: 'Your rights',
    rightsBefore:
      'Under the GDPR you may ask what is held about you, ask for it to be deleted, and complain to your national supervisory authority. Because a seat is an anonymous token, in most cases the honest answer to “what do you hold about me” is “nothing that identifies you” — and deleting the app deletes the rest. For anything else, write to',
    rightsAfter: '.',
    lastUpdatedPrefix: 'Last updated',
    lastUpdatedSuffix: '. Material changes will be dated here, not quietly edited.',
    legalReviewNotice: null,
  },

  press: {
    title: 'Manourying — Press',
    description:
      'A plain description of the project, the facts worth checking, and how to reach a person.',
    eyebrow: 'Press',
    h1: 'For anyone writing about this',
    lede: 'Take anything on this page and use it without asking. If something here is unclear or you think it is wrong, say so — a correction before publication is worth more to us than a flattering piece.',
    oneParagraphHeading: 'One paragraph',
    quoteBefore:
      'Manourying is an art project built around a single instant. At the September equinox — the moment the whole planet shares equal day and night — everybody holding the app makes the same sound at the same time: four seconds of an open vowel at about',
    quoteAfter:
      'Hz, then their own name, then ten seconds of silence. Sixteen seconds in total. The app is invite-only, does almost nothing until the day, and sends exactly two notifications in the months beforehand. Then it happens, and it is over for six months.',
    factsHeading: 'Facts worth checking',
    factInstant: 'The instant',
    factDuration: 'Duration',
    factDurationValue: '16 seconds',
    factPitch: 'Reference pitch',
    factCadence: 'Cadence',
    factCadenceValue: 'Twice a year, at each equinox',
    factEntry: 'Entry',
    factEntryValue: 'Invite-only · three per seat · non-replenishing',
    factPlatforms: 'Platforms',
    factPlatformsValue: 'iOS and Android',
    factCost: 'Cost',
    factCostValue: 'Free · nothing sold · no advertising',
    threeThingsHeading: 'Three things we will not let you print',
    threeThingsIntro:
      'Not because they are unflattering, but because they are false, and we would rather you heard it from us:',
    thingSeismic: {
      strong: 'That it will register on seismometers.',
      rest: 'It will not. A billion voices do not move a seismometer. Dense urban seismic networks do show human-activity signatures — well documented during the 2020 lockdowns — and that is a genuinely interesting story, but it is not the same claim.',
    },
    thingSimultaneous: {
      strong: 'That it is perfectly simultaneous.',
      rest: 'Sound travels 343 m/s. Two people 340 metres apart cannot hear each other at the same instant; physics forbids it. The project treats that as the interesting part rather than pretending otherwise.',
    },
    thingCampaign: {
      strong: 'That it is a protest, a religion, or a brand campaign.',
      rest: 'Nobody is asked to believe anything, oppose anything, join anything, or buy anything.',
    },
    contactHeading: 'Contact',
    contactBefore: '',
    contactAfter: '— a real person, usually within a day. For fact-checking on a deadline, say so in the subject line.',
    canonicalLabel: 'Canonical explainer:',
  },

  install: {
    title: 'Manourying — Install',
    description: 'Where to get the app, on Android and iOS.',
    eyebrow: 'Install',
    h1: 'Getting the app',
    lede: 'Manourying is not on the App Store or Google Play yet. Builds are distributed directly, which means a couple of extra taps and one alarming-looking warning from your phone.',
    platformLabel: { android: 'Android', ios: 'iOS' },
    notYet: 'Not yet',
    installFor: 'Install for',
    haveCodeHeading: 'Already have a code?',
    haveCodeBody:
      'Install the app first, then open it and type your six-character code into the gate. Tapping an invite link before the app is installed does nothing — that is a limitation of the link, not a problem with your code.',
    noCodeHeading: 'No code?',
    noCodeBody:
      'Install anyway and hold a place in the queue. Every seat carries three invites that do not replenish, and seats are released into the queue as they free up.',
    brokenBefore: 'Something broken?',
  },

  directive: {
    title: 'Manourying — The sealed directive',
    description:
      'The SHA-256 hash of the sealed directive, published in advance so it can be verified afterwards.',
    eyebrowSealed: 'Directive 02 · sealed',
    eyebrowOpen: 'Directive 02 · open',
    h1: 'The seal',
    lede: 'The exact wording of the directive is published seven days before the equinox. Its hash is published now, so that afterwards anybody can check that the text they were given is the text that was sealed — including if they do not trust us.',
    sealEyebrow: 'SHA-256 of the sealed directive',
    copyButton: 'Copy hash',
    copiedLabel: 'Copied',
    checkHeading: 'How to check it yourself',
    checkP1Before: 'When the directive opens on',
    checkP1After:
      'take its canonical form — each step as time⇥heading⇥detail, one per line, joined by newlines, encoded UTF-8 — and hash it:',
    checkP2: 'If that does not produce the string above, something changed between the seal and the reveal, and you should say so loudly.',
    knownHeading: 'What is already known',
    knownBody:
      'The structure was never secret and is written on the front page: four seconds of an open vowel, one spoken name, ten seconds of silence. What is sealed is the precise wording — which words, in which order, translated into every language at once.',
    footerFine:
      'The same hash is displayed inside the app, computed independently on your own device from the copy shipped in the binary. Two computations, one number — if they ever disagree, trust neither.',
  },

  gate: {
    title: 'Manourying — Your invite',
    description: 'Somebody spent an invite on you. Here is what that means and what to do with it.',
    eyebrow: 'Somebody spent an invite on you',
    h1: 'A seat at Manourying',
    codeEyebrow: 'Your code',
    copyButton: 'Copy code',
    copiedLabel: 'Copied',
    codeFine: 'Write it down. This link is the only place it exists.',
    noCodeLede:
      'Every seat carries three invites, and they do not replenish — so if somebody sent you one, they gave up a third of what they had.',
    invitedHeading: 'What you have been invited to',
    invitedBody:
      'At one fixed instant — the September equinox — everybody holding the app makes the same sound at the same time. Four seconds of an open vowel, then your own name, then ten seconds of silence. Sixteen seconds, and then it is over.',
    invitedLinkBefore: '',
    invitedLink: 'The full, plain-language explanation',
    invitedLinkAfter: 'is worth two minutes before you install anything.',
    nextHeading: 'What to do now',
    nextSteps: [
      'Install the app.',
      'Open it and enter your code at the gate.',
      'Pick where you will actually be standing, and arm the moment.',
    ],
    ctaGetApp: 'Get the app',
    footerFine:
      'If you already have the app installed, this link should have opened it directly. That it did not is a known limitation while app-link verification is being set up — enter the code by hand and it will work exactly the same.',
  },

  notFound: {
    title: 'Manourying — Not found',
    description: 'That page does not exist.',
    eyebrow: '404',
    h1: 'Nothing here.',
    lede: 'The page you asked for does not exist. The things that definitely do:',
    linkWhatThisIs: 'What this actually is',
    linkFaq: 'Questions people ask',
    linkInstall: 'Getting the app',
  },
};
