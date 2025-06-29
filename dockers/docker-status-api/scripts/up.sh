#!/bin/bash

export SERVICE_DIR=$(realpath "$(dirname "${BASH_SOURCE[0]}")/..")

docker compose -f "$SERVICE_DIR/docker-compose.yml" up -d