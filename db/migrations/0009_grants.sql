-- Privileges for the running API's role.
--
-- Two roles, because it is the only thing that makes audit_log genuinely
-- append-only and keeps a compromised API from altering its own schema:
--
--   manourying_owner  owns everything, runs migrations. Never used at runtime.
--   manourying_app    the API. Granted exactly what it needs, table by table.
--
-- The grants are written defensively so this file applies cleanly whether or not
-- the role exists — a fresh clone on a developer machine may well run everything
-- as a single superuser, and a migration that hard-fails there would push people
-- towards skipping it.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'manourying_app') THEN
    RAISE NOTICE 'role manourying_app does not exist — skipping grants (dev setup?)';
    RETURN;
  END IF;

  GRANT USAGE ON SCHEMA public TO manourying_app;

  -- Ordinary read/write tables.
  GRANT SELECT, INSERT, UPDATE ON
    admins, admin_sessions, seats, invite_batches, invites, waitlist,
    cells, cell_reports, echo_cycles, echo_submissions, directive_versions,
    counters, zone_counts
  TO manourying_app;

  -- Sessions are the one thing the API genuinely deletes: expired rows are swept
  -- on a timer, and there is no reason to keep them.
  GRANT DELETE ON admin_sessions TO manourying_app;

  -- The whole point. No UPDATE, no DELETE, not now and not by accident later.
  GRANT SELECT, INSERT ON audit_log TO manourying_app;

  GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO manourying_app;

  -- The migrator must not be able to hand out more than this by forgetting to
  -- come back and edit the list: anything created later defaults to nothing.
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO manourying_app;
END $$;
