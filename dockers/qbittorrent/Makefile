export PUID = $(shell id -u midias)
export PGID = $(shell id -g midias)
export TZ = $(shell timedatectl show --property=Timezone --value)

up:
	docker compose up -d

down:
	docker compose down
