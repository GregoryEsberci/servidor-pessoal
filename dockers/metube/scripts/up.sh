#!/bin/bash

export SERVICE_DIR=$(realpath "$(dirname "${BASH_SOURCE[0]}")/..")
export PUID=$(id -u midias)
export PGID=$(id -g midias)

docker compose -f "$SERVICE_DIR/docker-compose.yml" up -d
