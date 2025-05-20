# Configurar Git

## Definir usuário global

```sh
git config --global user.email "<email>"
git config --global user.name "<nick_GitHub>"
```

## Gerar chave SSH (se ainda não tiver)

```sh
ssh-keygen -t rsa -b 4096 -C "<email>"
```

## Copiar chave pública

```sh
cat ~/.ssh/id_rsa.pub

# Usar output em https://github.com/settings/keys
```
