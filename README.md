# Workplace Intelligence

A secure employee benefits dashboard built with Next.js, following strict MVC
separation and loose client/server coupling (see `CLAUDE.md`).

## Architecture

```
app/
  api/                        # Controllers — RESTful JSON resources
    login/route.ts            #   POST /api/login
    logout/route.ts           #   POST /api/logout
    users/me/route.ts         #   GET  /api/users/me
    benefits/summary/         #   GET  /api/benefits/summary
    benefits/compensation/    #   GET  /api/benefits/compensation
    benefits/portfolio/       #   GET  /api/benefits/portfolio
    benefits/quick-links/     #   GET  /api/benefits/quick-links
    benefits/health/          #   GET  /api/benefits/health
    benefits/retirement/      #   GET  /api/benefits/retirement
    benefits/networth/        #   GET  /api/benefits/networth
    benefits/priority-actions/ #  GET  /api/benefits/priority-actions
    benefits/top-questions/   #   GET  /api/benefits/top-questions
    benefits/equity-report/   #   GET  /api/benefits/equity-report
    benefits/balance-sheet/   #   GET  /api/benefits/balance-sheet
    benefits/comp-breakdown/  #   GET  /api/benefits/comp-breakdown
    benefits/stock-scenarios/ #   GET  /api/benefits/stock-scenarios
    benefits/financial-goals/ #   GET  /api/benefits/financial-goals
  login/                      # Views (pages) — tabbed via AppHeader nav; each
                              #   page renders in a 60%-width center panel
                              #   (PageShell) flanked by gray side panels:
  dashboard/                  #   Dashboard (priority items, net worth, quick actions, equity report)
  total-comp/                 #   Total Comp (tiles, quick actions, breakdown, scenarios, goals)
  portfolio/                  #   Portfolio & Banking (blank per spec)
  benefits/                   #   Benefits (summary, quick actions, health, retirement)
lib/
  config.ts                   # Server-only env config, validated at entry
  types.ts                    # Shared DTO contract (type-only, client-safe)
  http.ts                     # Centralized error handling + payload validation
  session.ts                  # Session model + requireAuthenticated guard
  models/
    users.ts                  # Identity service
    benefits/
      repository.ts           #   Repository interface (persistence contract)
      mock.ts                 #   Mock implementation (DATA_SOURCE=mock)
      postgres.ts             #   Postgres implementation (DATA_SOURCE=postgres)
      index.ts                #   Factory: picks impl from config — the DB seam
      service.ts              #   Service layer used by controllers
  api-client.ts               # Client-side REST client (views never touch models)
  presenters.ts               # DTO → view-model mapping (business logic off-views)
  format.ts                   # Pure formatting helpers
  hooks/
    useResources.ts           #   Shared fetch lifecycle (loading/error/ready + 401 redirect)
    useLogout.ts              #   Shared logout flow
    useUser.ts                #   Session user only (blank tabs)
    useDashboard.ts           #   Dashboard composition (net worth, quick actions, report)
    useTotalComp.ts           #   Total Comp composition
    useBenefits.ts            #   Benefits composition (all tile resources)
components/                   # Views — dumb renderers + co-located CSS modules
  PageShell.tsx               # 60%-width center panel + gray side panels
  tiles/                      # BenefitTile / HealthTile / PortfolioTile / RetirementTile
                              # NetWorthTile / EquityReportTile / BalanceSheetTile
                              # CompBreakdownTile / StockScenariosTile / PriorityActionsTile
                              # TopQuestionsTile / FinancialGoalsTile
```

Request flow (every layer independently replaceable):

```
React view → api-client → HTTP/JSON → controller → service → repository → mock | DB
```

## Database

The server APIs are persistence-agnostic; Postgres is the production store.
Tables mirror the DTO shapes in `lib/types.ts` (`db/schema.sql`), seeded with
the same records the mock repository serves (`db/seed.sql`).

```bash
npm run db:setup   # creates the local database, applies schema, loads seed
```

Set `DATA_SOURCE=postgres` and `DATABASE_URL` in `.env.local` (see
`.env.example`) and the repository factory (`lib/models/benefits/index.ts`)
switches every endpoint to the database. No controller, service, or client
code changes. `DATA_SOURCE=mock` (the default) keeps serving in-memory data.

DEMO_USERNAME=demo
DEMO_PASSWORD=benefits123
DEMO_USER_DISPLAY_NAME=Demo User
DATA_SOURCE=postgres
DATABASE_URL=postgresql://harir@localhost:5432/benefits_app

## Guardrails enforced (from `CLAUDE.md`)

- Views never import the data layer; all data flows through `/api/*` REST
  endpoints. Server code has zero dependency on React modules.
- No inline `style` props — all styles live in CSS modules / `globals.css`.
- No hardcoded config/secrets — everything comes from `process.env`,
  validated in `lib/config.ts`.
- All route handlers use async/await, validate payloads, and are wrapped in
  centralized error handling (`lib/http.ts`).

## Getting Started

```bash
cp .env.example .env.local   # demo defaults work out of the box
npm install
npm run dev                  # or: npm run build && npm start
```

Open [http://localhost:3000](http://localhost:3000). Demo credentials:
`demo` / `benefits123`.
