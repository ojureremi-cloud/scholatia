-- ============================================================================
-- Scholatia — Phase 1.1 Authentication & User Account Platform
-- SQL-ready schema for the persistence layer.
--
-- Mirrors the TypeScript models in `types/schema.ts`. No ORM or external
-- database connection is required in Phase 1.1; the in-memory repository in
-- `lib/auth/store.ts` implements this schema. These statements are production
-- ready and target PostgreSQL (adjust types for other SQL engines).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------
CREATE TABLE users (
  id                 UUID PRIMARY KEY,
  email              TEXT NOT NULL,
  email_normalized   TEXT NOT NULL UNIQUE,
  password_hash      TEXT NOT NULL,
  security_status    TEXT NOT NULL DEFAULT 'PendingVerification', -- Active | Suspended | Locked | PendingVerification | Deactivated
  verification_level INTEGER NOT NULL DEFAULT 0,                   -- VerificationLevel enum (0..9)
  email_verified_at  TIMESTAMPTZ,
  account_category   TEXT NOT NULL DEFAULT 'Individual',
  account_type       TEXT NOT NULL DEFAULT 'Student',
  roles              TEXT[] NOT NULL DEFAULT ARRAY['Student'],
  institution_id     UUID,
  must_reset_password BOOLEAN NOT NULL DEFAULT FALSE,
  last_login_at      TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email_normalized ON users (email_normalized);

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
CREATE TABLE profiles (
  user_id     UUID PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  institution TEXT,
  department  TEXT,
  country     TEXT,
  avatar_url  TEXT,
  biography   TEXT,
  privacy     TEXT NOT NULL DEFAULT 'Public', -- Public | Institution Only | Connections | Private | Custom
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- said (Scholatia Academic Identity)
-- ---------------------------------------------------------------------------
CREATE TABLE said (
  id                 UUID PRIMARY KEY,
  user_id            UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  said               TEXT NOT NULL UNIQUE, -- e.g. SAID-0000-0000-0000
  display_name       TEXT NOT NULL,
  verification_level INTEGER NOT NULL DEFAULT 0,
  is_verified        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_said_user_id ON said (user_id);
CREATE INDEX idx_said_identifier ON said (said);

-- ---------------------------------------------------------------------------
-- sessions
-- ---------------------------------------------------------------------------
CREATE TABLE sessions (
  id               UUID PRIMARY KEY,
  user_id          UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  remember_me      BOOLEAN NOT NULL DEFAULT FALSE,
  user_agent       TEXT,
  ip_address       TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at       TIMESTAMPTZ NOT NULL,
  revoked_at       TIMESTAMPTZ
);

CREATE INDEX idx_sessions_user_id ON sessions (user_id);
CREATE INDEX idx_sessions_expires_at ON sessions (expires_at);

-- ---------------------------------------------------------------------------
-- roles
-- ---------------------------------------------------------------------------
CREATE TABLE roles (
  id          UUID PRIMARY KEY,
  key         TEXT NOT NULL UNIQUE, -- PlatformRoleId: visitor | student | researcher | ...
  name        TEXT NOT NULL,        -- PlatformRoleName: Visitor | Student | Researcher | ...
  description TEXT NOT NULL,
  level       INTEGER NOT NULL,     -- position in the 10-role hierarchy (0..9)
  hierarchy   TEXT[] NOT NULL,      -- inherited ancestor role keys
  permissions TEXT[] NOT NULL,      -- PermissionKey values granted directly
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- permissions
-- ---------------------------------------------------------------------------
CREATE TABLE permissions (
  id          UUID PRIMARY KEY,
  key         TEXT NOT NULL UNIQUE, -- PermissionKey: read:profile | write:profile | ...
  label       TEXT NOT NULL,
  description TEXT NOT NULL,
  group_key   TEXT NOT NULL
);

-- ---------------------------------------------------------------------------
-- verification_tokens
-- ---------------------------------------------------------------------------
CREATE TABLE verification_tokens (
  id          UUID PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_verification_tokens_user_id ON verification_tokens (user_id);

-- ---------------------------------------------------------------------------
-- password_reset_tokens
-- ---------------------------------------------------------------------------
CREATE TABLE password_reset_tokens (
  id          UUID PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens (user_id);
