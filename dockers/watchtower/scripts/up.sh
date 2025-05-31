#!/bin/bash

export TZ=$(timedatectl show --property=Timezone --value)
export SERVICE_DIR=$(realpath "$(dirname "${BASH_SOURCE[0]}")/..")
export PASSWORD=$(cat ~/.secrets/email_pass)

docker compose -f "$SERVICE_DIR/docker-compose.yml" up -d