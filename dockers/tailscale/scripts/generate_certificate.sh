#!/bin/bash
set -euo pipefail

export SERVICE_DIR=$(realpath "$(dirname "${BASH_SOURCE[0]}")/..")
export DOCKERS_DIR=$(realpath "${SERVICE_DIR}/..")

HOST="server.adal-mine.ts.net"

echo "[1] Gerando certificado com tailscale..."
docker exec tailscale tailscale cert ${HOST}

echo "[2] Copiando certificados do container tailscale para host..."
docker cp tailscale:/var/lib/tailscale/certs/${HOST}.crt .
docker cp tailscale:/var/lib/tailscale/certs/${HOST}.key .

echo "[3] Movendo certificados para o container swag..."
sudo rm -f ${DOCKERS_DIR}/swag/data/config/keys/${HOST}.*
sudo cp ${HOST}.* ${DOCKERS_DIR}/swag/data/config/keys/.
sudo chown $USER:$USER ${DOCKERS_DIR}/swag/data/config/keys/${HOST}.*

rm -f ${HOST}.crt ${HOST}.key

echo "[4] Criando symlinks dentro do container swag..."
docker exec swag mkdir -p /config/etc/letsencrypt/live/${HOST}
docker exec swag ln -sf /config/keys/${HOST}.crt /config/etc/letsencrypt/live/${HOST}/fullchain.pem
docker exec swag ln -sf /config/keys/${HOST}.key /config/etc/letsencrypt/live/${HOST}/privkey.pem

echo "[5] Reiniciando swag..."
docker restart swag

echo "✅ HTTPS habilitado via Tailscale!"
echo "👉 https://${HOST}"
