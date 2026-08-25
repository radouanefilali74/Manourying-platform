-- The waitlist — the no-code funnel floor.
--
-- Note what releasing a seat does NOT do: it does not create a seat. It mints an
-- invite, and the person still claims it through the same gate as everybody
-- else. That keeps "the ledger is the only thing that decides who has a seat"
-- true with no special case, and it means a released-but-never-claimed entry is
-- a spendable code rather than a phantom participant.

CREATE TABLE waitlist (
  id                bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  -- The app has no identity today: POST /waitlist takes only { zoneOffset } and
  -- GET /waitlist/me has nothing to key on. The server mints this token on first
  -- join and returns it for the client to persist, the same shape as a seat
  -- token. Storing the hash only, since it is a bearer credential.
  device_sha256     bytea NOT NULL UNIQUE,

  -- "Approximate and monotonic for the same reasons seatCount is — nobody's
  -- position may appear to go backwards" (services/types.ts). It comes from
  -- INCR mnr:count:waitlist.next_position, never from COUNT(*), and it is
  -- assigned once: re-joining updates the zone and nothing else.
  position          bigint NOT NULL,

  zone_offset       smallint NOT NULL CHECK (zone_offset BETWEEN -11 AND 12),
  joined_at         timestamptz NOT NULL DEFAULT now(),

  released_at       timestamptz,
  released_by       bigint REFERENCES admins(id),
  release_invite_id bigint UNIQUE REFERENCES invites(id),

  CONSTRAINT waitlist_release_coherent
    CHECK ((released_at IS NULL) = (release_invite_id IS NULL))
);

CREATE UNIQUE INDEX waitlist_position_key ON waitlist (position);
CREATE INDEX waitlist_open ON waitlist (position) WHERE released_at IS NULL;
CREATE INDEX waitlist_zone ON waitlist (zone_offset) WHERE released_at IS NULL;
