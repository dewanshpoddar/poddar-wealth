#!/usr/bin/env bash
# Smoke test for /api/leads — sends a minimal valid lead and checks for success.
# Required fields: name (≥2 chars), mobile (10 digits)
# Usage: bash scripts/test-lead.sh [base_url]
set -euo pipefail

BASE="${1:-http://localhost:3000}"

echo "=== Lead capture smoke test → $BASE/api/leads ==="
curl -s -X POST "$BASE/api/leads" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Lead","mobile":"9999999999","intent":"smoke-test"}' \
  -w "\nHTTP: %{http_code}\n"
