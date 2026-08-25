-- Every mutating admin action, append-only.
--
-- "Append-only" is not a convention here — 0009_grants.sql grants the API's role
-- INSERT and SELECT on this table and nothing else, so the running application
-- physically cannot rewrite its own history. That two-role split is the only
-- thing that makes the claim true rather than aspirational.

CREATE TABLE audit_log (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  at           timestamptz NOT NULL DEFAULT now(),
  admin_id     bigint REFERENCES admins(id),
  action       text NOT NULL,                      -- 'invite.revoke', 'directive.seal', …
  subject_type text NOT NULL,                      -- 'invite', 'cell', 'directive', …
  subject_id   text,
  detail       jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip           inet
);

CREATE INDEX audit_log_at ON audit_log (at DESC);
CREATE INDEX audit_log_subject ON audit_log (subject_type, subject_id, at DESC);
CREATE INDEX audit_log_admin ON audit_log (admin_id, at DESC);
