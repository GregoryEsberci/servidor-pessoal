#!/bin/bash

export TZ=$(timedatectl show --property=Timezone --value)
export SERVICE_DIR=$(realpath "$(dirname "${BASH_SOURCE[0]}")/..")
export PUID=$(id -u midias)
export PGID=$(id -g midias)

db_file_path="$SERVICE_DIR/data/database/filebrowser.db"
settings_file_path="$SERVICE_DIR/data/config/settings.json"
settings_file_url="https://raw.githubusercontent.com/filebrowser/filebrowser/refs/heads/master/docker/common/defaults/settings.json"

if [ ! -f "$db_file_path" ]; then
  echo "Criando db file"

  mkdir -p "$(dirname "$db_file_path")"
  touch "$db_file_path"
  sudo chown -R "$PUID:$PGID" "$SERVICE_DIR/data"
fi

if [ ! -f $settings_file_path ]; then
  echo "Baixando config file"

  mkdir -p "$(dirname "$settings_file_path")"
  curl -sL $settings_file_url -o "$config_file"
  sudo chown -R "$PUID:$PGID" "$SERVICE_DIR/data"
fi

docker compose -f "$SERVICE_DIR/docker-compose.yml" up -d
