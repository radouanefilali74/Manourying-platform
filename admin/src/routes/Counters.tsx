import { api } from '../api.ts';
import { useMutation, useResource } from '../lib/resource.ts';
import { Head, Problem, when } from '../components/Bits.tsx';

type Counter = {
  key: string; value: number; cached: number | null; floor: number;
  refreshedAt: string | null; source: string; drift: number;
};

export function Counters() {
  const counters = useResource(() => api.get<{ counters: Counter[] }>('/admin/counters'));
  const refresh = useMutation((key: string) => api.post(`/admin/counters/${key}/refresh`));
  const snapshot = useMutation(() => api.post('/admin/counters/snapshot'));

  return (
    <main className="admin-main">
      <Head
        title="Counters"
        note="Redis is the fast path; Postgres is the floor. The floor only ever rises."
      >
        <button
          type="button"
          disabled={snapshot.busy}
          onClick={async () => { await snapshot.run(); counters.reload(); }}
        >
          {snapshot.busy ? 'Snapshotting…' : 'Snapshot'}
        </button>
      </Head>

      <Problem error={counters.error ?? refresh.error ?? snapshot.error} />

      <p className="notice" style={{ marginBottom: '1.5rem' }}>
        <strong>Drift</strong> is the cached figure minus the durable floor — how far the fast path
        has moved since the last snapshot. <strong>Recount</strong> runs the slow query this cache
        exists to avoid, and it can never lower a published number: if the true count comes back
        smaller, the figure holds and the difference is shown instead.
      </p>

      <div className="table-scroll">
        <table className="dense">
          <thead>
            <tr>
              <th>Counter</th><th>Published</th><th>Cached</th><th>Floor</th>
              <th>Drift</th><th>Source</th><th>Refreshed</th><th />
            </tr>
          </thead>
          <tbody>
            {(counters.data?.counters ?? []).map((counter) => (
              <tr key={counter.key}>
                <td className="code">{counter.key}</td>
                <td className="num">{counter.value.toLocaleString()}</td>
                <td className="num">{counter.cached?.toLocaleString() ?? '—'}</td>
                <td className="num">{counter.floor.toLocaleString()}</td>
                <td className="num">{counter.drift === 0 ? '—' : counter.drift.toLocaleString()}</td>
                <td>{counter.source}</td>
                <td className="mono">{when(counter.refreshedAt)}</td>
                <td>
                  <button
                    type="button"
                    disabled={refresh.busy}
                    onClick={async () => { await refresh.run(counter.key); counters.reload(); }}
                  >
                    Recount
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {counters.loading ? <p className="fine" style={{ marginTop: '1rem' }}>Loading…</p> : null}
    </main>
  );
}
