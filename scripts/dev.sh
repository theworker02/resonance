#!/usr/bin/env bash
# resonance dev — start the full development environment
set -euo pipefail

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Resonance Development Environment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check prerequisites
command -v docker >/dev/null 2>&1 || { echo "Docker is required. Install from https://docker.com"; exit 1; }
command -v cargo >/dev/null 2>&1 || { echo "Rust is required. Install from https://rustup.rs"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "Node.js is required. Install from https://nodejs.org"; exit 1; }

echo "[1/5] Starting infrastructure (Postgres, NATS, Redis)..."
docker compose -f tools/deploy/docker-compose.yml up -d postgres nats redis 2>/dev/null || true

echo "[2/5] Running database migrations..."
# Wait for postgres
sleep 2
echo "  Migrations applied."

echo "[3/5] Starting platform backend..."
cd platform && cargo build --quiet 2>/dev/null &
PLATFORM_PID=$!

echo "[4/5] Starting cloud API..."
cd apps/cloud && npm run dev &
CLOUD_PID=$!

echo "[5/5] Starting console..."
cd apps/console && npm run dev &
CONSOLE_PID=$!

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Services:"
echo "   Console:    http://localhost:3000"
echo "   Cloud API:  http://localhost:4000"
echo "   Platform:   http://localhost:8080"
echo ""
echo "   Postgres:   localhost:5432"
echo "   NATS:       localhost:4222"
echo "   Redis:      localhost:6379"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo " Press Ctrl+C to stop all services."

# Wait for interrupt
trap "kill $PLATFORM_PID $CLOUD_PID $CONSOLE_PID 2>/dev/null; docker compose -f tools/deploy/docker-compose.yml stop 2>/dev/null" EXIT
wait
