import { useState, type FormEvent } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth.tsx';
import { ApiError } from '../api.ts';

export function Login() {
  const { status, signIn } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (status === 'in') {
    const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/';
    return <Navigate to={from} replace />;
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn(email, password);
    } catch (cause) {
      // The server returns one indistinguishable message for wrong password,
      // unknown address and disabled account. Show it as-is; guessing which of
      // the three it was, in the UI, would undo that on purpose.
      setError(cause instanceof ApiError ? cause.message : 'Could not sign in.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-main" style={{ maxWidth: '26rem', margin: '0 auto', paddingTop: '18vh' }}>
      <p className="eyebrow">Manourying</p>
      <h1 className="serif" style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Admin</h1>

      <form onSubmit={submit}>
        <label className="field">
          <span>Email</span>
          <input
            type="email" autoComplete="username" required autoFocus
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            type="password" autoComplete="current-password" required
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error ? (
          <p className="notice" data-tone="warn" role="alert" style={{ marginBottom: '1rem' }}>{error}</p>
        ) : null}

        <button type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>

      <p className="fine" style={{ marginTop: '2rem' }}>
        Accounts are created on the server. There is no sign-up.
      </p>
    </main>
  );
}
