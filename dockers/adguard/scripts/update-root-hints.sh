#!/bin/bash
set -e

SERVICE_DIR=$(realpath "$(dirname "${BASH_SOURCE[0]}")/..")
UNBOUND_DIR="$SERVICE_DIR/data/unbound/var"

echo "🔄 Baixando root.hints..."
sudo curl -sSL -o "${UNBOUND_DIR}/root.hints" https://www.internic.net/domain/named.root

echo "🔑 Atualizando root.key..."
docker compose -f "$SERVICE_DIR/docker-compose.yml" exec  adguard-unbound unbound-anchor -a /opt/unbound/etc/unbound/var/root.key

echo "✅ Atualização concluída."
