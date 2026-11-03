#!/usr/bin/env bash

# ==============================================================================
# Career Companion — One-Command Startup Script
# Starts FastAPI backend (port 8000) and Vite / Tauri frontend (port 1420).
# ==============================================================================

set -euo pipefail

# ANSI color codes
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m' # No Color

info()    { echo -e "${CYAN}==>${NC} ${BOLD}$*${NC}"; }
success() { echo -e "${GREEN}==>${NC} ${BOLD}$*${NC}"; }
warn()    { echo -e "${YELLOW}==>${NC} ${BOLD}$*${NC}"; }
error()   { echo -e "${RED}Error:${NC} $*" >&2; }

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_DIR="$PROJECT_ROOT/apps/api"
DESKTOP_DIR="$PROJECT_ROOT/apps/desktop"

# Default mode
MODE="web"
FORCE_CLEAN=false

# Parse arguments
for arg in "$@"; do
  case "$arg" in
    desktop|--desktop|tauri|--tauri)
      MODE="desktop"
      ;;
    web|--web)
      MODE="web"
      ;;
    api|--api|backend|--backend)
      MODE="api"
      ;;
    --clean|-c|--restart|restart)
      FORCE_CLEAN=true
      ;;
    -h|--help)
      echo -e "${BOLD}Career Companion Launch Script${NC}"
      echo ""
      echo "Usage: ./start.sh [mode] [flags]"
      echo ""
      echo "Modes:"
      echo "  web (default)       Start FastAPI backend + Web dev server (http://localhost:1420)"
      echo "  desktop | tauri     Start FastAPI backend + Native Tauri desktop app"
      echo "  api | backend       Start FastAPI backend only (http://127.0.0.1:8000)"
      echo ""
      echo "Flags:"
      echo "  --clean, restart    Terminate any lingering processes on ports 8000 and 1420 before starting"
      echo "  -h, --help          Show this help message"
      exit 0
      ;;
    *)
      warn "Unrecognized argument: $arg. Defaulting to web mode."
      ;;
  esac
done

# Function to free a port
free_port() {
  local port="$1"
  local pids
  pids=$(lsof -ti :"$port" 2>/dev/null || true)
  if [[ -n "$pids" ]]; then
    warn "Port $port is currently in use by process(es): $pids. Freeing port..."
    kill $pids 2>/dev/null || true
    sleep 0.5
    # Force kill if still holding
    local remaining
    remaining=$(lsof -ti :"$port" 2>/dev/null || true)
    if [[ -n "$remaining" ]]; then
      kill -9 $remaining 2>/dev/null || true
      sleep 0.3
    fi
  fi
}

# Resolve Python interpreter
PYTHON=""
if [[ -x "$API_DIR/.venv/bin/python" ]]; then
  PYTHON="$API_DIR/.venv/bin/python"
elif [[ -x "$PROJECT_ROOT/.venv/bin/python" ]]; then
  PYTHON="$PROJECT_ROOT/.venv/bin/python"
elif command -v python3 &>/dev/null; then
  PYTHON="$(command -v python3)"
else
  error "Python 3 is required but could not be found."
  exit 1
fi

# Ensure PYTHONPATH includes the FastAPI app directory
export PYTHONPATH="$API_DIR:${PYTHONPATH:-}"

# Check for pnpm / npm
PACKAGE_MANAGER="pnpm"
if ! command -v pnpm &>/dev/null; then
  if command -v npm &>/dev/null; then
    warn "pnpm is not installed. Falling back to npm."
    PACKAGE_MANAGER="npm"
  else
    error "Node package manager (pnpm or npm) is required."
    exit 1
  fi
fi

# Check frontend node_modules
if [[ ! -d "$DESKTOP_DIR/node_modules" ]]; then
  info "Installing desktop frontend dependencies..."
  (cd "$DESKTOP_DIR" && $PACKAGE_MANAGER install)
fi

