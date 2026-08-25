-- Echo curation.
--
-- This queue stays empty until audio capture ships (the app currently exports
-- `captureEngine = null`, and the app's own echo() is hardcoded). It is built
-- now anyway, because a public archive of ambient audio recorded in public
-- squares needs individually-cleared, individually-consented submissions under
-- GDPR — which makes the review queue a legal requirement rather than a feature.
--
-- The important design decision is that the *database* refuses to publish
-- something uncleared or unconsented. A UI that greys out a button is an
-- explanation; a CHECK constraint is a guarantee.

CREATE TABLE echo_cycles (
  id             bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  label          text NOT NULL UNIQUE,             -- 'Echo 01 · March equinox 2026'
  moment_utc     timestamptz NOT NULL,
  voices         bigint   NOT NULL DEFAULT 0,
  zones_reached  smallint NOT NULL DEFAULT 0,
  zones_total    smallint NOT NULL DEFAULT 24,
  spread_seconds numeric(6,3) NOT NULL DEFAULT 0,  -- stddev of arrival times, seconds
  published_at   timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE echo_submissions (
  id               bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cycle_id         bigint NOT NULL REFERENCES echo_cycles(id),
  seat_id          bigint REFERENCES seats(id) ON DELETE SET NULL,

  place            text NOT NULL,                  -- 'Seoul'
  local_time       text NOT NULL,                  -- '23:06 local'
  note             text NOT NULL,                  -- the caption that gets published
  zone_offset      smallint,
  cell_id          bigint REFERENCES cells(id) ON DELETE SET NULL,
  captured_seconds smallint CHECK (captured_seconds BETWEEN 0 AND 60),
  deviation_ms     integer,

  -- Reserved. The CHECK below keeps it NULL until the phase that ships audio
  -- storage drops that constraint deliberately, rather than having a column
  -- quietly start holding object keys nobody designed a retention policy for.
  audio_ref        text,

  state            text NOT NULL DEFAULT 'submitted' CHECK (state IN
                     ('submitted', 'in_review', 'cleared', 'rejected', 'published', 'withdrawn')),

  -- Consent is tracked separately from review state because they are different
  -- questions asked of different people: "is this fit to publish" is ours,
  -- "may we publish it" is theirs, and either can change without the other.
  consent_state    text NOT NULL DEFAULT 'none' CHECK (consent_state IN
                     ('none', 'requested', 'granted', 'refused', 'withdrawn')),
  consent_at       timestamptz,
  consent_note     text,

  reviewed_by      bigint REFERENCES admins(id),
  reviewed_at      timestamptz,
  cleared_by       bigint REFERENCES admins(id),
  cleared_at       timestamptz,
  rejected_reason  text,

  -- published_at deliberately SURVIVES a withdrawal. "It was published and then
  -- withdrawn" and "it was never published" are different facts, and an archive
  -- that cannot tell them apart cannot answer a data-subject request honestly.
  published_at     timestamptz,
  withdrawn_at     timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT echo_publish_requires_clearance_and_consent
    CHECK (state <> 'published'
           OR (cleared_at IS NOT NULL AND consent_state = 'granted')),

  CONSTRAINT echo_consent_coherent
    CHECK (consent_state IN ('none', 'requested') OR consent_at IS NOT NULL),

  CONSTRAINT echo_audio_deferred CHECK (audio_ref IS NULL)
);

CREATE INDEX echo_queue ON echo_submissions (cycle_id, state, created_at);
CREATE INDEX echo_published ON echo_submissions (cycle_id) WHERE state = 'published';
