# Configurar Adaptador USB Ethernet (TP-Link UE306)

## **1. Identificação do Adaptador**

Listar dispositivos USB:

```sh
lsusb
```

Saída

```txt
[...] ASIX Electronics Corp. AX88179 Gigabit Ethernet
```

Verificar nome da interface gerado:

```sh
ip link show | grep enx # ex: enx1234abcd
```

## **2. Testar funcionamento manualmente**

Habilitar interface e requisitar IP:

```sh
sudo ip link set enx1234abcd up
sudo dhclient -v enx1234abcd
```

## **3. Configuração persistente**

Use este comando para identificar interfaces que não estão em uso, mas ainda são gerenciadas:

```bash
networkctl list
```

Verifique interfaces com:

* `SETUP: unmanaged` - ignoradas (não precisam estar no YAML)
* `OPERATIONAL: no-carrier` e `SETUP: configuring` - se não forem usadas, defina  no arquivo

Exemplo: interfaces onboard sem cabo `enp3s0`

Edite (ou criar) o arquivo Netplan para configurar a interface automaticamente:

```sh
sudo nano /etc/netplan/01-enx.yaml
```

Adicionar o conteúdo:

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    # Exemplo de interface desabilitada
    enp3s0:
      match:
        name: nonexistent
      dhcp4: false

    enx1234abcd:
      dhcp4: true
      optional: false
```

Ajuste as permissões do arquivo

```sh
sudo chmod 600 /etc/netplan/01-enx.yaml
```

Aplicar mudanças:

```sh
sudo netplan apply
```

Reinicie o sistema

```sh
sudo reboot
```

## **Notas**

* O `systemd-networkd-wait-online` pode atrasar o boot se interfaces não usadas (como `enp3s0`) não forem desabilitadas.
