-- The cached, approximate, monotonic counters.
--
-- services/types.ts is explicit that seatCount is "deliberately approximate" and
-- that nobody's count may appear to go backwards. Redis is the increment sink
-- and the read source; this table is the durable floor that survives a Redis
-- flush. On boot the API seeds Redis from here, taking the max.
--
-- The floor only ever rises, and that is enforced by a trigger rather than by
-- every caller remembering to write GREATEST().

CREATE TABLE counters (
  key          text PRIMARY KEY,                   -- 'seats.total', 'waitlist.total', …
  value        bigint NOT NULL CHECK (value >= 0),
  refreshed_at timestamptz NOT NULL DEFAULT now(),
  refreshed_by bigint REFERENCES admins(id),
  source       text NOT NULL DEFAULT 'incremental'
               CHECK (source IN ('incremental', 'recount', 'manual'))
);

CREATE FUNCTION counters_never_decrease() RETURNS trigger AS $$
BEGIN
  -- The escape hatch is deliberately awkward and deliberately audited. Be
  -- honest about what it is: this guard stops accidents, not a compromised
  -- application, since the API's own role can set the GUC itself. Its value is
  -- that no ordinary code path can lower a published figure by mistake.
  IF NEW.value < OLD.value
     AND coalesce(current_setting('manourying.allow_decrease', true), 'off') <> 'on' THEN
    RAISE EXCEPTION 'counter % may not decrease (% -> %)', OLD.key, OLD.value, NEW.value
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END $$ LANGUAGE plpgsql;

CREATE TRIGGER counters_monotonic BEFORE UPDATE ON counters
  FOR EACH ROW EXECUTE FUNCTION counters_never_decrease();

-- Behind GET /counts/zones. The app ships seed weights in src/domain/zones.ts
-- whose comment says the real figure "comes from the service layer in
-- production" — this is that service layer.
CREATE TABLE zone_counts (
  zone_offset  smallint PRIMARY KEY CHECK (zone_offset BETWEEN -11 AND 12),
  seats        bigint NOT NULL DEFAULT 0 CHECK (seats >= 0),
  waitlist     bigint NOT NULL DEFAULT 0 CHECK (waitlist >= 0),
  refreshed_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO counters (key, value, source) VALUES
  ('seats.total',             0, 'manual'),
  ('waitlist.total',          0, 'manual'),
  ('waitlist.next_position',  0, 'manual'),
  ('cells.visible',           0, 'manual');

INSERT INTO zone_counts (zone_offset)
  SELECT generate_series(-11, 12)::smallint;
