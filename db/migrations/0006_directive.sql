-- The directive ledger.
--
-- READ THIS BEFORE CHANGING ANYTHING HERE.
--
-- This table is NOT the source of truth for the directive. It cannot be. The
-- hash participants verify is computed on their own device from the copy of
-- DIRECTIVE_STEPS inside an app binary that went through App Review weeks
-- earlier — an artefact no database can regenerate. The site's copy in
-- web/src/lib/directive.ts is hashed at build time for the same reason: a static
-- site with no application process cannot ask a database anything.
--
-- So this table is a drafting surface and a ledger:
--
--   draft   — where the wording is actually worked out. This is the only place
--             not-yet-public wording can live, since anything committed to
--             either repo is on GitHub the moment it is pushed.
--   sealed  — frozen by the trigger below, hash recorded.
--   then    scripts/directive-sync.mjs writes the sealed steps into BOTH repos
--           by codegen, which is what makes CLAUDE.md's "never retype the
--           directive by hand" mechanically true rather than a request.
--   published / unsealed — records what actually happened, and when.
--
-- check-parity.mjs grows a third leg comparing this row's hash to the app and
-- site sources, and POST /admin/directive/:id/publish refuses outright unless
-- all three agree.

CREATE TABLE directive_versions (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cycle        smallint NOT NULL,                  -- matches the app's CYCLE
  revision     integer  NOT NULL,

  steps        jsonb NOT NULL,                     -- [{at, heading, detail}, …]

  -- The exact bytes that were hashed: `${at}\t${heading}\t${detail}` per step,
  -- joined by \n. Stored rather than recomputed, so that if the serialisation
  -- function is ever changed by accident, the disagreement is visible instead
  -- of silently following along.
  canonical    text NOT NULL,
  sha256       text NOT NULL CHECK (sha256 ~ '^[0-9a-f]{64}$'),

  state        text NOT NULL DEFAULT 'draft' CHECK (state IN
                 ('draft', 'sealed', 'published', 'unsealed', 'superseded')),

  unseal_at    timestamptz NOT NULL,               -- T−7d
  sealed_at    timestamptz, sealed_by    bigint REFERENCES admins(id),
  published_at timestamptz, published_by bigint REFERENCES admins(id),
  unsealed_at  timestamptz,

  created_by   bigint REFERENCES admins(id),
  created_at   timestamptz NOT NULL DEFAULT now(),

  UNIQUE (cycle, revision)
);

-- One live directive per cycle. Drafts are unconstrained — that is the point of
-- a drafting surface — but there can only ever be one sealed thing.
CREATE UNIQUE INDEX directive_one_live ON directive_versions (cycle)
  WHERE state IN ('sealed', 'published', 'unsealed');

-- A sealed directive that can be edited is not sealed. This is the constraint
-- the entire published-hash claim rests on, so it lives in the database rather
-- than in a route handler somebody might refactor around.
CREATE FUNCTION directive_frozen_once_sealed() RETURNS trigger AS $$
BEGIN
  IF OLD.state <> 'draft' AND (
       NEW.steps     IS DISTINCT FROM OLD.steps
    OR NEW.canonical IS DISTINCT FROM OLD.canonical
    OR NEW.sha256    IS DISTINCT FROM OLD.sha256
    OR NEW.cycle     IS DISTINCT FROM OLD.cycle
  ) THEN
    RAISE EXCEPTION 'directive % is %; its text and hash are frozen', OLD.id, OLD.state
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END $$ LANGUAGE plpgsql;

CREATE TRIGGER directive_freeze BEFORE UPDATE ON directive_versions
  FOR EACH ROW EXECUTE FUNCTION directive_frozen_once_sealed();
