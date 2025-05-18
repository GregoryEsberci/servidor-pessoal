# Comandos iniciais

```sh
sudo apt update && sudo apt upgrade -y

sudo apt full-upgrade -y

sudo apt autoremove -y && sudo apt autoclean

sudo apt install -y curl wget git htop ufw net-tools software-properties-common fail2ban

sudo timedatectl set-timezone America/Sao_Paulo

sudo ufw allow OpenSSH && sudo ufw enable

# Atualizações automáticas
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades
```
