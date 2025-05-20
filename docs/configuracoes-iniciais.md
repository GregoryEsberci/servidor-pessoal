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

## Próximos passos

- [configurar-docker-compose.md](https://github.com/GregoryEsberci/servidor-pessoal/blob/main/docs/configurar-docker-compose.md)

- [limitar-logs-containers.md](https://github.com/GregoryEsberci/servidor-pessoal/blob/main/docs/limitar-logs-containers.md)

- [configurar-git.md](https://github.com/GregoryEsberci/servidor-pessoal/blob/main/docs/configurar-git.md)

- [configurar-ssh.md](https://github.com/GregoryEsberci/servidor-pessoal/blob/main/docs/configurar-ssh.md)
