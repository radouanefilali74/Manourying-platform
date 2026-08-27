/**
 * Header names shared between the CORS allow-list and the routes that read
 * them.
 *
 * Lives here rather than in the route module because app.ts needs the value
 * at boot to configure CORS, and importing it from routes/public/waitlist.ts
 * would drag the whole app-facing route graph — and its database and Redis
 * imports — into the module graph even when PUBLIC_API is off. The dynamic
 * import in app.ts exists precisely to avoid that.
 */

/** Identifies a device on the waitlist, before it has a seat. Only its SHA-256 is stored. */
export const DEVICE_HEADER = 'x-device-key';
