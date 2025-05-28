#!/bin/bash

export TZ=$(timedatectl show --property=Timezone --value)
export SERVICE_DIR=$(realpath "$(dirname "${BASH_SOURCE[0]}")/..")

docker compose -f "$SERVICE_DIR/docker-compose.yml" up -d