# Process cleanup tracker
API_PID=""
FRONTEND_PID=""

cleanup() {
  echo ""
  info "Shutting down Career Companion services..."
  if [[ -n "$API_PID" ]] && kill -0 "$API_PID" 2>/dev/null; then
    kill "$API_PID" 2>/dev/null || true
  fi
  if [[ -n "$FRONTEND_PID" ]] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi
  wait 2>/dev/null || true
  success "All Career Companion services stopped."
}

trap cleanup EXIT INT TERM

echo ""
echo -e "${CYAN}==========================================================${NC}"
echo -e "${BOLD}  Career Companion — Local-First Workspace Environment${NC}"
echo -e "${CYAN}==========================================================${NC}"
echo -e "  Mode:            ${BOLD}${MODE}${NC}"
echo -e "  Python:          ${PYTHON}"
echo -e "  Package Manager: ${PACKAGE_MANAGER}"
echo -e "${CYAN}----------------------------------------------------------${NC}"

# Handle port 8000
if [[ "$FORCE_CLEAN" == true ]]; then
  free_port 8000
  free_port 1420
else
  # Check if port 8000 is occupied
  if lsof -i :8000 &>/dev/null; then
    if curl -sf http://127.0.0.1:8000/ &>/dev/null; then
      info "FastAPI backend is already running on http://127.0.0.1:8000"
    else
      warn "Port 8000 is occupied by a non-responsive process."
      free_port 8000
    fi
  fi
fi

# 1. Start FastAPI Backend if not already responding
if ! curl -sf http://127.0.0.1:8000/ &>/dev/null; then
  info "Starting Backend API (FastAPI) on http://127.0.0.1:8000..."
  "$PYTHON" -m uvicorn main:app --app-dir "$API_DIR" --host 127.0.0.1 --port 8000 --reload &
  API_PID=$!

  # Wait for backend to be healthy (up to 15 seconds)
  MAX_RETRIES=30
  RETRIES=0
  BACKEND_READY=false

  while [[ $RETRIES -lt $MAX_RETRIES ]]; do
    if curl -sf http://127.0.0.1:8000/ &>/dev/null; then
      BACKEND_READY=true
      break
    fi
    if ! kill -0 "$API_PID" 2>/dev/null; then
      error "FastAPI backend process died unexpectedly during startup."
      exit 1
    fi
    sleep 0.5
    RETRIES=$((RETRIES + 1))
  done

  if [[ "$BACKEND_READY" == false ]]; then
    error "FastAPI backend failed to respond within 15 seconds."
    exit 1
  fi
fi

success "Backend ready at http://127.0.0.1:8000"
echo -e "  Interactive Swagger Docs: ${CYAN}http://127.0.0.1:8000/docs${NC}"
echo ""

# 2. Start Frontend based on requested mode
if [[ "$MODE" == "desktop" ]]; then
  info "Launching Tauri Native Desktop Window..."
  (cd "$DESKTOP_DIR" && $PACKAGE_MANAGER tauri dev)
elif [[ "$MODE" == "api" ]]; then
  success "FastAPI Backend is running in standalone mode. Press Ctrl+C to stop."
  if [[ -n "$API_PID" ]]; then
    wait "$API_PID"
  else
    while true; do sleep 1; done
  fi
else
  # Web Mode
  if [[ "$FORCE_CLEAN" == true ]]; then
    free_port 1420
  fi

  info "Starting Web Client on http://localhost:1420..."
  echo -e "  Open your browser to: ${CYAN}${BOLD}http://localhost:1420${NC}"
  echo -e "  Press ${YELLOW}Ctrl+C${NC} at any time to shut down all services."
  echo -e "${CYAN}----------------------------------------------------------${NC}"

  (cd "$DESKTOP_DIR" && $PACKAGE_MANAGER dev) &
  FRONTEND_PID=$!
  wait "$FRONTEND_PID"
fi
