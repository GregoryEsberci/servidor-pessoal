# Configurar git

```sh
git config --global user.email "<email>"
git config --global user.name "<nick_GitHub>"

# Se não tiver chave ssh gerada
ssh-keygen -t rsa -b 4096 -C "<email>"

# Copiar conteúdo para cadastrar no https://github.com/settings/keys
cat ~/.ssh/id_rsa.pub
```
