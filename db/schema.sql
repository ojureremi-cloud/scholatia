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

-- ============================================================================
-- Scholatia — Phase 1.9A Academic Advertising & Sponsored Content Platform
-- SQL-ready schema for the monetization layer.
--
-- Mirrors the TypeScript models in `types/ads.ts`. The Advertising module is
-- additive: it does NOT own source records. Every advertisement references an
-- existing record through the `promotable_objects` table (a SAID, a journal id,
-- a conference id, a DOI, a grant id, a project id). Targeting, budgeting,
-- forecasting, fraud detection, and analytics are computed by `lib/ads.ts`.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- promotable_objects
-- ---------------------------------------------------------------------------
-- A live reference to a promotable record owned by any other module.
CREATE TABLE promotable_objects (
  id            UUID PRIMARY KEY,
  entity_type   TEXT NOT NULL,              -- PromotableEntityType (31 categories)
  source_id     TEXT NOT NULL,              -- original identity (SAID, journalId, conferenceId, DOI, grant id)
  title         TEXT NOT NULL,
  summary       TEXT NOT NULL,
  url           TEXT NOT NULL,              -- canonical route to the source record
  keywords      TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  discipline    TEXT,
  research_areas TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  authors       TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  organizations TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  country       TEXT,
  stage_id      TEXT,                       -- ResearchLifecycleStageId
  tags          TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  date_added    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_promotable_objects_entity_type ON promotable_objects (entity_type);
CREATE INDEX idx_promotable_objects_source_id   ON promotable_objects (source_id);

-- ---------------------------------------------------------------------------
-- advertiser_accounts
-- ---------------------------------------------------------------------------
CREATE TABLE advertiser_accounts (
  id                  UUID PRIMARY KEY,
  name                TEXT NOT NULL,
  kind                TEXT NOT NULL,        -- scholatia-promote | scholatia-ads
  account_type        TEXT NOT NULL,        -- individual | organization
  said                TEXT,                 -- owner SAID for scholatia-promote
  industry            TEXT,
  website             TEXT,
  country             TEXT,
  city                TEXT,
  company_description TEXT,
  size_band           TEXT,
  representative_name TEXT,
  representative_email TEXT,
  billing_email       TEXT NOT NULL,
  default_method      TEXT NOT NULL,        -- AdPaymentMethod
  balance             NUMERIC NOT NULL DEFAULT 0,
  credit_balance      NUMERIC NOT NULL DEFAULT 0,
  auto_recharge       BOOLEAN NOT NULL DEFAULT FALSE,
  campaign_manager_id TEXT,
  advertisement_library TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  verification_status TEXT NOT NULL DEFAULT 'Pending',  -- Verified | Trusted | Pending
  trust_score         INTEGER NOT NULL DEFAULT 70,
  joined_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_advertiser_accounts_kind ON advertiser_accounts (kind);
CREATE INDEX idx_advertiser_accounts_said ON advertiser_accounts (said);

-- ---------------------------------------------------------------------------
-- advertiser_payments
-- ---------------------------------------------------------------------------
CREATE TABLE advertiser_payments (
  id           UUID PRIMARY KEY,
  advertiser_id UUID NOT NULL REFERENCES advertiser_accounts (id) ON DELETE CASCADE,
  amount       NUMERIC NOT NULL,
  currency     TEXT NOT NULL,
  method       TEXT NOT NULL,               -- AdPaymentMethod
  status       TEXT NOT NULL DEFAULT 'pending', -- paid | pending | failed | refunded
  billed_at    TIMESTAMPTZ NOT NULL,
  description  TEXT NOT NULL,
  campaign_id  TEXT,
  invoice_number TEXT
);

CREATE INDEX idx_advertiser_payments_advertiser_id ON advertiser_payments (advertiser_id);

-- ---------------------------------------------------------------------------
-- ad_campaigns
-- ---------------------------------------------------------------------------
CREATE TABLE ad_campaigns (
  id            UUID PRIMARY KEY,
  name          TEXT NOT NULL,
  advertiser_id UUID NOT NULL REFERENCES advertiser_accounts (id) ON DELETE CASCADE,
  objective     TEXT NOT NULL,              -- AdObjective
  status        TEXT NOT NULL DEFAULT 'draft', -- AdCampaignStatus
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ad_campaigns_advertiser_id ON ad_campaigns (advertiser_id);
CREATE INDEX idx_ad_campaigns_status ON ad_campaigns (status);

-- ---------------------------------------------------------------------------
-- ad_sets
-- ---------------------------------------------------------------------------
CREATE TABLE ad_sets (
  id            UUID PRIMARY KEY,
  name          TEXT NOT NULL,
  campaign_id   UUID NOT NULL REFERENCES ad_campaigns (id) ON DELETE CASCADE,
  audience_id   UUID,                       -- ad_audiences
  placements    TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],  -- AdPlacement[]
  pricing_model TEXT NOT NULL,              -- AdPricingModel
  bid_amount    NUMERIC NOT NULL,
  currency      TEXT NOT NULL,
  budget_total  NUMERIC NOT NULL,
  budget_mode   TEXT NOT NULL DEFAULT 'lifetime', -- AdBudgetMode
  daily_cap     NUMERIC,
  budget_spent  NUMERIC NOT NULL DEFAULT 0,
  start_date    TIMESTAMPTZ NOT NULL,
  end_date      TIMESTAMPTZ,
  timezone      TEXT,
  status        TEXT NOT NULL DEFAULT 'draft', -- AdCampaignStatus
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ad_sets_campaign_id ON ad_sets (campaign_id);
CREATE INDEX idx_ad_sets_audience_id ON ad_sets (audience_id);

-- ---------------------------------------------------------------------------
-- ad_creatives
-- ---------------------------------------------------------------------------
CREATE TABLE ad_creatives (
  id                UUID PRIMARY KEY,
  name              TEXT NOT NULL,
  headline          TEXT NOT NULL,
  primary_text      TEXT NOT NULL,
  description       TEXT,
  call_to_action    TEXT NOT NULL,
  media_url         TEXT,
  format            TEXT NOT NULL,          -- AdFormat
  promoted_object_id UUID REFERENCES promotable_objects (id) ON DELETE SET NULL,
  label             TEXT NOT NULL,          -- SponsoredLabel
  status            TEXT NOT NULL DEFAULT 'in-review', -- AdCreativeStatus
  review_status     TEXT NOT NULL DEFAULT 'pending',   -- pending | approved | rejected
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ad_creatives_promoted_object_id ON ad_creatives (promoted_object_id);

-- ---------------------------------------------------------------------------
-- ad_set_creatives (ad sets <-> creatives join)
-- ---------------------------------------------------------------------------
CREATE TABLE ad_set_creatives (
  ad_set_id   UUID NOT NULL REFERENCES ad_sets (id) ON DELETE CASCADE,
  creative_id UUID NOT NULL REFERENCES ad_creatives (id) ON DELETE CASCADE,
  PRIMARY KEY (ad_set_id, creative_id)
);

-- ---------------------------------------------------------------------------
-- ad_audiences
-- ---------------------------------------------------------------------------
CREATE TABLE ad_audiences (
  id                       UUID PRIMARY KEY,
  name                     TEXT NOT NULL,
  description              TEXT,
  countries                TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  states                   TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  cities                   TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  institutions             TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  departments              TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  faculties                TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  disciplines              TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  research_interests       TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  research_keywords        TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  academic_ranks           TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  student_levels           TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  career_stages            TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  languages                TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  sectors                  TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  lifecycle_stages         TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  citation_level           TEXT,
  custom_audience_ids      TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  lookalike_audience_ids   TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  retargeting_audience_ids TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  estimated_reach          BIGINT NOT NULL DEFAULT 0
);

-- ---------------------------------------------------------------------------
-- sponsored_placements
-- ---------------------------------------------------------------------------
CREATE TABLE sponsored_placements (
  id           UUID PRIMARY KEY,
  placement    TEXT NOT NULL,               -- AdPlacement
  ad_set_id    UUID REFERENCES ad_sets (id) ON DELETE SET NULL,
  creative_id  UUID REFERENCES ad_creatives (id) ON DELETE SET NULL,
  label        TEXT NOT NULL,               -- SponsoredLabel
  priority     INTEGER NOT NULL DEFAULT 50,
  status       TEXT NOT NULL DEFAULT 'scheduled', -- live | paused | ended | scheduled
  start_date   TIMESTAMPTZ NOT NULL,
  end_date     TIMESTAMPTZ,
  impressions  BIGINT NOT NULL DEFAULT 0,
  clicks       BIGINT NOT NULL DEFAULT 0,
  conversions  BIGINT NOT NULL DEFAULT 0,
  spend        NUMERIC NOT NULL DEFAULT 0,
  currency     TEXT NOT NULL
);

CREATE INDEX idx_sponsored_placements_placement ON sponsored_placements (placement);
CREATE INDEX idx_sponsored_placements_status ON sponsored_placements (status);

-- ---------------------------------------------------------------------------
-- ad_review_records
-- ---------------------------------------------------------------------------
CREATE TABLE ad_review_records (
  id          UUID PRIMARY KEY,
  target_id   TEXT NOT NULL,
  target_kind TEXT NOT NULL,                -- ad | campaign | creative | advertiser
  checks      TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[], -- AdReviewCheck[]
  status      TEXT NOT NULL DEFAULT 'pending',  -- pending | approved | rejected | needs-review
  decided_by  TEXT,
  decided_at  TIMESTAMPTZ,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- ad_fraud_signals
-- ---------------------------------------------------------------------------
CREATE TABLE ad_fraud_signals (
  id                 UUID PRIMARY KEY,
  campaign_id        TEXT NOT NULL,
  advertiser_id      UUID REFERENCES advertiser_accounts (id) ON DELETE SET NULL,
  type               TEXT NOT NULL,         -- AdFraudType
  severity           TEXT NOT NULL,         -- low | medium | high | critical
  status             TEXT NOT NULL DEFAULT 'open', -- open | investigating | resolved | dismissed
  detected_at        TIMESTAMPTZ NOT NULL,
  description        TEXT NOT NULL,
  evidence           TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  invalid_clicks     BIGINT NOT NULL DEFAULT 0,
  invalid_impressions BIGINT NOT NULL DEFAULT 0,
  invalid_conversions BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_ad_fraud_signals_campaign_id ON ad_fraud_signals (campaign_id);
CREATE INDEX idx_ad_fraud_signals_status ON ad_fraud_signals (status);

-- ============================================================================
-- Scholatia — Phase 1.9B Academic Marketplace
-- SQL-ready schema for the commercial/transactional layer.
--
-- Mirrors the TypeScript models in `types/marketplace.ts`. The Marketplace
-- module is additive: it does NOT own source records. Every listing references
-- an existing record through source_id + source_entity (a project, dataset,
-- journal, conference, funding opportunity, manuscript, publisher, or DOI),
-- every listing is searchable through `toDiscoveryItem(s)`, and every listing
-- is promotable through the `promotable_objects` table from Phase 1.9A.
-- Pricing, discounting, order transitions, coupon validation, dashboards, and
-- analytics are computed by `lib/marketplace.ts`.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- marketplace_vendors
-- ---------------------------------------------------------------------------
CREATE TABLE marketplace_vendors (
  id                  UUID PRIMARY KEY,
  slug                TEXT NOT NULL UNIQUE,
  name                TEXT NOT NULL,
  vendor_type         TEXT NOT NULL,         -- MarketplaceVendorType
  biography           TEXT,
  researcher_username TEXT,                  -- linked researcher identity
  position_title      TEXT,
  institution_id      UUID,
  country             TEXT,
  city                TEXT,
  website             TEXT,
  categories          TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  skills              TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  verified            BOOLEAN NOT NULL DEFAULT FALSE,
  trust_score         INTEGER NOT NULL DEFAULT 70,
  rating              NUMERIC NOT NULL DEFAULT 0,
  review_count        INTEGER NOT NULL DEFAULT 0,
  badges              TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  status              TEXT NOT NULL DEFAULT 'active',  -- active | suspended | archived
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_marketplace_vendors_vendor_type ON marketplace_vendors (vendor_type);
CREATE INDEX idx_marketplace_vendors_researcher_username ON marketplace_vendors (researcher_username);

-- ---------------------------------------------------------------------------
-- marketplace_storefronts
-- ---------------------------------------------------------------------------
CREATE TABLE marketplace_storefronts (
  id           UUID PRIMARY KEY,
  vendor_id    UUID NOT NULL REFERENCES marketplace_vendors (id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  tagline      TEXT,
  description  TEXT,
  store_url    TEXT NOT NULL UNIQUE,
  currency     TEXT NOT NULL,
  categories   TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  featured_listing_ids TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  return_policy TEXT,
  refund_policy TEXT,
  delivery_policy TEXT,
  terms_policy  TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_marketplace_storefronts_vendor_id ON marketplace_storefronts (vendor_id);

-- ---------------------------------------------------------------------------
-- marketplace_listings
-- ---------------------------------------------------------------------------
CREATE TABLE marketplace_listings (
  id                 UUID PRIMARY KEY,
  vendor_id          UUID NOT NULL REFERENCES marketplace_vendors (id) ON DELETE CASCADE,
  storefront_id      UUID REFERENCES marketplace_storefronts (id) ON DELETE SET NULL,
  slug               TEXT NOT NULL UNIQUE,
  title              TEXT NOT NULL,
  listing_type       TEXT NOT NULL,          -- MarketplaceListingType
  category           TEXT NOT NULL,          -- MarketplaceCategory
  subcategory        TEXT,
  description        TEXT NOT NULL,
  price              NUMERIC NOT NULL,
  compare_at_price   NUMERIC,
  currency           TEXT NOT NULL,          -- CurrencyCode
  price_interval     TEXT NOT NULL DEFAULT 'one-time', -- MarketplacePriceInterval
  discount_label     TEXT,
  discount_kind      TEXT,                   -- percent | fixed
  discount_value     NUMERIC,
  status             TEXT NOT NULL DEFAULT 'draft', -- MarketplaceListingStatus
  stage_ids          TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],  -- ResearchLifecycleStageId[]
  career_stages      TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  research_areas     TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  keywords           TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  target_audiences   TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  stock              INTEGER,
  deliverable        TEXT,
  rating             NUMERIC NOT NULL DEFAULT 0,
  review_count       INTEGER NOT NULL DEFAULT 0,
  favorite_count     INTEGER NOT NULL DEFAULT 0,
  view_count         BIGINT NOT NULL DEFAULT 0,
  order_count        INTEGER NOT NULL DEFAULT 0,
  featured           BOOLEAN NOT NULL DEFAULT FALSE,
  sponsored          BOOLEAN NOT NULL DEFAULT FALSE,
  best_seller        BOOLEAN NOT NULL DEFAULT FALSE,
  verified           BOOLEAN NOT NULL DEFAULT FALSE,
  badges             TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  tags               TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  source_entity      TEXT NOT NULL,          -- project | dataset | journal | conference | funding | manuscript | publisher | publication
  source_id          TEXT NOT NULL,          -- original identity (project id, DOI, journal id, ...)
  source_url         TEXT NOT NULL,          -- canonical route to the source record
  url                TEXT NOT NULL,          -- canonical marketplace route
  available_from     TIMESTAMPTZ,
  available_to       TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_marketplace_listings_vendor_id ON marketplace_listings (vendor_id);
CREATE INDEX idx_marketplace_listings_category ON marketplace_listings (category);
CREATE INDEX idx_marketplace_listings_status ON marketplace_listings (status);
CREATE INDEX idx_marketplace_listings_source ON marketplace_listings (source_entity, source_id);

-- ---------------------------------------------------------------------------
-- marketplace_reviews
-- ---------------------------------------------------------------------------
CREATE TABLE marketplace_reviews (
  id            UUID PRIMARY KEY,
  listing_id    UUID NOT NULL REFERENCES marketplace_listings (id) ON DELETE CASCADE,
  reviewer_said TEXT NOT NULL,               -- reviewer's original SAID
  rating        INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title         TEXT,
  comment       TEXT,
  verified_purchase BOOLEAN NOT NULL DEFAULT FALSE,
  helpful_votes INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_marketplace_reviews_listing_id ON marketplace_reviews (listing_id);

-- ---------------------------------------------------------------------------
-- marketplace_orders
-- ---------------------------------------------------------------------------
CREATE TABLE marketplace_orders (
  id                UUID PRIMARY KEY,
  order_number      TEXT NOT NULL UNIQUE,
  buyer_said        TEXT NOT NULL,
  vendor_id         UUID NOT NULL REFERENCES marketplace_vendors (id),
  storefront_id     UUID REFERENCES marketplace_storefronts (id) ON DELETE SET NULL,
  listing_id        UUID REFERENCES marketplace_listings (id) ON DELETE SET NULL,
  quantity          INTEGER NOT NULL DEFAULT 1,
  unit_price        NUMERIC NOT NULL,
  subtotal          NUMERIC NOT NULL,
  discount          NUMERIC NOT NULL DEFAULT 0,
  total             NUMERIC NOT NULL,
  currency          TEXT NOT NULL,
  status            TEXT NOT NULL DEFAULT 'pending', -- MarketplaceOrderStatus
  payment_status    TEXT NOT NULL DEFAULT 'unpaid',  -- MarketplacePaymentStatus
  delivery_date     TIMESTAMPTZ,
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_marketplace_orders_buyer_said ON marketplace_orders (buyer_said);
CREATE INDEX idx_marketplace_orders_vendor_id ON marketplace_orders (vendor_id);
CREATE INDEX idx_marketplace_orders_status ON marketplace_orders (status);

-- ---------------------------------------------------------------------------
-- marketplace_invoices
-- ---------------------------------------------------------------------------
CREATE TABLE marketplace_invoices (
  id          UUID PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  order_id    UUID REFERENCES marketplace_orders (id) ON DELETE CASCADE,
  vendor_id   UUID NOT NULL REFERENCES marketplace_vendors (id),
  buyer_said  TEXT NOT NULL,
  lines       JSONB NOT NULL DEFAULT '[]'::JSONB, -- MarketplaceInvoiceLine[]
  subtotal    NUMERIC NOT NULL,
  tax         NUMERIC NOT NULL DEFAULT 0,
  tax_rate    NUMERIC NOT NULL DEFAULT 0,
  fees        NUMERIC NOT NULL DEFAULT 0,
  total       NUMERIC NOT NULL,
  currency    TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'pending', -- MarketplaceInvoiceStatus
  issued_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  due_at      TIMESTAMPTZ,
  paid_at     TIMESTAMPTZ
);

CREATE INDEX idx_marketplace_invoices_order_id ON marketplace_invoices (order_id);
CREATE INDEX idx_marketplace_invoices_vendor_id ON marketplace_invoices (vendor_id);

-- ---------------------------------------------------------------------------
-- marketplace_payments
-- ---------------------------------------------------------------------------
CREATE TABLE marketplace_payments (
  id              UUID PRIMARY KEY,
  order_id        UUID REFERENCES marketplace_orders (id) ON DELETE CASCADE,
  invoice_id      UUID REFERENCES marketplace_invoices (id) ON DELETE SET NULL,
  buyer_said      TEXT NOT NULL,
  amount          NUMERIC NOT NULL,
  currency        TEXT NOT NULL,
  method          TEXT NOT NULL,             -- MarketplacePaymentMethod
  status          TEXT NOT NULL DEFAULT 'pending', -- MarketplacePaymentStatusRecord
  escrow          BOOLEAN NOT NULL DEFAULT FALSE,
  reference       TEXT,
  gateway         TEXT,
  paid_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_marketplace_payments_order_id ON marketplace_payments (order_id);
CREATE INDEX idx_marketplace_payments_buyer_said ON marketplace_payments (buyer_said);

-- ---------------------------------------------------------------------------
-- marketplace_refunds
-- ---------------------------------------------------------------------------
CREATE TABLE marketplace_refunds (
  id            UUID PRIMARY KEY,
  order_id      UUID NOT NULL REFERENCES marketplace_orders (id) ON DELETE CASCADE,
  listing_id    UUID REFERENCES marketplace_listings (id) ON DELETE SET NULL,
  buyer_said    TEXT NOT NULL,
  amount        NUMERIC NOT NULL,
  currency      TEXT NOT NULL,
  reason        TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'requested', -- MarketplaceRefundStatus
  decision      TEXT,                         -- approved | rejected | partially-approved
  decided_by    TEXT,
  decided_at    TIMESTAMPTZ,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_marketplace_refunds_order_id ON marketplace_refunds (order_id);

-- ---------------------------------------------------------------------------
-- marketplace_disputes
-- ---------------------------------------------------------------------------
CREATE TABLE marketplace_disputes (
  id            UUID PRIMARY KEY,
  order_id      UUID NOT NULL REFERENCES marketplace_orders (id) ON DELETE CASCADE,
  listing_id    UUID REFERENCES marketplace_listings (id) ON DELETE SET NULL,
  buyer_said    TEXT NOT NULL,
  severity      TEXT NOT NULL DEFAULT 'moderate', -- MarketplaceDisputeSeverity
  status        TEXT NOT NULL DEFAULT 'open',    -- MarketplaceDisputeStatus
  subject       TEXT NOT NULL,
  description   TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- marketplace_dispute_messages
-- ---------------------------------------------------------------------------
CREATE TABLE marketplace_dispute_messages (
  id          UUID PRIMARY KEY,
  dispute_id  UUID NOT NULL REFERENCES marketplace_disputes (id) ON DELETE CASCADE,
  sender_said TEXT NOT NULL,
  message     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_marketplace_dispute_messages_dispute_id ON marketplace_dispute_messages (dispute_id);

-- ---------------------------------------------------------------------------
-- marketplace_coupons
-- ---------------------------------------------------------------------------
CREATE TABLE marketplace_coupons (
  id            UUID PRIMARY KEY,
  code          TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  description   TEXT,
  kind          TEXT NOT NULL,               -- MarketplaceCouponType
  value         NUMERIC NOT NULL,
  currency      TEXT,
  applies_to    TEXT NOT NULL,               -- MarketplaceCouponAppliesTo
  target_id     UUID,                        -- listing / vendor / category
  min_spend     NUMERIC NOT NULL DEFAULT 0,
  max_uses      INTEGER NOT NULL DEFAULT 0,
  uses          INTEGER NOT NULL DEFAULT 0,
  status        TEXT NOT NULL DEFAULT 'active', -- MarketplaceCouponStatus
  starts_at     TIMESTAMPTZ NOT NULL,
  ends_at       TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_marketplace_coupons_applies_to ON marketplace_coupons (applies_to);

-- ---------------------------------------------------------------------------
-- marketplace_promotions
-- ---------------------------------------------------------------------------
CREATE TABLE marketplace_promotions (
  id              UUID PRIMARY KEY,
  name            TEXT NOT NULL,
  kind            TEXT NOT NULL,             -- MarketplacePromotionKind
  discount_label  TEXT,
  discount_type   TEXT,                      -- percent | fixed
  discount_value  NUMERIC NOT NULL,
  currency        TEXT,
  listing_ids     TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  status          TEXT NOT NULL DEFAULT 'scheduled', -- active | upcoming | ended | paused
  starts_at       TIMESTAMPTZ NOT NULL,
  ends_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_marketplace_promotions_kind ON marketplace_promotions (kind);
CREATE INDEX idx_marketplace_promotions_status ON marketplace_promotions (status);

-- ---------------------------------------------------------------------------
-- marketplace_bundles
-- ---------------------------------------------------------------------------
CREATE TABLE marketplace_bundles (
  id               UUID PRIMARY KEY,
  name             TEXT NOT NULL,
  description      TEXT,
  vendor_id        UUID NOT NULL REFERENCES marketplace_vendors (id) ON DELETE CASCADE,
  list_total       NUMERIC NOT NULL,
  bundle_price     NUMERIC NOT NULL,
  savings          NUMERIC NOT NULL,
  currency         TEXT NOT NULL,
  listing_ids      TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  status           TEXT NOT NULL DEFAULT 'active', -- active | archived
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_marketplace_bundles_vendor_id ON marketplace_bundles (vendor_id);

-- ---------------------------------------------------------------------------
-- marketplace_bookings
-- ---------------------------------------------------------------------------
CREATE TABLE marketplace_bookings (
  id            UUID PRIMARY KEY,
  listing_id    UUID NOT NULL REFERENCES marketplace_listings (id) ON DELETE CASCADE,
  buyer_said    TEXT NOT NULL,
  starts_at     TIMESTAMPTZ NOT NULL,
  ends_at       TIMESTAMPTZ NOT NULL,
  duration_hours NUMERIC NOT NULL,
  timezone      TEXT,
  location      TEXT,
  online        BOOLEAN NOT NULL DEFAULT TRUE,
  status        TEXT NOT NULL DEFAULT 'pending', -- MarketplaceBookingStatus
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_marketplace_bookings_listing_id ON marketplace_bookings (listing_id);
CREATE INDEX idx_marketplace_bookings_status ON marketplace_bookings (status);

-- ---------------------------------------------------------------------------
-- marketplace_conversations
-- ---------------------------------------------------------------------------
CREATE TABLE marketplace_conversations (
  id          UUID PRIMARY KEY,
  order_id    UUID REFERENCES marketplace_orders (id) ON DELETE SET NULL,
  listing_id  UUID REFERENCES marketplace_listings (id) ON DELETE SET NULL,
  buyer_said  TEXT NOT NULL,
  vendor_id   UUID NOT NULL REFERENCES marketplace_vendors (id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- marketplace_messages
-- ---------------------------------------------------------------------------
CREATE TABLE marketplace_messages (
  id              UUID PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES marketplace_conversations (id) ON DELETE CASCADE,
  sender_said     TEXT NOT NULL,
  receiver_said   TEXT NOT NULL,
  body            TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_marketplace_messages_conversation_id ON marketplace_messages (conversation_id);

-- ---------------------------------------------------------------------------
-- marketplace_notifications
-- ---------------------------------------------------------------------------
CREATE TABLE marketplace_notifications (
  id            UUID PRIMARY KEY,
  type          TEXT NOT NULL,               -- MarketplaceNotificationType
  recipient_said TEXT NOT NULL,
  message       TEXT NOT NULL,
  read          BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_marketplace_notifications_recipient ON marketplace_notifications (recipient_said);

-- ---------------------------------------------------------------------------
-- marketplace_wishlists
-- ---------------------------------------------------------------------------
CREATE TABLE marketplace_wishlists (
  id          UUID PRIMARY KEY,
  name        TEXT NOT NULL,
  owner_said  TEXT NOT NULL,
  listing_ids TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_marketplace_wishlists_owner ON marketplace_wishlists (owner_said);

-- ---------------------------------------------------------------------------
-- marketplace_recently_viewed
-- ---------------------------------------------------------------------------
CREATE TABLE marketplace_recently_viewed (
  id          UUID PRIMARY KEY,
  owner_said  TEXT NOT NULL,
  listing_id  UUID NOT NULL REFERENCES marketplace_listings (id) ON DELETE CASCADE,
  viewed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_marketplace_recently_viewed_owner ON marketplace_recently_viewed (owner_said);

-- ---------------------------------------------------------------------------
-- marketplace_guest_advertisers
-- ---------------------------------------------------------------------------
CREATE TABLE marketplace_guest_advertisers (
  id             UUID PRIMARY KEY,
  company_name   TEXT NOT NULL,
  representative_name  TEXT,
  representative_email TEXT,
  industry       TEXT,
  country        TEXT,
  website        TEXT,
  campaign_ids   TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],  -- linked ad_campaigns
  listing_ids    TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],  -- promoted marketplace listings
  total_spend    NUMERIC NOT NULL DEFAULT 0,
  conversions    BIGINT NOT NULL DEFAULT 0,
  roi            NUMERIC NOT NULL DEFAULT 0,
  impressions    BIGINT NOT NULL DEFAULT 0,
  clicks         BIGINT NOT NULL DEFAULT 0,
  verified       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- marketplace_recommendations
-- ---------------------------------------------------------------------------
CREATE TABLE marketplace_recommendations (
  id            UUID PRIMARY KEY,
  type          TEXT NOT NULL,               -- MarketplaceRecommendationType
  score         NUMERIC NOT NULL,
  confidence    TEXT NOT NULL,               -- IntelligenceConfidence
  target_audiences TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  reasons       TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  tags          TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  source_entity TEXT,                        -- bridge entity type (DiscoveryEntityType)
  source_id     TEXT,
  url           TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_marketplace_recommendations_type ON marketplace_recommendations (type);

-- ===========================================================================
-- Commerce & Marketplace Engine (Phase 1.9B)
--
-- The financial operating system of the Scholatia ecosystem. These tables
-- store the transactional, wallet, subscription, commission, escrow,
-- settlement, and revenue-reporting records behind the Commerce module.
-- They do NOT duplicate marketplace or advertising records — every product,
-- order, wallet transaction, invoice, receipt, commission, escrow, and
-- settlement references an existing source record. Payment providers are
-- modelled as a provider-independent gateway abstraction; no live payment
-- API or credentials are used.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- commerce_products
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_products (
  id            UUID PRIMARY KEY,
  sku           TEXT NOT NULL,
  name          TEXT NOT NULL,
  summary       TEXT NOT NULL,
  description   TEXT,
  type          TEXT NOT NULL,               -- CommerceProductType
  category      TEXT NOT NULL,
  price_amount  NUMERIC NOT NULL,
  currency      TEXT NOT NULL,
  price_interval TEXT,                       -- CommercePriceInterval
  compare_at    NUMERIC,
  stock         INTEGER,
  vendor_id     UUID REFERENCES marketplace_vendors (id) ON DELETE SET NULL,
  source_id     TEXT,
  source_entity TEXT,
  status        TEXT NOT NULL DEFAULT 'active', -- CommerceProductStatus
  tags          TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  featured      BOOLEAN NOT NULL DEFAULT FALSE,
  created_date  DATE NOT NULL DEFAULT CURRENT_DATE,
  last_updated  DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE INDEX idx_commerce_products_vendor_id ON commerce_products (vendor_id);
CREATE INDEX idx_commerce_products_type ON commerce_products (type);
CREATE INDEX idx_commerce_products_status ON commerce_products (status);

-- ---------------------------------------------------------------------------
-- commerce_carts
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_carts (
  id            UUID PRIMARY KEY,
  owner_said    TEXT,
  coupon_code   TEXT,                        -- resolved through commerce_coupons
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- commerce_cart_items
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_cart_items (
  id            UUID PRIMARY KEY,
  cart_id       UUID NOT NULL REFERENCES commerce_carts (id) ON DELETE CASCADE,
  product_id    UUID NOT NULL REFERENCES commerce_products (id) ON DELETE CASCADE,
  quantity      INTEGER NOT NULL DEFAULT 1,
  unit_price    NUMERIC NOT NULL,
  currency      TEXT NOT NULL,
  vendor_id     UUID REFERENCES marketplace_vendors (id) ON DELETE SET NULL,
  promotable_object_id TEXT
);

CREATE INDEX idx_commerce_cart_items_cart_id ON commerce_cart_items (cart_id);

-- ---------------------------------------------------------------------------
-- commerce_orders
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_orders (
  id             UUID PRIMARY KEY,
  order_number   TEXT NOT NULL,
  buyer_said     TEXT,
  buyer_name     TEXT NOT NULL,
  buyer_email    TEXT,
  status         TEXT NOT NULL DEFAULT 'pending', -- CommerceOrderStatus
  payment_status TEXT NOT NULL DEFAULT 'unpaid',  -- CommercePaymentStatus
  payment_method TEXT,                            -- CommercePaymentMethod
  subtotal       NUMERIC NOT NULL,
  discount       NUMERIC NOT NULL DEFAULT 0,
  coupon_code    TEXT,
  tax            NUMERIC NOT NULL DEFAULT 0,
  platform_fee   NUMERIC NOT NULL DEFAULT 0,
  total          NUMERIC NOT NULL,
  currency       TEXT NOT NULL,
  invoice_id     TEXT,
  receipt_id     TEXT,
  notes          TEXT,
  placed_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at   TIMESTAMPTZ
);

CREATE INDEX idx_commerce_orders_buyer ON commerce_orders (buyer_said);
CREATE INDEX idx_commerce_orders_status ON commerce_orders (status);
CREATE INDEX idx_commerce_orders_placed_at ON commerce_orders (placed_at);

-- ---------------------------------------------------------------------------
-- commerce_order_items
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_order_items (
  id         UUID PRIMARY KEY,
  order_id   UUID NOT NULL REFERENCES commerce_orders (id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES commerce_products (id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  sku        TEXT NOT NULL,
  quantity   INTEGER NOT NULL,
  unit_price NUMERIC NOT NULL,
  discount   NUMERIC NOT NULL DEFAULT 0,
  total      NUMERIC NOT NULL
);

CREATE INDEX idx_commerce_order_items_order_id ON commerce_order_items (order_id);

-- ---------------------------------------------------------------------------
-- commerce_payment_intents
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_payment_intents (
  id            UUID PRIMARY KEY,
  order_id      UUID REFERENCES commerce_orders (id) ON DELETE SET NULL,
  amount        NUMERIC NOT NULL,
  currency      TEXT NOT NULL,
  method        TEXT NOT NULL,               -- CommercePaymentMethod
  provider      TEXT NOT NULL,               -- CommercePaymentProvider
  description   TEXT NOT NULL,
  metadata      JSONB NOT NULL DEFAULT '{}'::JSONB,
  status        TEXT NOT NULL DEFAULT 'created', -- created | authorized | captured | failed | cancelled
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_commerce_payment_intents_order_id ON commerce_payment_intents (order_id);

-- ---------------------------------------------------------------------------
-- commerce_payments
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_payments (
  id            UUID PRIMARY KEY,
  order_id      UUID REFERENCES commerce_orders (id) ON DELETE SET NULL,
  invoice_id    TEXT,
  amount        NUMERIC NOT NULL,
  currency      TEXT NOT NULL,
  method        TEXT NOT NULL,               -- CommercePaymentMethod
  provider      TEXT NOT NULL,               -- CommercePaymentProvider
  status        TEXT NOT NULL DEFAULT 'paid', -- CommercePaymentStatus
  escrowed      BOOLEAN NOT NULL DEFAULT FALSE,
  reference     TEXT,
  intent_id     TEXT,
  date          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_commerce_payments_order_id ON commerce_payments (order_id);

-- ---------------------------------------------------------------------------
-- commerce_refunds
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_refunds (
  id            UUID PRIMARY KEY,
  refund_number TEXT NOT NULL,
  order_id      UUID NOT NULL REFERENCES commerce_orders (id) ON DELETE CASCADE,
  payment_id    TEXT,
  amount        NUMERIC NOT NULL,
  currency      TEXT NOT NULL,
  reason        TEXT NOT NULL,               -- CommerceRefundReason
  note          TEXT,
  status        TEXT NOT NULL DEFAULT 'requested', -- CommerceRefundStatus
  requested_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  decided_at    TIMESTAMPTZ,
  decided_by    TEXT
);

CREATE INDEX idx_commerce_refunds_order_id ON commerce_refunds (order_id);

-- ---------------------------------------------------------------------------
-- commerce_invoices
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_invoices (
  id            UUID PRIMARY KEY,
  invoice_number TEXT NOT NULL,
  order_id      UUID REFERENCES commerce_orders (id) ON DELETE SET NULL,
  buyer_said    TEXT,
  buyer_name    TEXT NOT NULL,
  subtotal      NUMERIC NOT NULL,
  discount      NUMERIC NOT NULL DEFAULT 0,
  tax           NUMERIC NOT NULL DEFAULT 0,
  fees          NUMERIC NOT NULL DEFAULT 0,
  total         NUMERIC NOT NULL,
  currency      TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'draft', -- CommerceInvoiceStatus
  issued_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  due_at        TIMESTAMPTZ,
  paid_at       TIMESTAMPTZ
);

CREATE INDEX idx_commerce_invoices_order_id ON commerce_invoices (order_id);

-- ---------------------------------------------------------------------------
-- commerce_receipts
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_receipts (
  id            UUID PRIMARY KEY,
  receipt_number TEXT NOT NULL,
  order_id      UUID REFERENCES commerce_orders (id) ON DELETE SET NULL,
  invoice_id    TEXT,
  buyer_said    TEXT,
  buyer_name    TEXT NOT NULL,
  subtotal      NUMERIC NOT NULL,
  discount      NUMERIC NOT NULL DEFAULT 0,
  tax           NUMERIC NOT NULL DEFAULT 0,
  total         NUMERIC NOT NULL,
  currency      TEXT NOT NULL,
  paid_at       TIMESTAMPTZ NOT NULL,
  payment_method TEXT,
  status        TEXT NOT NULL DEFAULT 'issued', -- CommerceReceiptStatus
  merchant_name TEXT NOT NULL DEFAULT 'Scholatia'
);

-- ---------------------------------------------------------------------------
-- commerce_coupons
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_coupons (
  id               UUID PRIMARY KEY,
  code             TEXT NOT NULL UNIQUE,
  title            TEXT NOT NULL,
  description      TEXT,
  type             TEXT NOT NULL,            -- percent | fixed
  value            NUMERIC NOT NULL,
  applies_to       TEXT NOT NULL,            -- CommerceCouponAppliesTo
  target_id        TEXT,
  minimum_spend    NUMERIC,
  maximum_discount NUMERIC,
  usage_limit      INTEGER,
  times_used       INTEGER NOT NULL DEFAULT 0,
  valid_from       DATE NOT NULL,
  valid_until      DATE NOT NULL,
  status           TEXT NOT NULL DEFAULT 'active' -- CommerceCouponStatus
);

CREATE INDEX idx_commerce_coupons_status ON commerce_coupons (status);

-- ---------------------------------------------------------------------------
-- commerce_promotions
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_promotions (
  id            UUID PRIMARY KEY,
  name          TEXT NOT NULL,
  description   TEXT,
  kind          TEXT NOT NULL,               -- CommercePromotionKind
  discount_kind TEXT NOT NULL,               -- percent | fixed
  discount_value NUMERIC NOT NULL,
  starts_at     DATE NOT NULL,
  ends_at       DATE NOT NULL,
  product_ids   TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  budget        NUMERIC,
  currency      TEXT
);

CREATE INDEX idx_commerce_promotions_kind ON commerce_promotions (kind);

-- ---------------------------------------------------------------------------
-- commerce_wallets
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_wallets (
  id              UUID PRIMARY KEY,
  owner_said      TEXT NOT NULL,
  owner_name      TEXT NOT NULL,
  currency        TEXT NOT NULL,
  balance         NUMERIC NOT NULL DEFAULT 0,
  available_balance NUMERIC NOT NULL DEFAULT 0,
  pending_balance NUMERIC NOT NULL DEFAULT 0,
  frozen_balance  NUMERIC NOT NULL DEFAULT 0,
  lifetime_credits NUMERIC NOT NULL DEFAULT 0,
  lifetime_debits  NUMERIC NOT NULL DEFAULT 0,
  status          TEXT NOT NULL DEFAULT 'active', -- CommerceWalletStatus
  created_at      DATE NOT NULL DEFAULT CURRENT_DATE,
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_commerce_wallets_owner ON commerce_wallets (owner_said);

-- ---------------------------------------------------------------------------
-- commerce_wallet_transactions
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_wallet_transactions (
  id            UUID PRIMARY KEY,
  wallet_id     UUID NOT NULL REFERENCES commerce_wallets (id) ON DELETE CASCADE,
  reference     TEXT NOT NULL,
  type          TEXT NOT NULL,               -- CommerceWalletTransactionType
  amount        NUMERIC NOT NULL,
  direction     TEXT NOT NULL,               -- credit | debit
  balance_after NUMERIC NOT NULL,
  currency      TEXT NOT NULL,
  description   TEXT NOT NULL,
  source_id     TEXT,
  source_entity TEXT,
  status        TEXT NOT NULL DEFAULT 'completed', -- CommerceWalletTransactionStatus
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_commerce_wallet_transactions_wallet_id ON commerce_wallet_transactions (wallet_id);
CREATE INDEX idx_commerce_wallet_transactions_created_at ON commerce_wallet_transactions (created_at);

-- ---------------------------------------------------------------------------
-- commerce_subscription_plans
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_subscription_plans (
  id              UUID PRIMARY KEY,
  name            TEXT NOT NULL,
  description     TEXT,
  subscriber_type TEXT NOT NULL,             -- CommerceSubscriberType
  price_amount    NUMERIC NOT NULL,
  currency        TEXT NOT NULL,
  price_interval  TEXT,                      -- CommercePriceInterval
  billing_cycle   TEXT NOT NULL DEFAULT 'monthly', -- monthly | quarterly | annual
  features        TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  featured        BOOLEAN NOT NULL DEFAULT FALSE,
  status          TEXT NOT NULL DEFAULT 'active' -- active | disabled
);

-- ---------------------------------------------------------------------------
-- commerce_subscriptions
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_subscriptions (
  id              UUID PRIMARY KEY,
  subscriber_said TEXT NOT NULL,
  subscriber_name TEXT NOT NULL,
  subscriber_type TEXT NOT NULL,             -- CommerceSubscriberType
  plan_id         UUID NOT NULL REFERENCES commerce_subscription_plans (id) ON DELETE RESTRICT,
  price           NUMERIC NOT NULL,
  currency        TEXT NOT NULL,
  billing_cycle   TEXT NOT NULL,             -- monthly | quarterly | annual
  status          TEXT NOT NULL DEFAULT 'active', -- CommerceSubscriptionStatus
  started_at      DATE NOT NULL,
  next_billing_at DATE NOT NULL,
  cancelled_at    DATE,
  auto_renew      BOOLEAN NOT NULL DEFAULT TRUE,
  seats           INTEGER
);

CREATE INDEX idx_commerce_subscriptions_subscriber ON commerce_subscriptions (subscriber_said);
CREATE INDEX idx_commerce_subscriptions_plan_id ON commerce_subscriptions (plan_id);

-- ---------------------------------------------------------------------------
-- commerce_commissions
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_commissions (
  id            UUID PRIMARY KEY,
  order_id      UUID NOT NULL REFERENCES commerce_orders (id) ON DELETE CASCADE,
  vendor_id     UUID NOT NULL REFERENCES marketplace_vendors (id) ON DELETE CASCADE,
  gross_amount  NUMERIC NOT NULL,
  rate_percent  NUMERIC NOT NULL,
  amount        NUMERIC NOT NULL,
  currency      TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending', -- pending | due | paid
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at       TIMESTAMPTZ
);

CREATE INDEX idx_commerce_commissions_vendor_id ON commerce_commissions (vendor_id);

-- ---------------------------------------------------------------------------
-- commerce_escrows
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_escrows (
  id            UUID PRIMARY KEY,
  order_id      UUID NOT NULL REFERENCES commerce_orders (id) ON DELETE CASCADE,
  buyer_said    TEXT,
  vendor_id     UUID NOT NULL REFERENCES marketplace_vendors (id) ON DELETE CASCADE,
  amount        NUMERIC NOT NULL,
  currency      TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'holding', -- CommerceEscrowStatus
  held_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  released_at   TIMESTAMPTZ,
  released_to   TEXT,
  note          TEXT
);

CREATE INDEX idx_commerce_escrows_status ON commerce_escrows (status);

-- ---------------------------------------------------------------------------
-- commerce_vendor_earnings
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_vendor_earnings (
  id                UUID PRIMARY KEY,
  vendor_id         UUID NOT NULL REFERENCES marketplace_vendors (id) ON DELETE CASCADE,
  vendor_name       TEXT NOT NULL,
  currency          TEXT NOT NULL,
  gross_sales       NUMERIC NOT NULL DEFAULT 0,
  commissions       NUMERIC NOT NULL DEFAULT 0,
  platform_fees     NUMERIC NOT NULL DEFAULT 0,
  refunds           NUMERIC NOT NULL DEFAULT 0,
  adjustments       NUMERIC NOT NULL DEFAULT 0,
  net_earnings      NUMERIC NOT NULL DEFAULT 0,
  available_balance NUMERIC NOT NULL DEFAULT 0,
  pending_balance   NUMERIC NOT NULL DEFAULT 0,
  lifetime_earnings NUMERIC NOT NULL DEFAULT 0,
  period_start      DATE NOT NULL,
  period_end        DATE NOT NULL
);

CREATE INDEX idx_commerce_vendor_earnings_vendor_id ON commerce_vendor_earnings (vendor_id);

-- ---------------------------------------------------------------------------
-- commerce_settlements
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_settlements (
  id            UUID PRIMARY KEY,
  vendor_id     UUID NOT NULL REFERENCES marketplace_vendors (id) ON DELETE CASCADE,
  vendor_name   TEXT NOT NULL,
  reference     TEXT NOT NULL,
  amount        NUMERIC NOT NULL,
  currency      TEXT NOT NULL,
  provider      TEXT NOT NULL,               -- CommercePaymentProvider
  status        TEXT NOT NULL DEFAULT 'scheduled', -- CommerceSettlementStatus
  scheduled_at  TIMESTAMPTZ NOT NULL,
  completed_at  TIMESTAMPTZ
);

CREATE INDEX idx_commerce_settlements_vendor_id ON commerce_settlements (vendor_id);
CREATE INDEX idx_commerce_settlements_status ON commerce_settlements (status);

-- ---------------------------------------------------------------------------
-- commerce_transactions (ledger for revenue reporting)
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_transactions (
  id                  UUID PRIMARY KEY,
  reference           TEXT NOT NULL,
  kind                TEXT NOT NULL,         -- CommerceTransactionKind
  amount              NUMERIC NOT NULL,
  currency            TEXT NOT NULL,
  status              TEXT NOT NULL,         -- CommercePaymentStatus
  method              TEXT,
  provider            TEXT,
  order_id            UUID REFERENCES commerce_orders (id) ON DELETE SET NULL,
  subscription_id     TEXT,
  wallet_transaction_id TEXT,
  description         TEXT NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_commerce_transactions_kind ON commerce_transactions (kind);
CREATE INDEX idx_commerce_transactions_created_at ON commerce_transactions (created_at);

-- ---------------------------------------------------------------------------
-- commerce_tax_rates
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_tax_rates (
  id            UUID PRIMARY KEY,
  name          TEXT NOT NULL,
  jurisdiction  TEXT NOT NULL,
  rate_percent  NUMERIC NOT NULL,
  applies_to    TEXT NOT NULL DEFAULT 'all'  -- goods | services | digital | all
);

-- ---------------------------------------------------------------------------
-- commerce_platform_fees
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_platform_fees (
  id            UUID PRIMARY KEY,
  scope         TEXT NOT NULL,               -- CommercePlatformFeeScope
  rate_percent  NUMERIC NOT NULL,
  minimum       NUMERIC,
  maximum       NUMERIC,
  description   TEXT NOT NULL
);

-- ---------------------------------------------------------------------------
-- commerce_gateway_providers (provider-independent abstraction)
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_gateway_providers (
  id               UUID PRIMARY KEY,
  provider         TEXT NOT NULL UNIQUE,     -- CommercePaymentProvider
  display_name     TEXT NOT NULL,
  enabled          BOOLEAN NOT NULL DEFAULT FALSE,
  sandbox          BOOLEAN NOT NULL DEFAULT TRUE,
  capabilities_currencies TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  capabilities_methods    TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  recurring        BOOLEAN NOT NULL DEFAULT FALSE,
  supports_escrow   BOOLEAN NOT NULL DEFAULT FALSE,
  supports_refunds  BOOLEAN NOT NULL DEFAULT FALSE,
  supports_payouts  BOOLEAN NOT NULL DEFAULT FALSE,
  verification     BOOLEAN NOT NULL DEFAULT FALSE,
  supported_methods TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[]
);

-- ---------------------------------------------------------------------------
-- commerce_billing_addresses
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_billing_addresses (
  id            UUID PRIMARY KEY,
  full_name     TEXT NOT NULL,
  line1         TEXT NOT NULL,
  line2         TEXT,
  city          TEXT NOT NULL,
  state         TEXT,
  postal_code   TEXT,
  country       TEXT NOT NULL,
  phone         TEXT,
  email         TEXT,
  is_default    BOOLEAN NOT NULL DEFAULT FALSE
);

-- ---------------------------------------------------------------------------
-- commerce_currencies
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_currencies (
  code         TEXT PRIMARY KEY,               -- CurrencyCode
  name         TEXT NOT NULL,
  symbol       TEXT NOT NULL,
  minor_unit   INTEGER NOT NULL DEFAULT 2,
  supported    BOOLEAN NOT NULL DEFAULT FALSE  -- designated settlement rail
);

-- ---------------------------------------------------------------------------
-- commerce_exchange_rates
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_exchange_rates (
  id          UUID PRIMARY KEY,
  from_code   TEXT NOT NULL REFERENCES commerce_currencies (code),
  to_code     TEXT NOT NULL REFERENCES commerce_currencies (code),
  rate        NUMERIC NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (from_code <> to_code)
);

CREATE INDEX idx_commerce_exchange_rates_pair ON commerce_exchange_rates (from_code, to_code);

-- ---------------------------------------------------------------------------
-- commerce_bundles
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_bundles (
  id               UUID PRIMARY KEY,
  name             TEXT NOT NULL,
  description      TEXT NOT NULL,
  currency         TEXT NOT NULL,
  list_total       NUMERIC NOT NULL,
  bundle_price     NUMERIC NOT NULL,
  savings          NUMERIC NOT NULL,
  savings_percent  INTEGER NOT NULL,
  status           TEXT NOT NULL DEFAULT 'active', -- CommerceBundleStatus
  featured         BOOLEAN NOT NULL DEFAULT FALSE,
  tags             TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[]
);

-- ---------------------------------------------------------------------------
-- commerce_bundle_products
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_bundle_products (
  bundle_id   UUID NOT NULL REFERENCES commerce_bundles (id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES commerce_products (id) ON DELETE CASCADE,
  position    INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (bundle_id, product_id)
);

-- ---------------------------------------------------------------------------
-- commerce_product_variants
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_product_variants (
  id            UUID PRIMARY KEY,
  product_id    UUID NOT NULL REFERENCES commerce_products (id) ON DELETE CASCADE,
  sku           TEXT NOT NULL,
  name          TEXT NOT NULL,
  attributes    JSONB NOT NULL DEFAULT '{}'::JSONB,
  unit_price    NUMERIC NOT NULL,
  currency      TEXT NOT NULL,
  stock         INTEGER,
  status        TEXT NOT NULL DEFAULT 'active' -- CommerceProductStatus
);

CREATE INDEX idx_commerce_product_variants_product_id ON commerce_product_variants (product_id);

-- ---------------------------------------------------------------------------
-- commerce_licenses
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_licenses (
  id              UUID PRIMARY KEY,
  license_number  TEXT NOT NULL,
  product_id      UUID NOT NULL REFERENCES commerce_products (id) ON DELETE CASCADE,
  product_name    TEXT NOT NULL,
  licensee_id     TEXT NOT NULL,
  licensee_name   TEXT NOT NULL,
  licensee_type   TEXT NOT NULL,               -- CommerceLicenseeType
  seats           INTEGER NOT NULL,
  term_months     INTEGER NOT NULL,
  price           NUMERIC NOT NULL,
  currency        TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'active', -- CommerceLicenseStatus
  starts_at       TIMESTAMPTZ NOT NULL,
  expires_at      TIMESTAMPTZ NOT NULL,
  issued_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_commerce_licenses_product_id ON commerce_licenses (product_id);
CREATE INDEX idx_commerce_licenses_licensee_id ON commerce_licenses (licensee_id);

-- ---------------------------------------------------------------------------
-- commerce_purchase_history
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_purchase_history (
  id            UUID PRIMARY KEY,
  order_id      UUID NOT NULL REFERENCES commerce_orders (id) ON DELETE CASCADE,
  product_id    UUID NOT NULL REFERENCES commerce_products (id) ON DELETE CASCADE,
  product_name  TEXT NOT NULL,
  product_type  TEXT NOT NULL,                 -- CommerceProductType
  quantity      INTEGER NOT NULL,
  unit_price    NUMERIC NOT NULL,
  total         NUMERIC NOT NULL,
  currency      TEXT NOT NULL,
  purchased_at  TIMESTAMPTZ NOT NULL,
  source_entity TEXT
);

CREATE INDEX idx_commerce_purchase_history_order_id ON commerce_purchase_history (order_id);
CREATE INDEX idx_commerce_purchase_history_product_id ON commerce_purchase_history (product_id);

-- ---------------------------------------------------------------------------
-- commerce_participant_earnings
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_participant_earnings (
  id                UUID PRIMARY KEY,
  participant_type  TEXT NOT NULL,             -- CommerceRevenueParticipantType
  participant_id    TEXT NOT NULL,
  participant_name  TEXT NOT NULL,
  currency          TEXT NOT NULL,
  gross_revenue     NUMERIC NOT NULL,
  platform_fees     NUMERIC NOT NULL DEFAULT 0,
  commissions       NUMERIC NOT NULL DEFAULT 0,
  refunds           NUMERIC NOT NULL DEFAULT 0,
  net_revenue       NUMERIC NOT NULL,
  available_balance NUMERIC NOT NULL DEFAULT 0,
  pending_balance   NUMERIC NOT NULL DEFAULT 0,
  lifetime_revenue  NUMERIC NOT NULL,
  period_start      DATE NOT NULL,
  period_end        DATE NOT NULL
);

CREATE INDEX idx_commerce_participant_earnings_type ON commerce_participant_earnings (participant_type, participant_id);

-- ---------------------------------------------------------------------------
-- commerce_relationships
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_relationships (
  id           UUID PRIMARY KEY,
  kind         TEXT NOT NULL,                  -- CommerceRelationshipKind
  from_entity  TEXT NOT NULL,
  from_id      TEXT NOT NULL,
  to_entity    TEXT NOT NULL,
  to_id        TEXT NOT NULL,
  description  TEXT NOT NULL
);

CREATE INDEX idx_commerce_relationships_from ON commerce_relationships (from_entity, from_id);
CREATE INDEX idx_commerce_relationships_to ON commerce_relationships (to_entity, to_id);

-- ---------------------------------------------------------------------------
-- commerce_lifecycle_coverage
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_lifecycle_coverage (
  stage                 TEXT PRIMARY KEY,      -- ResearchLifecycleStageId
  stage_name            TEXT NOT NULL,
  revenue_stream        TEXT NOT NULL,
  surfaces              TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  example_product_ids   TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[]
);

-- ---------------------------------------------------------------------------
-- commerce_payment_methods (Phase 2.0)
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_payment_methods (
  id            UUID PRIMARY KEY,
  method        TEXT NOT NULL UNIQUE,          -- CommercePaymentMethod
  label         TEXT NOT NULL,
  supported_providers TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  recurring     BOOLEAN NOT NULL DEFAULT FALSE,
  escrow        BOOLEAN NOT NULL DEFAULT FALSE,
  enabled       BOOLEAN NOT NULL DEFAULT TRUE
);

-- ---------------------------------------------------------------------------
-- commerce_financial_reports (Phase 2.0)
-- ---------------------------------------------------------------------------
CREATE TABLE commerce_financial_reports (
  id              UUID PRIMARY KEY,
  period          TEXT NOT NULL,               -- 'YYYY-MM' accounting period
  currency        TEXT NOT NULL,
  gross_revenue   NUMERIC NOT NULL,
  platform_fees   NUMERIC NOT NULL DEFAULT 0,
  commissions     NUMERIC NOT NULL DEFAULT 0,
  refunds         NUMERIC NOT NULL DEFAULT 0,
  net_revenue     NUMERIC NOT NULL,
  revenue_streams JSONB NOT NULL DEFAULT '[]'::JSONB,
  generated_at    DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE INDEX idx_commerce_financial_reports_period ON commerce_financial_reports (period);

-- ---------------------------------------------------------------------------
-- service_providers (Phase 2.1)
-- ---------------------------------------------------------------------------
CREATE TABLE service_providers (
  id                UUID PRIMARY KEY,
  username          TEXT NOT NULL UNIQUE,
  name              TEXT NOT NULL,
  type              TEXT NOT NULL,                -- ServiceProviderType
  avatar            TEXT,
  headline          TEXT NOT NULL,
  tagline           TEXT NOT NULL,
  description       TEXT NOT NULL,
  country           TEXT NOT NULL,
  city              TEXT,
  institution       TEXT,
  institution_id    UUID,
  institution_said  TEXT,
  position          TEXT,                         -- ResearcherPositionType
  department        TEXT,
  researcher_username TEXT,                       -- reused researcher identity
  researcher_said   TEXT,
  verified          BOOLEAN NOT NULL DEFAULT FALSE,
  trust_score       NUMERIC NOT NULL DEFAULT 0,
  badges            TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],  -- ServiceProviderBadge[]
  rating_average    NUMERIC NOT NULL DEFAULT 0,
  rating_count      INTEGER NOT NULL DEFAULT 0,
  rating_distribution JSONB NOT NULL DEFAULT '{"1":0,"2":0,"3":0,"4":0,"5":0}'::JSONB,
  response_time     TEXT NOT NULL,
  completed_jobs    INTEGER NOT NULL DEFAULT 0,
  completed_jobs_value NUMERIC NOT NULL DEFAULT 0,
  success_rate      NUMERIC NOT NULL DEFAULT 0,
  languages         TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  specializations   TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  availability_status TEXT NOT NULL DEFAULT 'available',  -- ServiceProviderAvailabilityStatus
  open_slots        INTEGER NOT NULL DEFAULT 0,
  next_available    TEXT,
  weekly_hours      NUMERIC NOT NULL DEFAULT 0,
  member_since      TIMESTAMPTZ NOT NULL,
  joined_at         TIMESTAMPTZ NOT NULL,
  followers         INTEGER NOT NULL DEFAULT 0,
  service_count     INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_service_providers_type ON service_providers (type);
CREATE INDEX idx_service_providers_institution ON service_providers (institution_id);
CREATE INDEX idx_service_providers_availability ON service_providers (availability_status);

-- ---------------------------------------------------------------------------
-- service_provider_skills
-- ---------------------------------------------------------------------------
CREATE TABLE service_provider_skills (
  id            UUID PRIMARY KEY,
  provider_id   UUID NOT NULL REFERENCES service_providers (id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  category      TEXT NOT NULL,
  level         TEXT NOT NULL DEFAULT 'Intermediate'  -- Beginner | Intermediate | Advanced | Expert
);

CREATE INDEX idx_service_provider_skills_provider ON service_provider_skills (provider_id);

-- ---------------------------------------------------------------------------
-- service_provider_certifications
-- ---------------------------------------------------------------------------
CREATE TABLE service_provider_certifications (
  id            UUID PRIMARY KEY,
  provider_id   UUID NOT NULL REFERENCES service_providers (id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  issuer        TEXT NOT NULL,
  year          TEXT NOT NULL,
  credential_id TEXT
);

CREATE INDEX idx_service_provider_certifications_provider ON service_provider_certifications (provider_id);

-- ---------------------------------------------------------------------------
-- service_provider_portfolio
-- ---------------------------------------------------------------------------
CREATE TABLE service_provider_portfolio (
  id            UUID PRIMARY KEY,
  provider_id   UUID NOT NULL REFERENCES service_providers (id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  category      TEXT NOT NULL,                    -- ServiceCategory
  client        TEXT,
  year          TEXT,
  result        TEXT
);

CREATE INDEX idx_service_provider_portfolio_provider ON service_provider_portfolio (provider_id);

-- ---------------------------------------------------------------------------
-- service_provider_testimonials
-- ---------------------------------------------------------------------------
CREATE TABLE service_provider_testimonials (
  id                 UUID PRIMARY KEY,
  provider_id        UUID NOT NULL REFERENCES service_providers (id) ON DELETE CASCADE,
  client_name        TEXT NOT NULL,
  client_role        TEXT,
  client_institution TEXT,
  rating             NUMERIC NOT NULL,
  comment            TEXT NOT NULL,
  service_title      TEXT,
  date               TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_service_provider_testimonials_provider ON service_provider_testimonials (provider_id);

-- ---------------------------------------------------------------------------
-- services
-- ---------------------------------------------------------------------------
CREATE TABLE services (
  id               UUID PRIMARY KEY,
  title            TEXT NOT NULL,
  summary          TEXT NOT NULL,
  description      TEXT NOT NULL,
  category         TEXT NOT NULL,                 -- ServiceCategory
  group            TEXT NOT NULL,                 -- ServiceCategoryGroup
  type             TEXT NOT NULL,                 -- ServiceType
  provider_id      UUID NOT NULL REFERENCES service_providers (id) ON DELETE CASCADE,
  provider_name    TEXT NOT NULL,
  price_amount     NUMERIC NOT NULL,
  price_currency   TEXT NOT NULL,                 -- CurrencyCode
  price_interval   TEXT,                          -- ServicePriceInterval
  price_compare_at NUMERIC,
  discount_percent NUMERIC,
  discount_fixed   NUMERIC,
  rating_average   NUMERIC NOT NULL DEFAULT 0,
  rating_count     INTEGER NOT NULL DEFAULT 0,
  rating_distribution JSONB NOT NULL DEFAULT '{"1":0,"2":0,"3":0,"4":0,"5":0}'::JSONB,
  review_count     INTEGER NOT NULL DEFAULT 0,
  completed_jobs   INTEGER NOT NULL DEFAULT 0,
  inquiries        INTEGER NOT NULL DEFAULT 0,
  favorites        INTEGER NOT NULL DEFAULT 0,
  views            INTEGER NOT NULL DEFAULT 0,
  keywords         TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  research_areas   TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  disciplines      TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  career_stages    TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],  -- CareerStage[]
  stage_ids        TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],  -- ResearchLifecycleStageId[]
  delivery_days    INTEGER NOT NULL,
  revisions        INTEGER NOT NULL DEFAULT 0,
  languages        TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  target_audience  TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  skills           TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  requirements     JSONB NOT NULL DEFAULT '[]'::JSONB,       -- ServiceRequirement[]
  featured         BOOLEAN NOT NULL DEFAULT FALSE,
  sponsored        BOOLEAN NOT NULL DEFAULT FALSE,
  promoted         BOOLEAN NOT NULL DEFAULT FALSE,
  boost_level      TEXT,                          -- ServiceBoostLevel
  sponsored_label  TEXT,
  ad_campaign_id   TEXT,
  ad_placement     JSONB,
  ad_metrics       JSONB,                         -- ServiceAdMetrics
  badges           TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  status           TEXT NOT NULL DEFAULT 'draft', -- ServiceStatus
  url              TEXT NOT NULL,
  date_added       TIMESTAMPTZ NOT NULL,
  last_updated     TIMESTAMPTZ NOT NULL,
  source_id        TEXT,
  source_entity    TEXT                           -- DiscoveryEntityType
);

CREATE INDEX idx_services_category ON services (category);
CREATE INDEX idx_services_group ON services (group);
CREATE INDEX idx_services_provider ON services (provider_id);
CREATE INDEX idx_services_status ON services (status);
CREATE INDEX idx_services_featured ON services (featured) WHERE featured = TRUE;
CREATE INDEX idx_services_source ON services (source_id, source_entity);

-- ---------------------------------------------------------------------------
-- service_packages
-- ---------------------------------------------------------------------------
CREATE TABLE service_packages (
  id              UUID PRIMARY KEY,
  service_id      UUID NOT NULL REFERENCES services (id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT NOT NULL,
  price_amount    NUMERIC NOT NULL,
  price_currency  TEXT NOT NULL,
  price_interval  TEXT,
  delivery_days   INTEGER NOT NULL,
  revisions       INTEGER NOT NULL DEFAULT 0,
  includes        TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  popular         BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_service_packages_service ON service_packages (service_id);

-- ---------------------------------------------------------------------------
-- service_reviews
-- ---------------------------------------------------------------------------
CREATE TABLE service_reviews (
  id               UUID PRIMARY KEY,
  service_id       UUID NOT NULL REFERENCES services (id) ON DELETE CASCADE,
  provider_id      UUID NOT NULL REFERENCES service_providers (id) ON DELETE CASCADE,
  reviewer_id      TEXT,
  reviewer_name    TEXT NOT NULL,
  reviewer_said    TEXT,
  rating           NUMERIC NOT NULL,
  title            TEXT NOT NULL,
  comment          TEXT NOT NULL,
  helpful_votes    INTEGER NOT NULL DEFAULT 0,
  verified_purchase BOOLEAN NOT NULL DEFAULT FALSE,
  date             TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_service_reviews_service ON service_reviews (service_id);
CREATE INDEX idx_service_reviews_provider ON service_reviews (provider_id);

-- ---------------------------------------------------------------------------
-- service_orders
-- ---------------------------------------------------------------------------
CREATE TABLE service_orders (
  id             UUID PRIMARY KEY,
  order_number   TEXT NOT NULL UNIQUE,
  service_id     UUID NOT NULL REFERENCES services (id) ON DELETE CASCADE,
  package_id     UUID REFERENCES service_packages (id),
  provider_id    UUID NOT NULL REFERENCES service_providers (id),
  provider_name  TEXT NOT NULL,
  buyer_id       TEXT,
  buyer_name     TEXT NOT NULL,
  buyer_said     TEXT,
  amount         NUMERIC NOT NULL,
  currency       TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'pending',  -- ServiceOrderStatus
  payment_status TEXT NOT NULL DEFAULT 'unpaid',  -- ServicePaymentStatus
  placed_at      TIMESTAMPTZ NOT NULL,
  deadline       TIMESTAMPTZ,
  delivered_at   TIMESTAMPTZ,
  completed_at   TIMESTAMPTZ,
  notes          TEXT
);

CREATE INDEX idx_service_orders_service ON service_orders (service_id);
CREATE INDEX idx_service_orders_provider ON service_orders (provider_id);
CREATE INDEX idx_service_orders_status ON service_orders (status);

-- ---------------------------------------------------------------------------
-- service_order_milestones
-- ---------------------------------------------------------------------------
CREATE TABLE service_order_milestones (
  id             UUID PRIMARY KEY,
  order_id       UUID NOT NULL REFERENCES service_orders (id) ON DELETE CASCADE,
  title          TEXT NOT NULL,
  description    TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'pending',  -- pending | in-progress | completed
  due_date       TIMESTAMPTZ NOT NULL,
  completed_at   TIMESTAMPTZ
);

CREATE INDEX idx_service_order_milestones_order ON service_order_milestones (order_id);

-- ---------------------------------------------------------------------------
-- service_disputes
-- ---------------------------------------------------------------------------
CREATE TABLE service_disputes (
  id            UUID PRIMARY KEY,
  order_id      UUID NOT NULL REFERENCES service_orders (id) ON DELETE CASCADE,
  service_id    UUID NOT NULL REFERENCES services (id),
  provider_id   UUID NOT NULL REFERENCES service_providers (id),
  opened_by     TEXT NOT NULL,
  subject       TEXT NOT NULL,
  description   TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'open',      -- ServiceDisputeStatus
  opened_at     TIMESTAMPTZ NOT NULL,
  resolved_at   TIMESTAMPTZ,
  resolution    TEXT,
  refunded      BOOLEAN NOT NULL DEFAULT FALSE,
  refund_amount NUMERIC,
  currency      TEXT
);

CREATE INDEX idx_service_disputes_order ON service_disputes (order_id);
CREATE INDEX idx_service_disputes_status ON service_disputes (status);

-- ---------------------------------------------------------------------------
-- service_recommendations
-- ---------------------------------------------------------------------------
CREATE TABLE service_recommendations (
  id            UUID PRIMARY KEY,
  type          TEXT NOT NULL,                     -- ServiceRecommendationType
  target_id     TEXT NOT NULL,
  source_id     TEXT,
  source_entity TEXT,                              -- DiscoveryEntityType
  title         TEXT NOT NULL,
  summary       TEXT NOT NULL,
  url           TEXT NOT NULL,
  score         NUMERIC NOT NULL,
  confidence    TEXT NOT NULL,                     -- IntelligenceConfidence
  reasons       TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  tags          TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  audience      TEXT,
  date          TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_service_recommendations_type ON service_recommendations (type);
CREATE INDEX idx_service_recommendations_target ON service_recommendations (target_id);

-- ---------------------------------------------------------------------------
-- service_bundles
-- ---------------------------------------------------------------------------
CREATE TABLE service_bundles (
  id               UUID PRIMARY KEY,
  name             TEXT NOT NULL,
  description      TEXT NOT NULL,
  list_total       NUMERIC NOT NULL,
  discount_percent INTEGER NOT NULL,
  price            NUMERIC NOT NULL,
  currency         TEXT NOT NULL,
  featured         BOOLEAN NOT NULL DEFAULT FALSE
);

-- ---------------------------------------------------------------------------
-- service_bundle_services
-- ---------------------------------------------------------------------------
CREATE TABLE service_bundle_services (
  bundle_id   UUID NOT NULL REFERENCES service_bundles (id) ON DELETE CASCADE,
  service_id  UUID NOT NULL REFERENCES services (id) ON DELETE CASCADE,
  position    INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (bundle_id, service_id)
);

-- ---------------------------------------------------------------------------
-- service_discovery_items
-- ---------------------------------------------------------------------------
CREATE TABLE service_discovery_items (
  id            TEXT PRIMARY KEY,
  entity_type   TEXT NOT NULL,                     -- DiscoveryEntityType
  source_id     TEXT NOT NULL REFERENCES services (id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  summary       TEXT NOT NULL,
  description   TEXT,
  keywords      TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  discipline    TEXT,
  research_areas TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  organizations TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  country       TEXT,
  continent     TEXT,
  year          TEXT,
  status        TEXT,
  tags          TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  score         NUMERIC NOT NULL DEFAULT 0,
  url           TEXT NOT NULL,
  date_added    TIMESTAMPTZ NOT NULL,
  stage_id      TEXT                               -- ResearchLifecycleStageId
);

CREATE INDEX idx_service_discovery_items_entity ON service_discovery_items (entity_type);
CREATE INDEX idx_service_discovery_items_source ON service_discovery_items (source_id);

-- ---------------------------------------------------------------------------
-- service_promotable_objects (advertising integration)
-- ---------------------------------------------------------------------------
CREATE TABLE service_promotable_objects (
  id              TEXT PRIMARY KEY,
  entity_type     TEXT NOT NULL,                   -- PromotableEntityType
  source_id       TEXT NOT NULL REFERENCES services (id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  summary         TEXT NOT NULL,
  url             TEXT NOT NULL,
  keywords        TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  discipline      TEXT,
  research_areas  TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  authors         TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  organizations   TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  country         TEXT,
  stage_id        TEXT,                            -- ResearchLifecycleStageId
  tags            TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  date_added      TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_service_promotable_objects_source ON service_promotable_objects (source_id);

