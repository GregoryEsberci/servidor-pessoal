#!/bin/bash

export TZ=$(timedatectl show --property=Timezone --value)
export SERVICE_DIR=$(realpath "$(dirname "${BASH_SOURCE[0]}")/..")
export HOMEPAGE_ALLOWED_HOSTS="$(curl -s ifconfig.me),$(hostname -I | cut -d " " -f 1)"

docker compose -f "$SERVICE_DIR/docker-compose.yml" up -d