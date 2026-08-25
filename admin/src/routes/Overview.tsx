import { api } from '../api.ts';
import { useResource } from '../lib/resource.ts';
import { Head, Problem } from '../components/Bits.tsx';

type Counter = { key: string; value: number; drift: number };

export function Overview() {
  const counters = useResource(() => api.get<{ counters: Counter[] }>('/admin/counters'));
  const byKey = Object.fromEntries((counters.data?.counters ?? []).map((c) => [c.key, c]));

  const tiles = [
    { key: 'seats.total', label: 'Seats' },
    { key: 'waitlist.total', label: 'Waiting' },
    { key: 'cells.visible', label: 'Cells' },
  ];

  return (
    <main className="admin-main">
      <Head title="Overview" note="The figures as published, and what is waiting for a decision." />
      <Problem error={counters.error} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(11rem, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {tiles.map((tile) => (
          <div key={tile.key} style={{ border: '1px solid var(--edge)', borderRadius: 4, padding: '1rem' }}>
            <p className="eyebrow">{tile.label}</p>
            <p className="mono" style={{ fontSize: '1.8rem', color: 'var(--bone)' }}>
              {(byKey[tile.key]?.value ?? 0).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <p className="notice">
        Nothing is wired to the mobile app yet — it still keeps every seat and invite on the
        individual phone. These figures move when the app is switched over, which is a later phase
        on purpose: that cutover invalidates every seat token minted on a device.
      </p>
    </main>
  );
}
