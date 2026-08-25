/**
 * The audit trail.
 *
 * Every mutating admin action writes one row. The API's database role has
 * INSERT and SELECT on audit_log and nothing else (db/migrations/0009), so this
 * is append-only in fact rather than by convention — the running process cannot
 * rewrite its own history even if it is compromised.
 *
 * Call this inside the same transaction as the change it describes wherever
 * that is possible, so an action and its record cannot come apart.
 */
import type { Queryable } from '../db/pool.ts';

export type AuditEntry = {
  adminId: number | null;
  action: string; // 'invite.revoke', 'directive.seal', 'counters.refresh', …
  subjectType: string; // 'invite', 'cell', 'directive', …
  subjectId?: string | number | null;
  detail?: Record<string, unknown>;
  ip?: string | null;
};

export async function audit(db: Queryable, entry: AuditEntry): Promise<void> {
  await db.query(
    `INSERT INTO audit_log (admin_id, action, subject_type, subject_id, detail, ip)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      entry.adminId,
      entry.action,
      entry.subjectType,
      entry.subjectId == null ? null : String(entry.subjectId),
      JSON.stringify(entry.detail ?? {}),
      entry.ip ?? null,
    ],
  );
}
