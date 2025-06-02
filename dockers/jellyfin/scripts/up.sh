#!/bin/bash

export PUID=$(id -u midias)
export PGID=$(id -g midias)
export SERVICE_DIR=$(realpath "$(dirname "${BASH_SOURCE[0]}")/..")

data_folder="$SERVICE_DIR/data"

if [ ! -d "$data_folder" ]; then
  echo "Criando estrutura das pastas"

  mkdir -p "$data_folder/config" "$data_folder/cache"
  
  sudo chown -R "$PUID:$PGID" "$data_folder"
fi

docker compose -f "$SERVICE_DIR/docker-compose.yml" up -d