#!/bin/bash

export TZ=$(timedatectl show --property=Timezone --value)
export SERVICE_DIR=$(realpath "$(dirname "${BASH_SOURCE[0]}")/..")
export NEXTCLOUD_TRUSTED_DOMAINS="localhost 127.0.0.1 ::1 $(hostname -I | cut -d ' ' -f 1) 172.23.0.2 nextcloud"

docker compose -f "$SERVICE_DIR/docker-compose.yml" up -d
