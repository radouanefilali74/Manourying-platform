import type { Dictionary } from './dictionary';
import { EXPLAINER } from '../content/explainer';

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
};
