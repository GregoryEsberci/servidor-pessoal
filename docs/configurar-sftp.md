# Configurar SFTP

## Configurar estrutura das pastas

```sh
mkdir -p /mnt/hdd/public/data

sudo chown root:root /mnt/hdd/public
sudo chmod 755 /mnt/hdd/public

sudo chown root:root /mnt/hdd
sudo chmod 755 /mnt/hdd

sudo chown -R midias:midias /mnt/hdd/public/data
```

## Configurar o SFTP jail

```sh
sudo nano /etc/ssh/sshd_config
```

Adicionar no final do arquivo

```sh
Match User midias
  ChrootDirectory /mnt/hdd/public
  ForceCommand internal-sftp
  AllowTcpForwarding no
  X11Forwarding no
  PasswordAuthentication yes
```
