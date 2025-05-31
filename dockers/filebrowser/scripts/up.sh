#!/bin/bash

export TZ=$(timedatectl show --property=Timezone --value)
export SERVICE_DIR=$(realpath "$(dirname "${BASH_SOURCE[0]}")/..")
export PUID=$(id -u midias)
export PGID=$(id -g midias)

mkdir -p "$SERVICE_DIR/data"

db_file="$SERVICE_DIR/data/filebrowser.db"
config_file="$SERVICE_DIR/data/filebrowser.json"

if [ ! -f "$db_file" ]; then
    echo "Criando db file"

    touch "$db_file"
    sudo chown "$PUID:$PGID" "$db_file"
fi

if [ ! -f $config_file ]; then
    echo "Criando config file"

    cat > $config_file <<EOF
{
  "port": 80,
  "baseURL": "",
  "address": "",
  "log": "stdout",
  "database": "/filebrowser.db",
  "root": "/srv"
}
EOF

  sudo chown "$PUID:$PGID" "$config_file"
fi

docker compose -f "$SERVICE_DIR/docker-compose.yml" up -d
