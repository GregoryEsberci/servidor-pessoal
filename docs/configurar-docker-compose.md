# Configurar Docker e Docker Compose v2

source: [Step-by-Step Tutorial: Installing Docker and Docker Compose on Ubuntu](https://medium.com/@tomer.klein/step-by-step-tutorial-installing-docker-and-docker-compose-on-ubuntu-a98a1b7aaed0)

## Atualizar sistema

```sh
sudo apt update && sudo apt upgrade -y
```

## Instalar dependências

```sh
sudo apt install -y ca-certificates curl gnupg lsb-release
```

## Adicionar chave GPG do Docker

```sh
sudo mkdir -p /etc/apt/keyrings

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```

## Adicionar repositório do Docker

```sh
sudo echo  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
```

## Instalar Docker e plugins

```sh
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

## Ativar Docker na inicialização

```sh
sudo systemctl enable docker
```

## Adicionar usuário ao grupo docker

```sh
sudo groupadd docker
sudo usermod -aG docker $USER

# Reiniciar terminal ou executar
newgrp docker
```
