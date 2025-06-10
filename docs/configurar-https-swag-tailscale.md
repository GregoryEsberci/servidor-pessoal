# Habilitar HTTPS no SWAG com Tailscale

Substitua o `host.nome.ts.net` pela url fornecida pelo tailscale em todos os pontos.

## **1. Preparar container SWAG**

No `.env`, defina o hostname do Tailscale:

```env
URL=host.nome.ts.net
````

Suba o container SWAG (vai falhar na emissão do cert, tudo certo).

## **2. Gerar certificado com Tailscale**

Siga a [doc oficial do Tailscale](https://tailscale.com/kb/1153/enabling-https) para ativar HTTPS no painel e gerar o certificado.

```sh
docker exec tailscale tailscale cert host.nome.ts.net
```

O certificado gerado fica disponível no container Tailscale em:

```sh
/var/lib/tailscale/certs/
```

## **3. Copiar os certificados**

Copie os certificados gerados para o container do swag

`volume_tailscale` = `/var/lib/tailscale` dentro do container
`volume_swag` = `/config` dentro do container

<!-- Provavelmente tem como simplificar, mas enfim -->
```sh
su
cd <volume_tailscale>/certs
sudo cp host.nome.ts.net.* <volume_swag>/keys/.
exit
sudo chown $USER:$USER <volume_swag>/keys/host.nome.ts.net.*
```

## **4. Linkar os certificados no SWAG**

Entre no container SWAG:

```sh
docker exec -it swag bash
```

Execute:

```sh
mkdir -p /config/etc/letsencrypt/live/$URL
ln -s /config/keys/$URL.crt /config/etc/letsencrypt/live/$URL/fullchain.pem
ln -s /config/keys/$URL.key /config/etc/letsencrypt/live/$URL/privkey.pem
```

## **5. Reiniciar o SWAG**

```sh
docker restart swag
```

Agora o acesso HTTPS via Tailscale estará funcionando com certificado válido:

```txt
https://host.nome.ts.net
```
