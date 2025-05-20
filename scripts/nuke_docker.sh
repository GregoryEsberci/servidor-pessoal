#!/bin/bash

source "$(dirname "$0")/setup.sh"

cat << "EOF"

=== ATENÇÃO ===
ESTE SCRIPT VAI REMOVER *TUDO* DO DOCKER:
- Todos os containers (parados e ativos)
- Todas as imagens
- Todos os volumes (DADOS PERMANENTES SERÃO PERDIDOS)
- Todas as networks (exceto as padrões)
- Todo o cache de builds

ISSO É IRREVERSÍVEL!

EOF
read -p "Continuar? (Digite EXCLUIR para confirmar): " resposta
if [[ "$resposta" != "EXCLUIR" ]]; then
    echo "Cancelado. Nada foi apagado."
    exit 1
fi

log "Limpando TUDO do Docker..."
docker stop $(docker ps -aq) 2>/dev/null
docker rm -fv $(docker ps -aq) 2>/dev/null
docker rmi -f $(docker images -aq) 2>/dev/null
docker volume rm -f $(docker volume ls -q) 2>/dev/null
docker network prune -f 2>/dev/null
docker builder prune -af 2>/dev/null
docker system prune -af --volumes 2>/dev/null

echo ""
log "=== VERIFICAÇÃO FINAL ==="
docker system df
log  "Pronto! Docker resetado para o estado inicial."
