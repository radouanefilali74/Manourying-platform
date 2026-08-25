import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

/**
 * The router.
 *
 * BrowserRouter rather than HashRouter, backed by `try_files $uri /index.html`
 * in the admin vhost — deliberately unlike the public site's
 * `try_files $uri $uri.html`, which exists because Astro builds with
 * `build.format: 'file'`.
 *
 * The views land here one at a time, in the order the plan sequences them:
 * counters, seats & invites, waitlist, cells, echo, directive.
 */
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Placeholder />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function Placeholder() {
  return (
    <main className="admin-main">
      <p className="eyebrow">Manourying · admin</p>
      <h1 className="serif">Nothing wired up yet</h1>
      <p className="lede">
        The panel scaffold is in place. Auth lands next, then the views.
      </p>
    </main>
  );
}
