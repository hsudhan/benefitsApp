-- Schema for the benefits model layer. Tables mirror the DTO contract in
-- lib/types.ts one-to-one so repository queries map rows directly onto DTOs.
-- Re-runnable: drops and recreates every table (apply seed.sql afterwards).

BEGIN;

DROP TABLE IF EXISTS benefit_tiles, retirement_tiles, retirement_contributions, retirement_vesting_events, comp_tiles, portfolio_tiles, health_tiles, quick_links, networth_tiles, priority_actions, priority_action_items, top_questions, top_question_items, equity_report, equity_grants, balance_sheet, balance_sheet_holdings, comp_breakdown, comp_breakdown_total, stock_scenarios, comp_disclosure, financial_goals, financial_goal_items;

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
-- table below. The 'unvested' variant carries the PLTR RSU card: unvested
-- summary columns on the row, vesting events in the child table below.
-- Unvested values are exact display text because the spec mixes formats.
CREATE TABLE retirement_tiles (
  id                   TEXT           NOT NULL PRIMARY KEY,
  title                TEXT           NOT NULL,
  variant              TEXT           NOT NULL CHECK (variant IN ('description', 'trend', 'expiry', 'date', 'detail', 'unvested')),
  amount               NUMERIC(12, 2),
  description          TEXT,
  trend_direction      TEXT           CHECK (trend_direction IN ('up', 'down')),
  trend_percent        SMALLINT       CHECK (trend_percent >= 0),
  expiry_date          TEXT,
  date                 TEXT,
  contributed_amount   NUMERIC(12, 2),
  irs_limit            NUMERIC(12, 2),
  percent_spent        SMALLINT       CHECK (percent_spent BETWEEN 0 AND 100),
  info_category        TEXT,
  info_type            TEXT,
  info_description     TEXT,
  unvested_total_type  TEXT,
  unvested_shares_text TEXT,
  unvested_shares_type TEXT,
  unvested_value_type  TEXT,
  unvested_value_text  TEXT,
  unvested_price_type  TEXT,
  position             SMALLINT       NOT NULL UNIQUE
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

-- VestingEventDTO: ordered vesting-event rows belonging to an 'unvested'
-- retirement tile (rendered in the borderless table below the unvested
-- summary panels).
CREATE TABLE retirement_vesting_events (
  tile_id      TEXT     NOT NULL REFERENCES retirement_tiles (id) ON DELETE CASCADE,
  id           TEXT     NOT NULL PRIMARY KEY,
  vesting_date TEXT     NOT NULL,
  shares_text  TEXT     NOT NULL,
  value_text   TEXT     NOT NULL,
  position     SMALLINT NOT NULL
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
-- tile_tone 'gray' renders the tile on #f3f5f7 (dashboard tiles 1 & 2);
-- NULL renders the default card white.
CREATE TABLE networth_tiles (
  id               TEXT     NOT NULL PRIMARY KEY,
  title            TEXT     NOT NULL,
  value_text       TEXT     NOT NULL,
  description      TEXT,
  description_tone TEXT     CHECK (description_tone IN ('plain', 'green')),
  tile_tone        TEXT     CHECK (tile_tone IN ('white', 'gray')),
  action_label     TEXT,
  action_href      TEXT,
  position         SMALLINT NOT NULL UNIQUE
);

-- PriorityActionsDTO (dashboard priority actions resource): single-row table
-- for the "Priority Items" tile header.
CREATE TABLE priority_actions (
  id            TEXT NOT NULL PRIMARY KEY,
  actions_title TEXT NOT NULL
);

-- PriorityActionDTO: ordered action tiles belonging to a priority_actions
-- panel (rendered side by side in the white panel). action_label/action_href
-- carry the gray oval button with blue foreground.
CREATE TABLE priority_action_items (
  id                  TEXT     NOT NULL PRIMARY KEY,
  priority_actions_id TEXT     NOT NULL REFERENCES priority_actions (id) ON DELETE CASCADE,
  action_category     TEXT     NOT NULL,
  action_title        TEXT     NOT NULL,
  action_description  TEXT     NOT NULL,
  action_label        TEXT     NOT NULL,
  action_href         TEXT     NOT NULL,
  position            SMALLINT NOT NULL
);

-- TopQuestionsDTO (dashboard top questions resource): single-row table for
-- the panel header (big bold questions_message) and the muted subtext_type
-- row beneath it.
CREATE TABLE top_questions (
  id                TEXT NOT NULL PRIMARY KEY,
  questions_message TEXT NOT NULL,
  subtext_type      TEXT NOT NULL
);

-- TopQuestionDTO: ordered question rows belonging to a top_questions panel
-- (rendered in the white tile with horizontal lines between rows).
-- action_label/action_href carry the gray oval "Ask AI" button with blue
-- foreground.
CREATE TABLE top_question_items (
  id               TEXT     NOT NULL PRIMARY KEY,
  top_questions_id TEXT     NOT NULL REFERENCES top_questions (id) ON DELETE CASCADE,
  question_text    TEXT     NOT NULL,
  action_label     TEXT     NOT NULL,
  action_href      TEXT     NOT NULL,
  position         SMALLINT NOT NULL
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

-- BalanceSheetDTO (dashboard balance sheet resource): single-row table for
-- the "Balance Sheet" report tile and its circular stock-percent thermometer.
-- total_type/total_value carry the bold "Total Net Worth" row rendered last
-- in the holdings table.
CREATE TABLE balance_sheet (
  id            TEXT     NOT NULL PRIMARY KEY,
  report_type   TEXT     NOT NULL,
  feed_type     TEXT     NOT NULL,
  stock_type    TEXT     NOT NULL,
  stock_percent SMALLINT NOT NULL CHECK (stock_percent BETWEEN 0 AND 100),
  total_type    TEXT     NOT NULL,
  total_value   TEXT     NOT NULL
);

-- BalanceSheetHoldingDTO: ordered holding/liability rows belonging to a
-- balance_sheet (rendered in the second white sub-tile). value_tone 'maroon'
-- flags liabilities (negative values); NULL renders black.
CREATE TABLE balance_sheet_holdings (
  id               TEXT     NOT NULL PRIMARY KEY,
  balance_sheet_id TEXT     NOT NULL REFERENCES balance_sheet (id) ON DELETE CASCADE,
  investment_type  TEXT     NOT NULL,
  investment_value TEXT     NOT NULL,
  value_tone       TEXT     CHECK (value_tone IN ('black', 'maroon')),
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

-- FinancialGoalsDTO (Total Comp financial goals resource): single-row table
-- for the gray tile header (financial_goals_tile_title) and its white oval
-- "Add Milestone" button (action_label/action_href).
CREATE TABLE financial_goals (
  id                        TEXT NOT NULL PRIMARY KEY,
  financial_goals_tile_title TEXT NOT NULL,
  action_label              TEXT NOT NULL,
  action_href               TEXT NOT NULL
);

-- FinancialGoalDTO: ordered goal rows belonging to a financial_goals panel
-- (rendered in the white table below the gray tile). Each row is three
-- stacked lines: black bold shares_type, gray share_description, gray
-- goal_date.
CREATE TABLE financial_goal_items (
  id                 TEXT     NOT NULL PRIMARY KEY,
  financial_goals_id TEXT     NOT NULL REFERENCES financial_goals (id) ON DELETE CASCADE,
  shares_type        TEXT     NOT NULL,
  share_description  TEXT     NOT NULL,
  goal_date          TEXT     NOT NULL,
  position           SMALLINT NOT NULL
);

COMMIT;
