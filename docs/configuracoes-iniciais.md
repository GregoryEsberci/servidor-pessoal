# Configurações iniciais

## Atualizar sistema

```sh
sudo apt update && sudo apt upgrade -y

sudo apt full-upgrade -y

sudo apt autoremove -y && sudo apt autoclean
```

Ou em um só input

```sh
sudo apt update && sudo apt upgrade -y && sudo apt full-upgrade -y && sudo apt autoremove -y && sudo apt autoclean
```

## Instalar libs básicas

```sh
sudo apt install -y curl wget git htop ufw net-tools software-properties-common fail2ban
```

## Setar timezone

```sh
sudo timedatectl set-timezone America/Sao_Paulo
```

## Habilitar firewall

```sh
# Se estiver conectado por ssh execute isso antes de habilitar
sudo ufw allow OpenSSH

sudo ufw enable
```

## Habilitar atualizações automaticas

```sh
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades
```

## Criar usuario "midias"

Ele é usado por alguns containers

```sh
sudo adduser midias
```

## Configurar atalhos do .bashrc

```sh
printf '\n' >> ~/.bashrc
printf 'bind '\''"\\e[A": history-search-backward'\''  # Seta ↑ busca histórico\n' >> ~/.bashrc
printf 'bind '\''"\\e[B": history-search-forward'\''   # Seta ↓ continua busca\n' >> ~/.bashrc
```

## Próximos passos

- [Configurar Docker e Docker Compose v2](https://github.com/GregoryEsberci/servidor-pessoal/blob/main/docs/configurar-docker-compose.md)

- [Limitar logs dos containers](https://github.com/GregoryEsberci/servidor-pessoal/blob/main/docs/limitar-logs-containers.md)

- [Configurar Git](https://github.com/GregoryEsberci/servidor-pessoal/blob/main/docs/configurar-git.md)

- [Configurar SSH](https://github.com/GregoryEsberci/servidor-pessoal/blob/main/docs/configurar-ssh.md)
