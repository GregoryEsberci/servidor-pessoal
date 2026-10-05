export PUID=$(id -u midias)
export PGID=$(id -g midias)
export SERVICE_DIR=$(realpath "$(dirname "${BASH_SOURCE[0]}")/..")

up:
	docker compose up -d

down:
	docker compose down
