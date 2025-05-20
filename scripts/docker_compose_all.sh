#!/bin/bash

source "$(dirname "$0")/setup.sh"

COMMAND="$@"

if [ -z "$COMMAND" ]; then
  throw "Você deve fornecer um comando para o docker compose"
fi

if [ ! -d "$DOCKERS_DIR" ]; then
  throw "Diretório dockers não encontrado em $DOCKERS_DIR"  
fi

for dir in "$DOCKERS_DIR"/*/; do
  compose_file="$dir/docker-compose.yml"

  if [ -f "$compose_file" ]; then
    echo ""
    echo "============================================================"
    log "Processando: $(basename "$dir")"
    echo "============================================================"
    docker compose -f "$compose_file" $COMMAND
    echo ""
  fi
done
