-- Schema for the benefits model layer. Tables mirror the DTO contract in
-- lib/types.ts one-to-one so repository queries map rows directly onto DTOs.
-- Re-runnable: drops and recreates every table (apply seed.sql afterwards).

BEGIN;

DROP TABLE IF EXISTS benefit_tiles, retirement_tiles, retirement_contributions, comp_tiles, portfolio_tiles, health_tiles, quick_links, networth_tiles, equity_report, equity_grants, comp_breakdown, comp_breakdown_total, stock_scenarios, comp_disclosure;

-- BenefitTileDTO (summary resource)
CREATE TABLE benefit_tiles (
  id              TEXT           NOT NULL PRIMARY KEY,
  title           TEXT           NOT NULL,
  variant         TEXT           NOT NULL CHECK (variant IN ('description', 'trend', 'expiry', 'date')),
  amount          NUMERIC(12, 2),
  description     TEXT,
  trend_direction TEXT           CHECK (trend_direction IN ('up', 'down')),
  trend_percent   SMALLINT       CHECK (trend_percent >= 0),
  expiry_date     TEXT,
  date            TEXT,
  position        SMALLINT       NOT NULL UNIQUE
);

-- RetirementTileDTO (retirement resource) — its own table, deliberately
-- separate from benefit_tiles. The 'detail' variant carries the 401K
-- contribution card: detail columns on the row, contributions in the child
-- table below.
CREATE TABLE retirement_tiles (
  id                 TEXT           NOT NULL PRIMARY KEY,
  title              TEXT           NOT NULL,
  variant            TEXT           NOT NULL CHECK (variant IN ('description', 'trend', 'expiry', 'date', 'detail')),
  amount             NUMERIC(12, 2),
  description        TEXT,
  trend_direction    TEXT           CHECK (trend_direction IN ('up', 'down')),
  trend_percent      SMALLINT       CHECK (trend_percent >= 0),
  expiry_date        TEXT,
  date               TEXT,
  contributed_amount NUMERIC(12, 2),
  irs_limit          NUMERIC(12, 2),
  percent_spent      SMALLINT       CHECK (percent_spent BETWEEN 0 AND 100),
  info_category      TEXT,
  info_type          TEXT,
  info_description   TEXT,
  position           SMALLINT       NOT NULL UNIQUE
);

-- RetirementContributionDTO: ordered contribution rows belonging to a
-- 'detail' retirement tile (e.g. employee 8% / employer 6%).
CREATE TABLE retirement_contributions (
  tile_id              TEXT           NOT NULL REFERENCES retirement_tiles (id) ON DELETE CASCADE,
  position             SMALLINT       NOT NULL,
  contribution_percent SMALLINT       NOT NULL,
  contribution_amount  NUMERIC(12, 2) NOT NULL,
  PRIMARY KEY (tile_id, position)
);

-- CompTileDTO (compensation resource) — its own table, deliberately separate
-- from benefit_tiles. 'date-trend' pairs a date primary with a trend secondary.
CREATE TABLE comp_tiles (
  id              TEXT           NOT NULL PRIMARY KEY,
  title           TEXT           NOT NULL,
  variant         TEXT           NOT NULL CHECK (variant IN ('description', 'trend', 'date-trend')),
  amount          NUMERIC(12, 2),
  description     TEXT,
  trend_direction TEXT           CHECK (trend_direction IN ('up', 'down')),
  trend_percent   SMALLINT       CHECK (trend_percent >= 0),
  date            TEXT,
  position        SMALLINT       NOT NULL UNIQUE
);

-- PortfolioTileDTO
CREATE TABLE portfolio_tiles (
  id          TEXT     NOT NULL PRIMARY KEY,
  title       TEXT     NOT NULL,
  description TEXT     NOT NULL,
  position    SMALLINT NOT NULL UNIQUE
);

-- HealthTileDTO
CREATE TABLE health_tiles (
  id          TEXT     NOT NULL PRIMARY KEY,
  title       TEXT     NOT NULL,
  status      TEXT     NOT NULL CHECK (status IN ('ACTIVE', 'ENROLLED', 'UNCLAIMED', 'PARTIAL')),
  description TEXT     NOT NULL,
  utilization SMALLINT NOT NULL CHECK (utilization BETWEEN 0 AND 100),
  stat        TEXT     NOT NULL,
  position    SMALLINT NOT NULL UNIQUE
);

-- QuickLinkDTO (no id in the contract; position orders and identifies rows)
CREATE TABLE quick_links (
  position SMALLINT NOT NULL PRIMARY KEY,
  label    TEXT     NOT NULL,
  href     TEXT     NOT NULL
);

-- NetWorthTileDTO (dashboard net-worth resource) — its own table. Amounts
-- are exact display text because the spec mixes compact and full formats.
CREATE TABLE networth_tiles (
  id               TEXT     NOT NULL PRIMARY KEY,
  title            TEXT     NOT NULL,
  value_text       TEXT     NOT NULL,
  description      TEXT,
  description_tone TEXT     CHECK (description_tone IN ('plain', 'green')),
  action_label     TEXT,
  action_href      TEXT,
  position         SMALLINT NOT NULL UNIQUE
);

-- EquityReportDTO (dashboard equity report resource): single-row table for
-- the "PLTR RSU Holdings" report tile and its white equity sub-tile.
CREATE TABLE equity_report (
  id                 TEXT NOT NULL PRIMARY KEY,
  report_type        TEXT NOT NULL,
  feed_type          TEXT NOT NULL,
  equity_value_type  TEXT NOT NULL,
  equity_value       TEXT,
  equity_share_count TEXT,
  share_account_type TEXT,
  stock_type         TEXT,
  last_updated       TEXT
);

-- EquityGrantDTO: ordered grant tranche rows belonging to an equity_report
-- (the bear/vested-style table rendered inside the white sub-tile).
CREATE TABLE equity_grants (
  id               TEXT     NOT NULL PRIMARY KEY,
  equity_report_id TEXT     NOT NULL REFERENCES equity_report (id) ON DELETE CASCADE,
  shares_text      TEXT     NOT NULL,
  value_text       TEXT     NOT NULL,
  description      TEXT     NOT NULL,
  status           TEXT     NOT NULL CHECK (status IN ('VESTED', 'UNVESTED')),
  position         SMALLINT NOT NULL
);

-- CompBreakdownRowDTO (compensation breakdown resource): one row per
-- compensation type; the total lives in its own single-row table.
CREATE TABLE comp_breakdown (
  id          TEXT          NOT NULL PRIMARY KEY,
  comp_type   TEXT          NOT NULL,
  comp_amount NUMERIC(12,2) NOT NULL,
  comp_percent NUMERIC(4,1) NOT NULL CHECK (comp_percent BETWEEN 0 AND 100),
  position    SMALLINT      NOT NULL UNIQUE
);

CREATE TABLE comp_breakdown_total (
  id         TEXT          NOT NULL PRIMARY KEY,
  total_comp NUMERIC(12,2) NOT NULL
);

-- StockScenarioDTO (PLTR bear/current/bull scenarios) + the disclosure note
-- shown beneath them (single-row table).
CREATE TABLE stock_scenarios (
  id          TEXT          NOT NULL PRIMARY KEY,
  stock_type  TEXT          NOT NULL,
  stock_value NUMERIC(10,2) NOT NULL,
  total_value NUMERIC(12,2) NOT NULL,
  position    SMALLINT      NOT NULL UNIQUE
);

CREATE TABLE comp_disclosure (
  id              TEXT NOT NULL PRIMARY KEY,
  disclosure_text TEXT NOT NULL
);

COMMIT;
