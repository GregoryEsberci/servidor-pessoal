export PUID = $(shell id -u $(user))
export PGID = $(shell id -g $(user))
export UID_MIDIAS = $(shell id -u midias)
export GID_MIDIAS = $(shell id -g midias)

APP_RUN = docker compose run --rm --entrypoint "$(ENTRYPOINT)" node-runner

run:
	${APP_RUN}

bash: ENTRYPOINT = bash
bash:
	${APP_RUN}

lint: ENTRYPOINT = yarn --cwd scripts-js lint
lint:
	${APP_RUN}

lint-fix: ENTRYPOINT = yarn --cwd scripts-js lint --fix
lint-fix:
	${APP_RUN}

typecheck: ENTRYPOINT = yarn --cwd scripts-js typecheck
typecheck:
	${APP_RUN}

up:
	docker compose up -d node-runner-api

down:
	docker compose down node-runner-api
