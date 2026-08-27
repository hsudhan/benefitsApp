-- Seed data: the same records served by MockBenefitsRepository, so the API
-- returns identical DTOs regardless of DATA_SOURCE. Idempotent: re-running
-- truncates and reloads.

BEGIN;

TRUNCATE benefit_tiles, retirement_tiles, retirement_contributions, comp_tiles, portfolio_tiles, health_tiles, quick_links, networth_tiles, priority_actions, priority_action_items, equity_report, equity_grants, balance_sheet, balance_sheet_holdings, comp_breakdown, comp_breakdown_total, stock_scenarios, comp_disclosure;

INSERT INTO benefit_tiles
  (id, title, variant, amount, description, trend_direction, trend_percent, expiry_date, date, position)
VALUES
  ('total-benefit-value', 'Total Benefit Value', 'description', 24850.00, 'Annual Employer Contribution', NULL, NULL, NULL, NULL, 1),
  ('utilized', 'Utilized', 'trend', 12340.00, NULL, 'up', 64, NULL, NULL, 2),
  ('unclaimed', 'Unclaimed', 'expiry', 3210.00, NULL, NULL, NULL, '12/31/2026', NULL, 3),
  ('open-enrollment', 'Open Enrollment', 'date', NULL, 'Next Enrollment Window', NULL, NULL, NULL, '11/01/2026', 4);

INSERT INTO retirement_tiles
  (id, title, variant, amount, description, trend_direction, trend_percent, expiry_date, date,
   contributed_amount, irs_limit, percent_spent, info_category, info_type, info_description, position)
VALUES
  ('401k-fidelity', '401K - Fidelity Net Benefits', 'detail', NULL, NULL, NULL, NULL, NULL, NULL,
   14800.00, 23000.00, 64, 'Tip', 'Opportunity',
   'You can contribute $82,200 more this year to reach the IRS maximum and maximize tax-advantage growth.', 1),
  ('pltr-rsu', 'PLTR RSU Program - Morgan Stanley', 'description', 42300.00, 'Annual Employer Contribution', NULL, NULL, NULL, NULL,
   NULL, NULL, NULL, NULL, NULL, NULL, 2);

INSERT INTO retirement_contributions
  (tile_id, position, contribution_percent, contribution_amount)
VALUES
  ('401k-fidelity', 1, 8, 14800.00),
  ('401k-fidelity', 2, 6, 11100.00);

INSERT INTO comp_tiles
  (id, title, variant, amount, description, trend_direction, trend_percent, date, position)
VALUES
  ('base-salary', 'Base Salary', 'description', 185000.00, 'Annual', NULL, NULL, NULL, 1),
  ('cash-bonus', 'Cash Bonus', 'trend', 27750.00, NULL, 'up', 18, NULL, 2),
  ('pltr-rsu-ytd', 'PLTR RSU Value (YTD)', 'description', 94200.00, 'TBD shared vested', NULL, NULL, NULL, 3),
  ('open-enrollment', 'Open Enrollment', 'date-trend', NULL, NULL, 'up', 18, '11/01/2026', 4);

INSERT INTO portfolio_tiles (id, title, description, position) VALUES
  ('net-worth', 'NW Worth', 'Total Portfolio Value', 1),
  ('rsu-vest', 'RSU Vest', 'Next Vest 12/01/2026', 2),
  ('risk-conc', 'Risk Conc.', 'Single-Stock Concentration', 3),
  ('401k-match', '401K Match', 'Annual Employer Contribution', 4);

INSERT INTO quick_links (label, href, position) VALUES
  ('RSU Vesting', '#rsu-vesting', 1),
  ('Diversification', '#diversification', 2),
  ('Tax Planning', '#tax-planning', 3),
  ('Retirement', '#retirement', 4);

INSERT INTO health_tiles (id, title, status, description, utilization, stat, position) VALUES
  ('medical', 'Medical Insurance', 'ACTIVE',
   'Palantir covers 100% premium for employee + family. Anthem Blue Cross PPO, $500 deductible.',
   100, '$0 PREMIUM', 1),
  ('dental', 'Dental Insurance', 'ACTIVE',
   'In-network annual maximum preventive care 100% covered. Orthodontics 50% up to $1500.',
   45, '$2000/YEAR', 2),
  ('vision', 'Vision Insurance', 'ACTIVE',
   'Frames + contacts allowance. Annual eye exam covered. VSP network.',
   0, '$500/YEAR', 3),
  ('hsa-match', 'HSA Employer Match', 'UNCLAIMED',
   '50% employer match on up to $4800 HSA contribution. You have contributed $0 this year. Expires Dec 31.',
   0, '$2400', 4),
  ('commuter', 'Commuter Benefits', 'PARTIAL',
   '$200/mo pre-tax commuter benefit. Currently using $65/mo - $420 unclaimed this year.',
   82, '$420 UNCLAIMED', 5),
  ('dependent-care-fsa', 'Dependent Care FSA', 'ENROLLED',
   'Fully enrolled. $3200 remaining for 2026. Use for childcare, after-school programs.',
   36, '$5000', 6);

