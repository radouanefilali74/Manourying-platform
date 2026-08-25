import type { ReactNode } from 'react';
import type { ApiError } from '../api.ts';

export function Head({ title, note, children }: { title: string; note?: string; children?: ReactNode }) {
  return (
    <div className="admin-head">
      <div>
        <h1 className="serif" style={{ fontSize: '1.6rem' }}>{title}</h1>
        {note ? <p className="fine">{note}</p> : null}
      </div>
      <div>{children}</div>
    </div>
  );
}

export function Problem({ error }: { error: ApiError | null }) {
  if (!error) return null;
  return (
    <p className="notice" data-tone="warn" role="alert" style={{ marginBottom: '1rem' }}>
      {error.message}
    </p>
  );
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="empty">
      <p className="serif" style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{title}</p>
      {children}
    </div>
  );
}

export function Badge({ tone, children }: { tone?: 'live' | 'warn' | 'accent'; children: ReactNode }) {
  return <span className="badge" {...(tone ? { 'data-tone': tone } : {})}>{children}</span>;
}

/** ISO timestamps, shortened to what an operator actually reads. */
export const when = (value: string | null | undefined) =>
  value ? new Date(value).toISOString().replace('T', ' ').slice(0, 16) : '—';
