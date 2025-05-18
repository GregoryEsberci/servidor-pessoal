# Configurar o laptop para não suspender ao fechar a tampa

Edite o arquivo `/etc/systemd/logind.conf`:

```sh
sudo nano /etc/systemd/logind.conf
```

Altere as seguintes regras

```ini
HandleLidSwitch=ignore
HandleLidSwitchExternalPower=ignore
```

## O que faz

- `HandleLidSwitch=ignore`: Não faz nada ao fechar a tampa **na bateria**
- `HandleLidSwitchExternalPower=ignore`: Não faz nada ao fechar a tampa **na tomada**
