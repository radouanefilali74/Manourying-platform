-- Cells and their reports.
--
-- Anyone can open a cell and nobody staffs them, so this is where abuse
-- surfaces. Moderation here is about safety, not curation: the question is
-- never "is this a good place to stand", it is "will someone be hurt or
-- trespassing if they go where this says".

CREATE TABLE cells (
  id                bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  public_id         text NOT NULL UNIQUE,          -- the app's Cell.id
  name              text NOT NULL CHECK (length(btrim(name)) BETWEEN 2 AND 80),
  kind              text NOT NULL CHECK (length(kind) <= 40),
  zone_offset       smallint NOT NULL CHECK (zone_offset BETWEEN -11 AND 12),

  -- Cell.distance is documented as "human-readable distance — the server does
  -- the geometry", but no route in the app's contract carries the caller's
  -- position, so nothing can compute it yet. These columns exist now so the
  -- schema does not have to change when that is resolved; until then the
  -- app-facing stub returns '—', exactly as the mock does for user-opened cells.
  lat               double precision CHECK (lat BETWEEN -90 AND 90),
  lon               double precision CHECK (lon BETWEEN -180 AND 180),

  opened_by_seat_id bigint REFERENCES seats(id) ON DELETE SET NULL,
  pledged           integer NOT NULL DEFAULT 1 CHECK (pledged >= 0),

  -- Denormalised and trigger-maintained, so the moderation queue sorts on an
  -- indexed column instead of an aggregate join against a table that only ever
  -- grows.
  report_count      integer NOT NULL DEFAULT 0,

  -- hidden is reversible and keeps its reports; removed is terminal. The
  -- trigger below refuses to walk that back.
  status            text NOT NULL DEFAULT 'visible'
                    CHECK (status IN ('visible', 'hidden', 'removed')),
  moderated_by      bigint REFERENCES admins(id),
  moderated_at      timestamptz,
  moderation_note   text,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX cells_zone_live ON cells (zone_offset, pledged DESC) WHERE status = 'visible';
CREATE INDEX cells_queue ON cells (report_count DESC, created_at DESC) WHERE status <> 'removed';

CREATE TABLE cell_reports (
  id               bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cell_id          bigint NOT NULL REFERENCES cells(id) ON DELETE CASCADE,
  reporter_seat_id bigint REFERENCES seats(id) ON DELETE SET NULL,
  reason           text NOT NULL CHECK (reason IN
                     ('unsafe', 'private_property', 'spam', 'hate', 'not_a_place', 'other')),
  detail           text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  resolved_at      timestamptz,
  resolved_by      bigint REFERENCES admins(id),
  resolution       text CHECK (resolution IN ('upheld', 'dismissed')),

  CONSTRAINT cell_reports_resolution_coherent
    CHECK ((resolved_at IS NULL) = (resolution IS NULL))
);

CREATE INDEX cell_reports_cell ON cell_reports (cell_id);
CREATE INDEX cell_reports_open ON cell_reports (created_at DESC) WHERE resolved_at IS NULL;

-- One report per seat per cell: a brigade of one account should not be able to
-- push a cell to the top of the queue by reporting it forty times.
CREATE UNIQUE INDEX cell_reports_one_per_seat ON cell_reports (cell_id, reporter_seat_id)
  WHERE reporter_seat_id IS NOT NULL;

CREATE FUNCTION cells_sync_report_count() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE cells SET report_count = report_count + 1 WHERE id = NEW.cell_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE cells SET report_count = GREATEST(report_count - 1, 0) WHERE id = OLD.cell_id;
  END IF;
  RETURN NULL;
END $$ LANGUAGE plpgsql;

CREATE TRIGGER cell_reports_count AFTER INSERT OR DELETE ON cell_reports
  FOR EACH ROW EXECUTE FUNCTION cells_sync_report_count();

-- Removal is terminal. A cell taken down for being someone's front garden must
-- not reappear because a later moderation action set status back to 'visible'.
CREATE FUNCTION cells_removal_is_final() RETURNS trigger AS $$
BEGIN
  IF OLD.status = 'removed' AND NEW.status <> 'removed' THEN
    RAISE EXCEPTION 'cell % was removed; removal is not reversible', OLD.id
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END $$ LANGUAGE plpgsql;

CREATE TRIGGER cells_removal_final BEFORE UPDATE ON cells
  FOR EACH ROW EXECUTE FUNCTION cells_removal_is_final();
