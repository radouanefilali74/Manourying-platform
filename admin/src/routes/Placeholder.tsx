import { Empty, Head } from '../components/Bits.tsx';

/**
 * The views that have a schema and an API but no UI yet. Named honestly rather
 * than hidden from the nav — an operator should be able to see what this panel
 * is going to cover.
 */
export function Placeholder({ title, note, body }: { title: string; note: string; body: string }) {
  return (
    <main className="admin-main">
      <Head title={title} note={note} />
      <Empty title="Not built yet">
        <p className="fine" style={{ maxWidth: '30rem', margin: '0 auto' }}>{body}</p>
      </Empty>
    </main>
  );
}
