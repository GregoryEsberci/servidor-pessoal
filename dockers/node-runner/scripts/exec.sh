#!/bin/bash

service_dir=$(realpath "$(dirname "${BASH_SOURCE[0]}")/..")
script="$1"
user="${2:-$(id -nu)}" # $2 || usuário atual (id -nu)

print_scripts() {
  echo
  echo "Scripts disponíveis:"
  find "$service_dir/scripts-js/" -maxdepth 1 -mindepth 1 -type d -printf '%f\n'
}

if [ -z "$script" ]; then
  echo "Uso: $0 <script>"
  echo "Exemplo: $0 hello_world"
  print_scripts
  exit 1
fi

SCRIPT_DIR="$service_dir/scripts-js/$script"

if [ ! -d "$SCRIPT_DIR" ]; then
  echo "Script $script não encontrado"
  print_scripts
  exit 1
fi

export SCRIPT_TO_RUN=$script
export USER_UID=$(id $user -u)
export USER_GID=$(id $user -g)
export GID_MIDIAS=$(id -g midias)
export EXEC_PWD=$PWD

docker compose -f "$service_dir/docker-compose.yml" run --rm node-runner --build
