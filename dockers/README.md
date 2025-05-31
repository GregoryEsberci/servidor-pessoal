# Portas usadas por containers Docker

Este documento descreve as portas utilizadas por serviços em containers Docker, seguindo uma convenção interna para evitar conflitos.

## Padrão de portas: `9yxx`

- `xx`: identificador único por `docker-compose.yml` (projeto).
- `y`: identificador único por serviço dentro do projeto.

## Serviços registrados

| **Serviço**         | **Porta** |
|---------------------|-----------|
| Portainer           | 9000      |
| qBittorrent         | 9001      |
| Homepage            | 80        |
| Filebrowser         | 9002      |
| AdGuard Home        | 9003      |
