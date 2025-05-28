# Configurar SFTP nextcloud

# Configurar estrutura das pastas

```sh
mkdir -p /mnt/hdd/public/data

sudo chown root:root /mnt/hdd/public
sudo chmod 755 /mnt/hdd/public

sudo chown root:root /mnt/hdd
sudo chmod 755 /mnt/hdd

sudo chown -R midias:midias /mnt/hdd/public/data
```

# Configurar o SFTP jail

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

# Configurar nextcloud

```sh
# Concede acesso aos conteiners na porta do ssh
sudo ufw allow from 172.16.0.0/12 to any port 22 proto tcp
```

No painel do next cloud (http://nextcloud.host/settings/admin/externalstorages) adicione o armazenamento externo com as seguintes configurações

- Autenticação por login/senha
- Host: ip local da maquina (`hostname -I | cut -d " " -f 1`)
- Porta: 22
- Raiz: /data
- Login: midias
- Senha: ********

