/**
 * One error shape, everywhere.
 *
 *   { "error": { "code": "invite_spent",
 *                "message": "That code has already been used.",
 *                "requestId": "req-4f" } }
 *
 * `message` is the string a client may show a human verbatim. For the claim
 * path in particular it is curated to match the app's own voice — the mock
 * throws `SeatError` with copy the Gate displays as-is, and a server that
 * replaces that with "Bad Request" makes the app worse.
 *
 * `code` is what a client branches on. It never changes for a given condition.
 */
export class AppError extends Error {
  readonly code: string;
  readonly status: number;
  readonly detail: Record<string, unknown> | undefined;

  constructor(
    code: string,
    status: number,
    message: string,
    detail?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.detail = detail;
  }
}

export const badRequest = (message: string, detail?: Record<string, unknown>) =>
  new AppError('invalid_request', 400, message, detail);

export const unauthenticated = () =>
  new AppError('unauthenticated', 401, 'Sign in to continue.');

export const forbidden = (code: string, message: string) => new AppError(code, 403, message);

export const notFound = (message = 'Not found.') => new AppError('not_found', 404, message);

export const conflict = (code: string, message: string, detail?: Record<string, unknown>) =>
  new AppError(code, 409, message, detail);

export const tooMany = (message: string, retryAfterSeconds: number) =>
  new AppError('too_many_attempts', 429, message, { retryAfterSeconds });
