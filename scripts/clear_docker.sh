#!/bin/bash

echo "Este script removerá:"
echo "- Todos os containers parados"
echo "- Todas as imagens não utilizadas"
echo "- Todas as redes não utilizadas"
echo "- Todos os volumes não utilizados"
echo "- Todo o cache de build"

echo ""

read -p "Deseja continuar? (s/N) " -n 1 -r

echo ""

if [[ ! $REPLY =~ ^[Ss]$ ]]; then
  echo "Operação cancelada."
  exit 0
fi

echo ""

echo "Iniciando limpeza..."

echo "Removendo containers parados..."
docker container prune -f

echo "Removendo imagens não utilizadas..."
docker image prune -a -f

echo "Removendo redes não utilizadas..."
docker network prune -f

echo "Removendo volumes não utilizados..."
docker volume prune -f

echo "Removendo cache de build..."
docker builder prune -f

echo "Limpeza concluída"