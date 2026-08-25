-- Seats and invites — the ledger the whole project rests on.
--
-- The app's own contract (Manourying/src/services/remote.ts:8-36) states two
-- things this schema has to make true rather than merely intend:
--
--   * invite codes are issued and validated server-side, always. The client-side
--     derivation in src/domain/invites.ts is labelled forgeable in its own
--     comments — it is the mock's stand-in, not the mechanism.
--   * two simultaneous claims of one code are a race that exactly one wins.
--
-- The second one is enforced by the shape of the claim statement (see the
-- comment on invites below) with a unique index as the backstop.

CREATE TABLE seats (
  id             bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  -- Opaque, and never a personal identifier — the app's Seat.token. Stored as
  -- the raw value rather than a hash because the admin panel has to be able to
  -- show lineage, and because it is issued by us rather than chosen by anyone.
  token          text NOT NULL UNIQUE,

  -- The visible lineage: who invited them. NULL for founders and for seats
  -- released from the waitlist.
  parent_seat_id bigint REFERENCES seats(id) ON DELETE SET NULL,

  zone_offset    smallint CHECK (zone_offset BETWEEN -11 AND 12),
  origin         text NOT NULL DEFAULT 'invite'
                 CHECK (origin IN ('invite', 'waitlist_release', 'seed', 'founder')),
  claimed_at     timestamptz NOT NULL DEFAULT now(),
  revoked_at     timestamptz,
  revoked_by     bigint REFERENCES admins(id),
  note           text
);

CREATE INDEX seats_parent ON seats (parent_seat_id);
CREATE INDEX seats_live ON seats (claimed_at) WHERE revoked_at IS NULL;

-- A batch minted from the admin panel, as opposed to the three an ordinary seat
-- is issued when it is claimed.
CREATE TABLE invite_batches (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  label      text NOT NULL,
  count      integer NOT NULL CHECK (count > 0 AND count <= 5000),
  expires_at timestamptz,
  created_by bigint REFERENCES admins(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE invites (
  id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code            text NOT NULL,

  seat_id         bigint REFERENCES seats(id) ON DELETE CASCADE,   -- the issuing seat
  batch_id        bigint REFERENCES invite_batches(id),

  issued_at       timestamptz NOT NULL DEFAULT now(),
  expires_at      timestamptz,
  claimed_at      timestamptz,
  claimed_seat_id bigint REFERENCES seats(id),
  revoked_at      timestamptz,
  revoked_by      bigint REFERENCES admins(id),

  -- The Crockford-style unambiguous alphabet from src/domain/invites.ts: no
  -- 0/O, no 1/I/L, because these get read aloud and written down. The range is
  -- {6,12} rather than {6} on purpose — seat-issued codes are six characters
  -- because a person repeats them, while admin batch codes are minted longer,
  -- since 31^6 is guessable at scale long before it is collision-prone.
  -- web/src/pages/gate.astro:76 already accepts the same range.
  CONSTRAINT invites_code_shape
    CHECK (code ~ '^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6,12}$'),

  CONSTRAINT invites_claim_coherent
    CHECK ((claimed_at IS NULL) = (claimed_seat_id IS NULL)),

  -- Issued by a seat, or minted in a batch. Never both, never neither.
  CONSTRAINT invites_origin
    CHECK (num_nonnulls(seat_id, batch_id) = 1),

  -- "Spent invites do not return" (services/types.ts). A code that has been
  -- claimed cannot subsequently be revoked, so revocation can never rewrite
  -- somebody's existing seat out from under them.
  CONSTRAINT invites_no_revoke_after_claim
    CHECK (NOT (claimed_at IS NOT NULL AND revoked_at IS NOT NULL))
);

CREATE UNIQUE INDEX invites_code_key ON invites (code);

-- The backstop on the claim race. The race itself is won by the single
-- statement below, which is safe under READ COMMITTED because the loser blocks
-- on the row lock and then re-evaluates its WHERE against the new row version:
--
--   UPDATE invites SET claimed_at = now(), claimed_seat_id = $2
--    WHERE code = $1 AND claimed_at IS NULL AND revoked_at IS NULL
--          AND (expires_at IS NULL OR expires_at > now())
--   RETURNING id, seat_id;                  -- zero rows means somebody else won
--
-- This index exists so that any future refactor which gets that wrong produces
-- a constraint violation rather than two seats from one code.
CREATE UNIQUE INDEX invites_one_seat_each ON invites (claimed_seat_id)
  WHERE claimed_seat_id IS NOT NULL;

CREATE INDEX invites_spendable ON invites (seat_id)
  WHERE claimed_at IS NULL AND revoked_at IS NULL;
CREATE INDEX invites_batch ON invites (batch_id);
