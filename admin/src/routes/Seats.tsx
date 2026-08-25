import { useState } from 'react';
import { api } from '../api.ts';
import { useMutation, useResource } from '../lib/resource.ts';
import { Badge, Empty, Head, Problem, when } from '../components/Bits.tsx';

type Seat = {
  id: number; token: string; origin: string; zone_offset: number | null;
  claimed_at: string; revoked_at: string | null; parent_seat_id: number | null;
  lineage: string; invites_left: string;
};

type Batch = {
  id: number; label: string; count: number; expires_at: string | null;
  created_at: string; claimed: string; revoked: string;
};

export function Seats() {
  const seats = useResource(() => api.get<{ seats: Seat[] }>('/admin/seats?limit=50'));
  const batches = useResource(() => api.get<{ batches: Batch[] }>('/admin/invites/batches'));

  const [label, setLabel] = useState('');
  const [count, setCount] = useState(10);
  const [minted, setMinted] = useState<string[] | null>(null);

  const mint = useMutation((body: { label: string; count: number }) =>
    api.post<{ batchId: number; codes: string[] }>('/admin/invites/batches', body),
  );

  return (
    <main className="admin-main">
      <Head title="Seats & invites" note="Codes are minted here. Nothing derives them on a device." />
      <Problem error={seats.error ?? batches.error ?? mint.error} />

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 className="eyebrow" style={{ marginBottom: '0.75rem' }}>Mint a batch</h2>
        <form
          style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}
          onSubmit={async (event) => {
            event.preventDefault();
            const result = await mint.run({ label, count });
            if (result) {
              setMinted(result.codes);
              setLabel('');
              batches.reload();
            }
          }}
        >
          <label className="field" style={{ marginBottom: 0 }}>
            <span>Label</span>
            <input type="text" required value={label} onChange={(e) => setLabel(e.target.value)} />
          </label>
          <label className="field" style={{ marginBottom: 0, maxWidth: '8rem' }}>
            <span>How many</span>
            <input
              type="number" min={1} max={5000} required
              value={count} onChange={(e) => setCount(Number(e.target.value))}
            />
          </label>
          <button type="submit" disabled={mint.busy}>{mint.busy ? 'Minting…' : 'Mint'}</button>
        </form>

        {minted ? (
          <div className="notice" data-tone="live" style={{ marginTop: '1rem', maxWidth: 'none' }}>
            <p style={{ marginBottom: '0.75rem' }}>
              <strong>{minted.length} codes.</strong> This is the only time they appear in a list
              this convenient — they are not written to the audit log, on purpose.
            </p>
            <textarea readOnly rows={Math.min(minted.length, 10)} value={minted.join('\n')} />
            <p style={{ marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => void navigator.clipboard?.writeText(minted.join('\n'))}
              >
                Copy all
              </button>{' '}
              <button type="button" onClick={() => setMinted(null)}>Dismiss</button>
            </p>
          </div>
        ) : null}
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 className="eyebrow" style={{ marginBottom: '0.75rem' }}>Batches</h2>
        {batches.data?.batches.length ? (
          <div className="table-scroll">
            <table className="dense">
              <thead>
                <tr><th>Label</th><th>Minted</th><th>Claimed</th><th>Revoked</th><th>Expires</th><th>Created</th></tr>
              </thead>
              <tbody>
                {batches.data.batches.map((batch) => (
                  <tr key={batch.id}>
                    <td>{batch.label}</td>
                    <td className="num">{batch.count}</td>
                    <td className="num">{batch.claimed}</td>
                    <td className="num">{batch.revoked}</td>
                    <td className="mono">{when(batch.expires_at)}</td>
                    <td className="mono">{when(batch.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty title="No batches yet">
            <p className="fine">Mint one above to hand out invites that are not tied to a seat.</p>
          </Empty>
        )}
      </section>

      <section>
        <h2 className="eyebrow" style={{ marginBottom: '0.75rem' }}>Seats</h2>
        {seats.data?.seats.length ? (
          <div className="table-scroll">
            <table className="dense">
              <thead>
                <tr>
                  <th>#</th><th>Origin</th><th>Zone</th><th>Invited by</th>
                  <th>Lineage</th><th>Invites left</th><th>Claimed</th><th>State</th>
                </tr>
              </thead>
              <tbody>
                {seats.data.seats.map((seat) => (
                  <tr key={seat.id}>
                    <td className="num">{seat.id}</td>
                    <td>{seat.origin}</td>
                    <td className="num">{seat.zone_offset ?? '—'}</td>
                    <td className="num">{seat.parent_seat_id ?? '—'}</td>
                    <td className="num">{seat.lineage}</td>
                    <td className="num">{seat.invites_left}</td>
                    <td className="mono">{when(seat.claimed_at)}</td>
                    <td>
                      {seat.revoked_at
                        ? <Badge tone="warn">revoked</Badge>
                        : <Badge tone="live">live</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty title="No seats claimed yet">
            <p className="fine">
              Seats appear here when somebody spends a code. Nothing can spend one until the app is
              wired to this API.
            </p>
          </Empty>
        )}
      </section>
    </main>
  );
}
