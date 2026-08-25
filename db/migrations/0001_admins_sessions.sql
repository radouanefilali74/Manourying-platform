-- Admins and their sessions.
--
-- There is no public signup route, in any environment. Rows in `admins` arrive
-- exactly one way: `npm --prefix server run admin -- create`. That is a
-- deliberate property of the design, not an omission to be filled in later.

CREATE TABLE admins (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email         text NOT NULL CHECK (email = lower(email) AND email LIKE '%@%'),
  password_hash text NOT NULL,                     -- argon2id, PHC string format
  display_name  text NOT NULL,
  role          text NOT NULL DEFAULT 'operator'
                CHECK (role IN ('owner', 'operator', 'reviewer')),
  disabled_at   timestamptz,
  last_login_at timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX admins_email_key ON admins (email);

-- Only the SHA-256 of the cookie value is stored. Read access to this database
-- therefore does not hand over live sessions — an attacker who can SELECT here
-- still cannot mint a cookie that verifies.
--
-- csrf_token, by contrast, is stored in clear on purpose. It is not a credential
-- on its own: possession of it proves nothing without the cookie, and the whole
-- job it does is being readable by the SPA's own JavaScript while being
-- unreadable to a cross-site attacker. Storing it plainly is what lets
-- GET /admin/auth/me hand a working token back after a page reload without
-- rotating the session.
CREATE TABLE admin_sessions (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  admin_id     bigint NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  token_sha256 bytea NOT NULL UNIQUE,
  csrf_token   text  NOT NULL,
  issued_at    timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  expires_at   timestamptz NOT NULL,
  revoked_at   timestamptz,
  ip           inet,
  user_agent   text
);

CREATE INDEX admin_sessions_live ON admin_sessions (admin_id) WHERE revoked_at IS NULL;
CREATE INDEX admin_sessions_expiry ON admin_sessions (expires_at);