INSERT INTO networth_tiles
  (id, title, value_text, description, description_tone, tile_tone, action_label, action_href, position)
VALUES
  ('net-worth', 'Net Worth', '$1.24M', '12.4 TYD', 'green', 'gray', NULL, NULL, 1),
  ('pltr-equity-value', 'PLTR Equity Value', '$842K', '68% Conc.', 'plain', 'gray', NULL, NULL, 2),
  ('total-compensation', 'Total Compensation', '$312K', '2024 annual total', 'plain', NULL, NULL, NULL, 3),
  ('unclaimed-benefits', 'Unclaimed Benefits', '$4,820', NULL, NULL, NULL, 'claim now', '#claim', 4);

INSERT INTO priority_actions (id, actions_title) VALUES
  ('priority-actions', 'Priority Items');

INSERT INTO priority_action_items
  (id, priority_actions_id, action_category, action_title, action_description, action_label, action_href, position)
VALUES
  ('rebalance', 'priority-actions', 'REBALANCE', 'Rebalance Portfolio',
   'Stock allocation drifted to 75%. Rebalancing reduces volatility by 8%', 'View', '#rebalance', 1),
  ('home', 'priority-actions', 'HOME', 'Home Down Payment',
   '$82,760 gap to target. Increase contribution $300/mo to save 8 months', 'Calculator', '#home-calculator', 2),
  ('hsa', 'priority-actions', 'HSA', 'Claim HSA Match',
   '$82,760 gap to target. Increase contribution $300/mo to save 8 months.', 'Claim Now', '#claim-hsa', 3);

INSERT INTO equity_report
  (id, report_type, feed_type, equity_value_type, equity_value, equity_share_count, share_account_type, stock_type, last_updated)
VALUES
  ('pltr-rsu-holdings', 'PLTR RSU Holdings - All Tranches', 'Morgan Stanley Feed', 'Total PLTR Equity Value', '$842,440',
   '6960 shares @$121.08 -', 'Taxable Account', '(Schwab Equity + Morgan Stanley -', 'Updated 30 mins ago)');

INSERT INTO equity_grants (id, equity_report_id, shares_text, value_text, description, status, position) VALUES
  ('grant-a', 'pltr-rsu-holdings', '2324 shares', '$283,327', 'Grant A - Dec 2021 Grant price $18.42', 'VESTED', 1),
  ('grant-b', 'pltr-rsu-holdings', '1850 shares', '$283,327', 'Grant B - Jan 2023 Grant price $6.72', 'UNVESTED', 2),
  ('grant-c', 'pltr-rsu-holdings', '2770 shares', '$283,327', 'Grant C - Feb 2024 Grant price $21.33', 'UNVESTED', 3);

INSERT INTO balance_sheet (id, report_type, feed_type, stock_type, stock_percent, total_type, total_value) VALUES
  ('balance-sheet', 'Balance Sheet', 'Taxable/Non taxable', 'PLTR', 68, 'Total Net Worth', '$1,101,500');

INSERT INTO balance_sheet_holdings (id, balance_sheet_id, investment_type, investment_value, value_tone, position) VALUES
  ('pltr-equity', 'balance-sheet', 'PLTR Equity (Taxable)', '$842,400', NULL, 1),
  ('401k-fidelity', 'balance-sheet', '401K - Fidelity (Non-taxable)', '$187,320', NULL, 2),
  ('roth-ira', 'balance-sheet', 'ROTH IRA (Non-taxable)', '$42,100', NULL, 3),
  ('citi-banking', 'balance-sheet', 'Citi Banking', '$67,840', NULL, 4),
  ('student-loan', 'balance-sheet', 'Student Loan (Liability)', '-$38,200', 'maroon', 5);

INSERT INTO comp_breakdown (id, comp_type, comp_amount, comp_percent, position) VALUES
  ('base-salary', 'Base Salary', 185000.00, 59.3, 1),
  ('cash-bonus', 'Cash Bonus', 27750.00, 8.9, 2),
  ('pltr-rsus-vested', 'PLTR RSUs (vested)', 94200.00, 30.2, 3),
  ('benefits-value', 'Benefits Value', 5000.00, 1.6, 4);

INSERT INTO comp_breakdown_total (id, total_comp) VALUES ('total', 312050.00);

INSERT INTO stock_scenarios (id, stock_type, stock_value, total_value, position) VALUES
  ('bear-case', 'Bear Case', 65.00, 452400.00, 1),
  ('current', 'Current', 121.08, 842440.00, 2),
  ('bull-case', 'Bull Case', 180.00, 1252800.00, 3);

INSERT INTO comp_disclosure (id, disclosure_text) VALUES
  ('note', 'Scenarios based on 6960 vested PLTR shared. Unvested shared (4620) not included. Educational only - not investment advice.');

COMMIT;
