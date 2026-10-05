#!/bin/bash

service_dir=$(realpath "$(dirname "${BASH_SOURCE[0]}")/..")
script="$1"
shift

user="${user:-$(id -nu)}"

print_scripts() {
  echo
  echo "Scripts disponíveis:"
  find "$service_dir/scripts-js/" -maxdepth 1 -mindepth 1 -type d -printf '  - %f\n'
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

export EXEC_PWD=$PWD

ENTRYPOINT=$(printf '%q ' "yarn" "--cwd" "scripts-js" "start" "$script/index" "$@")

make -C "$service_dir" run ENTRYPOINT="${ENTRYPOINT}" user="${user}"