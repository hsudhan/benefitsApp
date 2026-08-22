#!/bin/sh
# One-step local database setup: creates the database if missing, then applies
# schema.sql and seed.sql. Idempotent — safe to re-run. Override the database
# name with DB_NAME (must match DATABASE_URL in .env.local).
set -eu

DB_NAME="${DB_NAME:-benefits_app}"
SCRIPT_DIR="$(CDPATH='' cd -- "$(dirname -- "$0")" && pwd)"

if ! psql -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1; then
  echo "Creating database: $DB_NAME"
  createdb "$DB_NAME"
fi

psql -d "$DB_NAME" -v ON_ERROR_STOP=1 -q -f "$SCRIPT_DIR/schema.sql"
psql -d "$DB_NAME" -v ON_ERROR_STOP=1 -q -f "$SCRIPT_DIR/seed.sql"
echo "Database $DB_NAME is ready (schema applied, seed loaded)."
