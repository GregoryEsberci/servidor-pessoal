#!/bin/bash

env_file=$(realpath "$(dirname "${BASH_SOURCE[0]}")/.env")

if [ -f $env_file ]; then
    set -a
    source $env_file
    set +a
fi

export PROJECT_ROOT=$(realpath "$(dirname "${BASH_SOURCE[0]}")/..")
export DOCS_DIR="$PROJECT_ROOT/docs"
export DOCKERS_DIR="$PROJECT_ROOT/dockers"

go_to_docs() {
  if [ -d "$DOCS_DIR" ]; then
    cd "$DOCS_DIR" || return 1
  else
    echo "Erro: Diretório docs não encontrado em $DOCS_DIR"
    return 1
  fi
}

go_to_dockers() {
  if [ -d "$DOCKERS_DIR" ]; then
    cd "$DOCKERS_DIR" || return 1
  else
    echo "Erro: Diretório dockers não encontrado em $DOCKERS_DIR"
    return 1
  fi
}

log() {
  echo -e "\033[32m[INFO]\033[0m $1"
}

throw() {
  echo -e "\033[31m[ERRO]\033[0m $1" >&2
  exit 1
}
