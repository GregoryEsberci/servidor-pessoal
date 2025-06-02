#!/bin/bash

service_dir=$(realpath "$(dirname "${BASH_SOURCE[0]}")/..")
script="$1"
user="$2"

print_scripts() { 
  echo
  echo "Scripts disponiveis:"
  find "$service_dir/scripts-py/" -maxdepth 1 -mindepth 1 -type d -printf '%f\n'
}

if [[ "$EUID" -ne 0 ]]; then
  echo "Execute como root"
  exit 1
fi

if [ -z "$script" ]; then
  echo "Uso: $0 <script> <usuario>"
  echo "Exemplo: sudo $0 make_backup test"
  print_scripts
  exit 1
fi

if ! id -u "$user" >/dev/null 2>&1; then
  echo "O usuário \"$user\" não existe."
  exit 1
fi

SCRIPT_DIR="$service_dir/scripts-py/$script"

if [ ! -d "$SCRIPT_DIR" ]; then
  echo "Script $script não encontrado"
  print_scripts
  exit 1
fi

export SCRIPT_TO_RUN=$1
export CURRENT_UID=$(id $user -u)
export CURRENT_GID=$(id $user -g)
export EXEC_PWD=$PWD

yelow=$(tput setaf 3)
bold=$(tput bold)
sgr0=$(tput setaf sgr0)

echo
read -p "Executar ${bold}\"${script}\"${sgr0} com o usuário ${bold}\"${user}\"${sgr0}? (y/N): " resposta

if [[ "${resposta,,}" != "y" ]]; then
  echo "Cancelado."
  exit 1
fi

docker compose -f "$service_dir/docker-compose.yml" run --rm py-runner --build
