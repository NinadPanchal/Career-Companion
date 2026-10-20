#!/usr/bin/env bash

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_DIR="$PROJECT_ROOT/apps/api"
DESKTOP_DIR="$PROJECT_ROOT/apps/desktop"

# Resolve Python interpreter
if [[ -x "$API_DIR/.venv/bin/python" ]]; then
  PYTHON="$API_DIR/.venv/bin/python"
elif command -v python3 &>/dev/null; then
  PYTHON="$(command -v python3)"
else
  echo "Error: Python 3 not found." >&2
  exit 1
fi

MODE="${1:-web}"

# Graceful cleanup on SIGINT / SIGTERM / EXIT
API_PID=""
FRONTEND_PID=""

cleanup() {
  echo ""
  echo "Shutting down Career Companion services..."
  if [[ -n "$API_PID" ]] && kill -0 "$API_PID" 2>/dev/null; then
    kill "$API_PID" 2>/dev/null || true
  fi
  if [[ -n "$FRONTEND_PID" ]] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi
  wait 2>/dev/null || true
  echo "All services stopped."
}

trap cleanup EXIT INT TERM

echo "=========================================================="
echo "  Career Companion — Starting Local Environment"
echo "=========================================================="

# 1. Start FastAPI Backend in background
echo "-> Starting Backend API (FastAPI) on http://127.0.0.1:8000"
"$PYTHON" -m uvicorn main:app --app-dir "$API_DIR" --reload --port 8000 &
API_PID=$!

# Wait briefly for backend to initialize
sleep 1.5

if ! kill -0 "$API_PID" 2>/dev/null; then
  echo "Error: Backend API failed to start." >&2
  exit 1
fi

echo "   Backend ready at http://127.0.0.1:8000 (Docs: http://127.0.0.1:8000/docs)"

# 2. Start Frontend based on requested mode
if [[ "$MODE" == "--desktop" || "$MODE" == "desktop" || "$MODE" == "tauri" ]]; then
  echo "-> Launching Tauri Native Desktop Window..."
  pnpm --dir "$DESKTOP_DIR" tauri dev
else
  echo "-> Starting Web Client on http://localhost:1420..."
  echo "-> Press Ctrl+C at any time to shut down all services."
  echo "=========================================================="
  pnpm --dir "$DESKTOP_DIR" dev &
  FRONTEND_PID=$!
  wait "$FRONTEND_PID"
fi
