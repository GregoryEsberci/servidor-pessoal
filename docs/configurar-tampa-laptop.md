# Evitar suspensão ao fechar a tampa do laptop

## Editar logind.conf

```sh
sudo nano /etc/systemd/logind.conf
```

## Alterar comportamentos ao fechar a tampa

```ini
HandleLidSwitch=ignore
HandleLidSwitchExternalPower=ignore
```

## O que faz

* `HandleLidSwitch=ignore`: ignora o fechamento da tampa na bateria
* `HandleLidSwitchExternalPower=ignore`: ignora o fechamento da tampa na tomada
