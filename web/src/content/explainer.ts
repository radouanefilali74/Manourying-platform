/**
 * "What this actually is."
 *
 * Ported verbatim from the mobile app's `app/about.tsx` `SECTIONS` array. The
 * app and the site must not drift into saying different things about what this
 * project does — if one changes, change both in the same commit.
 *
 * The spec is unambiguous about why this page exists: an unexplained countdown
 * app that requests the microphone and organises coordinated public gatherings
 * reads, to a suspicious observer, as something other than an art project. The
 * mystery belongs in the directive — nobody knows what the sound is, and that
 * is enough mystery. Opacity about the organisation buys nothing.
 */

export type Section = { heading: string; body: string };

export const EXPLAINER: Section[] = [
  {
    heading: 'What happens',
    body: 'At one fixed instant — the September equinox — everyone holding this app makes the same sound at the same time. Four seconds of an open vowel, then their own name, then ten seconds of silence. Sixteen seconds in total. Then it is over.',
  },
  {
    heading: 'Why the equinox',
    body: 'Because nobody chose it. The equinox is fixed by orbital mechanics, happens twice a year, and belongs to no religion, nation, or calendar. It is the one instant the whole planet shares equal day and night, and it means the same thing in every language.',
  },
  {
    heading: 'What is sealed, and what is not',
    body: 'The exact wording of the directive is published seven days before the equinox, in every language at once. Nothing else is hidden. The SHA-256 hash of the sealed text is published now, so afterwards you can verify that what you were given is what was sealed. The structure — tone, name, silence — is written on this page and is not a surprise.',
  },
  {
    heading: 'What this app does to your phone',
    body: 'When you arm the moment, it schedules one local alarm on your device with the corrected timestamp baked in. That alarm fires with no signal, no server, and no push notification. Between arming and the equinox this app sends exactly two notifications: the directive unseal, and the moment itself. That is the entire notification budget, on purpose.',
  },
  {
    heading: 'The microphone',
    body: 'Recording is optional, off by default, and asked for separately. If you turn it on, the recorder captures a fixed six seconds and stops itself in code. The file stays on your phone. It is never uploaded unless you listen to it and then choose to upload it. There is no automatic-upload setting.',
  },
  {
    heading: 'What we do not claim',
    body: 'A billion voices will not move a seismometer, and we do not say otherwise. The waveforms in this app are texture, not measurements. Where we show real seismic data, it comes from IRIS and EMSC and is labelled as such — including when it shows nothing at all.',
  },
  {
    heading: 'Why your timing will be "wrong"',
    body: 'Sound travels 343 metres per second, so two people 340 metres apart physically cannot hear each other at the same instant. Perfect global simultaneity is not possible and is not the goal. Your deviation from the global mean is the most interesting thing this app will tell you about yourself.',
  },
];

/** The score itself. Mirrors `DIRECTIVE_STEPS` in the app's `src/domain/directive.ts`. */
export const SCORE = [
  {
    at: '00:00',
    heading: 'Hold one open vowel — "ah"',
    detail:
      'Any pitch you can reach comfortably. If you can match 110 Hz, match it. Four seconds. Do not shout.',
  },
  {
    at: '00:04',
    heading: 'Say your own name. Once.',
    detail: 'Speaking volume. Whatever name you actually answer to.',
  },
  {
    at: '00:06',
    heading: 'Then stop.',
    detail:
      'Ten seconds of silence, wherever you are. This part is not optional — it is the part the recordings are for.',
  },
];
