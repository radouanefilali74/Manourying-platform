# db

Schema and migrations for the Manourying API.

There is no `package.json` here. The runner lives in
[server/src/db/migrate.ts](../server/src/db/migrate.ts) and reads `db/migrations/*.sql` — one
fewer package to install, and the SQL stays readable as SQL.

## Two roles, on purpose

```sql
CREATE ROLE manourying_owner LOGIN PASSWORD '…';   -- owns everything; runs migrations
CREATE ROLE manourying_app   LOGIN PASSWORD '…';   -- the running API
CREATE DATABASE manourying OWNER manourying_owner;

\c manourying
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL   ON SCHEMA public TO manourying_owner;
GRANT USAGE ON SCHEMA public TO manourying_app;
```

`0009_grants.sql` then grants `manourying_app` what it needs, table by table. The split is not
ceremony — it is the only thing that makes two claims in the schema true rather than aspirational:

- **`audit_log` is append-only.** The app role has `INSERT` and `SELECT` and nothing else, so a
  compromised API physically cannot rewrite its own history.
- **The API cannot alter the schema.** It does not own the tables and has no rights on the schema
  beyond `USAGE`.

Both are verified, not assumed:

```
$ psql "$DATABASE_URL" -c "UPDATE audit_log SET action='rewritten'"
ERROR:  permission denied for table audit_log
$ psql "$DATABASE_URL" -c "CREATE TABLE sneaky (x int)"
ERROR:  permission denied for schema public
```

`0009` skips itself with a notice when `manourying_app` does not exist, so a developer running
everything as one superuser is not blocked by a migration that cannot apply.

## Running migrations

```bash
npm run db:migrate                          # from the repo root
npm --prefix server run db:migrate -- --dry-run
```

Migrations run as `MIGRATE_DATABASE_URL` when set, falling back to `DATABASE_URL`.

Each file applies inside one transaction — Postgres DDL is transactional, so there is no such
thing as a half-applied migration here. Applied files are recorded in `schema_migrations` with a
SHA-256 of their contents, and the runner **aborts if an applied file's bytes have changed**:

```
0008_audit_log.sql was already applied, but its contents have changed.
    applied: 8fccc5be…
    on disk: 4ff9335f…
    Do not edit an applied migration — add a new one.
```

That is the rule. Editing an applied migration is the mistake; a new file is the fix.

## Where the invariants live

The interesting constraints are in the schema rather than in route handlers, because a handler can
be refactored around and a `CHECK` cannot. Each is exercised in `server/test/`:

| Invariant | Enforced by | Migration |
|---|---|---|
| One code, one seat, even under concurrent claims | `invites_one_seat_each` partial unique index, plus the conditional `UPDATE … WHERE claimed_at IS NULL RETURNING` | `0002` |
| A spent invite can never be revoked | `invites_no_revoke_after_claim` | `0002` |
| A published Echo entry has been cleared *and* consented | `echo_publish_requires_clearance_and_consent` | `0005` |
| A sealed directive's text and hash are frozen | `directive_frozen_once_sealed()` trigger | `0006` |
| Cell removal is terminal | `cells_removal_is_final()` trigger | `0004` |
| Counters never go backwards | `counters_never_decrease()` trigger | `0007` |

The counter trigger has a deliberate escape hatch for the rare genuine correction:

```sql
BEGIN;
SET LOCAL manourying.allow_decrease = 'on';
UPDATE counters SET value = …, source = 'manual' WHERE key = …;
COMMIT;
```

Be honest about what that guard is: it stops accidents, not a compromised application, since the
API's own role can set the GUC itself. Its value is that no ordinary code path can lower a
published figure by mistake.

## Seeds

`db/seeds/` holds development fixtures only — `npm --prefix server run db:seed` refuses to run
with `NODE_ENV=production`.
