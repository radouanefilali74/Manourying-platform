import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, RequireAdmin } from './auth.tsx';
import { Layout } from './components/Layout.tsx';
import { Login } from './routes/Login.tsx';
import { Overview } from './routes/Overview.tsx';
import { Counters } from './routes/Counters.tsx';
import { Seats } from './routes/Seats.tsx';
import { Placeholder } from './routes/Placeholder.tsx';

/**
 * BrowserRouter, backed by `try_files $uri /index.html` in the admin vhost —
 * deliberately unlike the public site's `try_files $uri $uri.html`, which exists
 * because Astro builds with `build.format: 'file'`.
 */
export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<RequireAdmin><Layout /></RequireAdmin>}>
            <Route index element={<Overview />} />
            <Route path="seats" element={<Seats />} />
            <Route path="counters" element={<Counters />} />
            <Route
              path="waitlist"
              element={<Placeholder
                title="Waitlist"
                note="The queue, and releasing seats into it."
                body="Releasing a seat mints an invite rather than creating a seat — the person still claims it through the same gate as everybody else, so the ledger stays the only thing that decides." />}
            />
            <Route
              path="cells"
              element={<Placeholder
                title="Cells"
                note="Moderation. Anyone can open a cell and nobody staffs them."
                body="Hidden is reversible and keeps its reports; removed is terminal and the database refuses to walk it back. Sorted by report count, because this is about safety and abuse, not curation." />}
            />
            <Route
              path="echo"
              element={<Placeholder
                title="Echo curation"
                note="Individually cleared, individually consented."
                body="This queue stays empty until audio capture ships. It exists now because a public archive of ambient audio recorded in public squares needs per-submission clearance under GDPR — the database refuses to publish anything uncleared or unconsented." />}
            />
            <Route
              path="directive"
              element={<Placeholder
                title="Directive"
                note="Draft, seal, publish the hash, unseal at T−7d."
                body="The database is a drafting surface and a ledger, never the source of truth: the hash participants verify is computed on their own device from a binary that shipped weeks earlier. Sealing writes the steps into both repos by codegen, and publishing refuses unless all three agree." />}
            />
            <Route
              path="audit"
              element={<Placeholder
                title="Audit"
                note="Every mutating action, append-only."
                body="The API's database role has INSERT and SELECT on this table and nothing else, so the running process cannot rewrite its own history." />}
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
