#!/usr/bin/env bash

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
API_DIRECTORY="$PROJECT_ROOT/apps/api"
DESKTOP_DIRECTORY="$PROJECT_ROOT/apps/desktop"
PYTHON="$API_DIRECTORY/.venv/bin/python"

if [[ ! -x "$PYTHON" ]]; then
  echo "API virtual environment not found at $PYTHON"
  echo "Create it and install dependencies before running this script."
  exit 1
fi

cleanup() {
  if [[ -n "${API_PROCESS_ID:-}" ]]; then
    kill "$API_PROCESS_ID" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

echo "Starting Career Companion API at http://127.0.0.1:8000"
"$PYTHON" -m uvicorn main:app --app-dir "$API_DIRECTORY" --reload --port 8000 &
API_PROCESS_ID=$!

echo "Starting Career Companion desktop app"
pnpm --dir "$DESKTOP_DIRECTORY" tauri dev
