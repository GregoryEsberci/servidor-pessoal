# servidor-pessoal

Infraestrutura do meu servidor pessoal. Aqui estão os docker-compose, Dockerfile, scripts e configurações que uso pra manter os serviços funcionando.

## Serviços configurados

- **AdGuard Home + Unbound**  
  [dockers/adguard](https://github.com/GregoryEsberci/servidor-pessoal/tree/main/dockers/adguard)  
  DNS local com bloqueio de anúncios. AdGuard na frente, Unbound como resolver seguro.

- **Dozzle**  
  [dockers/dozzle](https://github.com/GregoryEsberci/servidor-pessoal/tree/main/dockers/dozzle)  
  Visualização de logs dos containers em tempo real e gerenciamento básico dos containers via interface web.

- **FileBrowser**  
  [dockers/filebrowser](https://github.com/GregoryEsberci/servidor-pessoal/tree/main/dockers/filebrowser)  
  Gerenciador de arquivos via navegador com autenticação.

- **Homepage**  
  [dockers/homepage](https://github.com/GregoryEsberci/servidor-pessoal/tree/main/dockers/homepage)  
  Dashboard com links e status dos serviços em execução.

- **Jellyfin**  
  [dockers/jellyfin](https://github.com/GregoryEsberci/servidor-pessoal/tree/main/dockers/jellyfin)  
  Servidor de mídia pessoal compatível com DLNA e streaming web.

- **MeTube**  
  [dockers/metube](https://github.com/GregoryEsberci/servidor-pessoal/tree/main/dockers/metube)  
  Interface web para baixar vídeos de diversas plataformas via yt-dlp.

- **Node Runner**  
  [dockers/node-runner](https://github.com/GregoryEsberci/servidor-pessoal/tree/main/dockers/node-runner)  
  Container efêmero para execução de scripts Node.js.

- **Python Runner**  
  [dockers/py-runner](https://github.com/GregoryEsberci/servidor-pessoal/tree/main/dockers/py-runner)  
  Container efêmero para execução de scripts Python.

- **qBittorrent**  
  [dockers/qbittorrent](https://github.com/GregoryEsberci/servidor-pessoal/tree/main/dockers/qbittorrent)  
  Cliente torrent com interface web.

- **SWAG (Secure Web Application Gateway)**  
  [dockers/swag](https://github.com/GregoryEsberci/servidor-pessoal/tree/main/dockers/swag)  
  Proxy reverso com Nginx, Let's Encrypt e suporte a múltiplos domínios.

- **Tailscale**  
  [dockers/tailscale](https://github.com/GregoryEsberci/servidor-pessoal/tree/main/dockers/tailscale)  
  VPN mesh baseada em WireGuard. Conecta dispositivos mesmo com NAT.

- **Watchtower**  
  [dockers/watchtower](https://github.com/GregoryEsberci/servidor-pessoal/tree/main/dockers/watchtower)  
  Atualização automática dos containers Docker.

- **yt-dlp**  
  [dockers/yt-dlp](https://github.com/GregoryEsberci/servidor-pessoal/tree/main/dockers/yt-dlp)  
  Ferramenta de linha de comando para baixar vídeos e áudios da web. Container efêmero.

## Estrutura de pastas

- [**/dockers**](https://github.com/GregoryEsberci/servidor-pessoal/tree/main/dockers)  
  Serviços utilizados no servidor. A ideia é manter tudo que for possível em containers pra facilitar manutenção, evitar conflitos entre libs e permitir fácil adição ou remoção de serviços.  
  - Todo containers que roda continuamente possui `healthcheck` configurado.  
  - Containers acessíveis via HTTP estão na rede `swag-net` e são expostos via subfolder no [Nginx do SWAG](https://github.com/GregoryEsberci/servidor-pessoal/tree/main/dockers/swag).

- [**/docs**](https://github.com/GregoryEsberci/servidor-pessoal/tree/main/docs)  
  Documentações e anotações diversas. Nem tudo foi aplicado de fato — algumas configurações foram revertidas ou abandonadas.

- [**/scripts**](https://github.com/GregoryEsberci/servidor-pessoal/tree/main/scripts)  
  Scripts bash genéricos, não atrelados a nenhum container específico.

- [**.bash_aliases**](https://github.com/GregoryEsberci/servidor-pessoal/tree/main/bash_aliases)  
  Alias pessoais para facilitar o uso diário. Um link simbólico é criado para o `~/.bash_aliases` no sistema.

## Estrutura dos containers

Todos os containers ficam na pasta `dockers/`, cada um com sua própria subpasta seguindo esta estrutura:

- **docker-compose.yml**  
  Configuração principal do container.

- **.env**  
  Variáveis de ambiente sensíveis ou específicas do ambiente. Ignorado pelo Git.

- **script/**  
  Scripts utilizados pelo container. Containers que rodam continuamente geralmente têm `up.sh` e `down.sh`.

- **data/**  
  Dados persistentes como cache, configs e metadata. Ignorado pelo Git.
