/**
 * Who is signed in, and the guard that keeps everything else behind it.
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { api, setCsrf, setUnauthorisedHandler } from './api.ts';

export type Admin = {
  id: number;
  email: string;
  displayName: string;
  role: 'owner' | 'operator' | 'reviewer';
};

type State = { status: 'loading' | 'in' | 'out'; admin: Admin | null };

type AuthValue = State & {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ status: 'loading', admin: null });

  useEffect(() => {
    // A full page reload keeps the cookie but loses the in-memory CSRF token,
    // so this call is how the panel gets a usable one back.
    setUnauthorisedHandler(() => setState({ status: 'out', admin: null }));

    api
      .get<{ admin: Admin; csrfToken: string }>('/admin/auth/me')
      .then(({ admin, csrfToken }) => {
        setCsrf(csrfToken);
        setState({ status: 'in', admin });
      })
      .catch(() => setState({ status: 'out', admin: null }));
  }, []);

  const signIn = async (email: string, password: string) => {
    const { admin, csrfToken } = await api.post<{ admin: Admin; csrfToken: string }>(
      '/admin/auth/login',
      { email, password },
    );
    setCsrf(csrfToken);
    setState({ status: 'in', admin });
  };

  const signOut = async () => {
    await api.post('/admin/auth/logout').catch(() => {});
    setCsrf('');
    setState({ status: 'out', admin: null });
  };

  return <AuthContext.Provider value={{ ...state, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside an AuthProvider');
  return value;
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const location = useLocation();

  // Render nothing while the boot call is in flight rather than flashing a
  // spinner — it resolves in tens of milliseconds on a local network, and a
  // spinner that appears and vanishes reads as a glitch.
  if (status === 'loading') return null;
  if (status === 'out') return <Navigate to="/login" replace state={{ from: location }} />;
  return <>{children}</>;
}
