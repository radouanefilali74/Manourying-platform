/**
 * Where the current builds live.
 *
 * This is the file that changes most often, and it exists so that the *app*
 * never has to. The app's `INSTALL_URL` points at `/install` on this site,
 * which is a URL we control and which never expires; when a new build is cut,
 * only this file is edited and redeployed. Previously the app hardcoded a link
 * to one specific EAS build, which meant every invite sent before that build
 * expired would eventually point at nothing.
 *
 * EAS internal-distribution artifacts are pruned after a retention window. When
 * `eas build --profile preview --platform android` finishes it prints the build
 * page URL — paste it here and redeploy.
 */

export type Build = {
  platform: 'android' | 'ios';
  /** The public EAS build page — install page, no Expo account required. */
  url: string;
  /** Shown so people can tell whether they already have this one. */
  version: string;
  /** ISO date the build was cut. */
  built: string;
  available: boolean;
  note?: string;
};

export const BUILDS: Build[] = [
  {
    platform: 'android',
    url: 'https://expo.dev/accounts/radouane1/projects/manourying/builds/4a380870-e06f-4f19-ad55-a3582a2d0da7',
    version: '1.0.0',
    built: '2026-08-23',
    available: true,
    note: 'Development build. Android will warn about installing outside the Play Store — that is expected for a build distributed this way.',
  },
  {
    platform: 'ios',
    url: '',
    version: '1.0.0',
    built: '',
    available: false,
    note: 'Not yet available. iOS builds require an Apple Developer account; the app itself is complete and platform-neutral.',
  },
];
