# Configurar o msmtp

<!-- Bom, não vou usar mais, mas não tem pq apagar já q a doc tá pronta -->

Usado pra enviar email

----

Edite o arquivo de configs

```sh
sudo nano /etc/msmtprc
```

Inserir as configurações, obviamente precisa substituir o `email@gmail.com` e `<USER>`, o `from` e `user` devem ser o mesmo já q está sendo usado o gmail

```sh
defaults
auth           on
tls            on
tls_trust_file /etc/ssl/certs/ca-certificates.crt

account        default
host           smtp.gmail.com
port           587
from           email@gmail.com
user           email@gmail.com
passwordeval   "cat /home/<USER>/.secrets/email_pass"
```

Ajustar permissões do arquivo

```sh
sudo chown root:root /etc/msmtprc
sudo chmod 644 /etc/msmtprc
```

Testar

```sh
echo | msmtp -P # Deve exibir as configs atualizadas
```

```sh
echo "teste de email" | msmtp email@gmail.com
```
