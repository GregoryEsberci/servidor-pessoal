#!/bin/bash

source "$(dirname "$0")/setup.sh"

COMMAND="$@"

if [ -z "$COMMAND" ]; then
  throw "Você deve fornecer um comando."
fi

if [ ! -d "$DOCKERS_DIR" ]; then
  throw "Diretório dockers não encontrado em $DOCKERS_DIR"
fi

echo "Diretório base: $(tput bold)$DOCKERS_DIR$(tput sgr0)"
echo ""
echo "Comando a ser executado: $(tput bold)$COMMAND$(tput sgr0)"
echo ""

read -p "Deseja continuar? (s/N) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
  echo "Operação cancelada."
  exit 0
fi

echo ""

shopt -s expand_aliases
source ~/.bash_aliases 2>/dev/null || true 

for dir in "$DOCKERS_DIR"/*/; do
  echo "============================================================"
  log "Processando: $(tput bold)$(basename "$dir")$(tput sgr0)"
  echo "============================================================"
  (  # subshell para não afetar o diretório do script
    cd "$dir" || exit
    eval "$COMMAND"  # eval pra poder usar aliases
  )
  echo ""
done
