# Configurar SSH

## Liberar SSH no firewall

```sh
sudo ufw allow OpenSSH
```

## Editar configurações do SSH

```sh
sudo nano /etc/ssh/sshd_config

# Alterar/setar
PermitRootLogin no
PasswordAuthentication no
```
