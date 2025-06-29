#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-8080}"

log() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*" >&2
}

handle_request() {
  set -euo pipefail

  log "Incoming request"

  up_count=$(docker ps --format '{{.Names}}' | wc -l)
  exited_count=$(docker ps --filter "status=exited" --format '{{.Names}}' | wc -l)
  unhealthy_count=$(docker ps --filter "health=unhealthy" --format '{{.Names}}' | wc -l)

  total_errors=$((exited_count + unhealthy_count))

  if [[ "$total_errors" -gt 0 ]]; then
    status="unhealthy"
  else
    status="healthy"
  fi

  json="{\"status\":\"$status\",\"up\":$up_count,\"error\":$total_errors}"

  log "Responding with: $json"

  printf "HTTP/1.1 200 OK\r\n"
  printf "Content-Type: application/json\r\n"
  printf "Content-Length: %s\r\n" "${#json}"
  printf "\r\n"
  printf "%s" "$json"
}

export -f handle_request
export -f log

log "Starting Docker status API on port $PORT"
socat TCP-LISTEN:"$PORT",reuseaddr,fork SYSTEM:"bash -c handle_request"
