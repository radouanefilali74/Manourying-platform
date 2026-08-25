/**
 * The single fetch wrapper.
 *
 * No axios, and no TanStack Query. Its real value is cache coherence across
 * many components sharing server state; here each view owns one list and every
 * mutation refetches that one list. Revisit if the panel passes ~15 views or
 * needs cross-view invalidation — but make it a decision, not a default.
 */

/** '' in dev, where the Vite proxy makes everything same-origin. */
const BASE = import.meta.env.VITE_API_ORIGIN ?? '';

export class ApiError extends Error {
  constructor(
    readonly code: string,
    readonly status: number,
    message: string,
    readonly detail?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * The CSRF token lives here — in memory, never in a cookie.
 *
 * That is the whole point: law.manouri.ovh shares the registrable domain, so it
 * is same-site with this API and SameSite=Lax would attach our session cookie
 * for it. A page over there can send the cookie but cannot read this.
 */
let csrfToken = '';
export const setCsrf = (token: string) => {
  csrfToken = token;
};

/** Set by the auth provider so a mid-session expiry bounces once, cleanly. */
let onUnauthorised: () => void = () => {};
export const setUnauthorisedHandler = (fn: () => void) => {
  onUnauthorised = fn;
};

type Options = { method?: string; body?: unknown };

async function request<T>(path: string, options: Options = {}): Promise<T> {
  const method = options.method ?? 'GET';

  const response = await fetch(BASE + path, {
    method,
    // Mandatory: the session cookie is on another origin in production.
    credentials: 'include',
    headers: {
      ...(options.body !== undefined ? { 'content-type': 'application/json' } : {}),
      ...(method === 'GET' ? {} : { 'x-csrf-token': csrfToken }),
    },
    ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
  });

  if (response.status === 401) {
    onUnauthorised();
    throw new ApiError('unauthenticated', 401, 'Your session has ended.');
  }

  if (response.status === 204) return null as T;

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const error = payload?.error;
    throw new ApiError(
      error?.code ?? 'unknown',
      response.status,
      error?.message ?? 'Something went wrong.',
      error?.detail,
    );
  }

  return payload as T;
}

export const api = {
  get: <T,>(path: string) => request<T>(path),
  post: <T,>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
  patch: <T,>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body }),
};
