# Instalar docker e docker compose v2

source: [Step-by-Step Tutorial: Installing Docker and Docker Compose on Ubuntu](https://medium.com/@tomer.klein/step-by-step-tutorial-installing-docker-and-docker-compose-on-ubuntu-a98a1b7aaed0)

```sh
sudo apt update && sudo apt upgrade -y
```

```sh
sudo apt install -y ca-certificates curl gnupg lsb-release
```

```sh
sudo mkdir -p /etc/apt/keyrings

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```

```sh
sudo echo  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
```

```sh
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

```sh
sudo systemctl enable docker
```

```sh
sudo groupadd docker
sudo usermod -aG docker $USER

# reinicia o terminal ou rodar o seguinte comando
newgrp docker
```
