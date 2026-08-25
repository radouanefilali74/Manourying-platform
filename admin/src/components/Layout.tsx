import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth.tsx';

const LINKS = [
  { to: '/', label: 'Overview', end: true },
  { to: '/seats', label: 'Seats & invites' },
  { to: '/waitlist', label: 'Waitlist' },
  { to: '/cells', label: 'Cells' },
  { to: '/echo', label: 'Echo' },
  { to: '/directive', label: 'Directive' },
  { to: '/counters', label: 'Counters' },
  { to: '/audit', label: 'Audit' },
];

export function Layout() {
  const { admin, signOut } = useAuth();

  return (
    <div className="admin-shell">
      <nav className="admin-nav">
        <p className="eyebrow" style={{ padding: '0 1.25rem 0.75rem' }}>
          Manourying
        </p>
        {LINKS.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end}>
            {link.label}
          </NavLink>
        ))}
        <div style={{ marginTop: 'auto', padding: '1.25rem' }}>
          <p className="fine" style={{ marginBottom: '0.5rem' }}>
            {admin?.displayName} · {admin?.role}
          </p>
          <button type="button" onClick={() => void signOut()}>
            Sign out
          </button>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
