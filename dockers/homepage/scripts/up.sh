#!/bin/bash

export TZ=$(timedatectl show --property=Timezone --value)
export SERVICE_DIR=$(realpath "$(dirname "${BASH_SOURCE[0]}")/..")
export HOMEPAGE_ALLOWED_HOSTS="$(curl -s ifconfig.me),$(hostname -I | sed -r "s/ /,/g")"

docker compose -f "$SERVICE_DIR/docker-compose.yml" up -d