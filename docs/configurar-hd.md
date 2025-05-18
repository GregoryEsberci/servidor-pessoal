# Configuração de HD

## **1. Identificação do HD**

Listar discos disponíveis:

```bash
sudo lsblk -f
```

- **HD alvo**: `/dev/sda` (vazio, sem partições)
- **SSD do sistema**: `/dev/nvme0n1`

---

## **2. Criação da Partição**

Entrar no `fdisk`:

```bash
sudo fdisk /dev/sda
```

Comandos executados:

- `n` → Nova partição
- `Enter` → Aceitar padrões (partição única ocupando todo o disco)
- `Y` → Remover assinatura `vfat` existente
- `w` → Salvar alterações

---

## **3. Formatação para ext4**

Formatar a partição `/dev/sda1`:

```bash
sudo mkfs.ext4 /dev/sda1
```

**Output esperado**:

```txt
Filesystem UUID: f141a173-9bfe-4826-b1dd-383d9149cc69
```

---

## **4. Montagem Manual (Teste)**

Criar ponto de montagem e montar:

```bash
sudo mkdir -p /mnt/hdd
sudo mount /dev/sda1 /mnt/hdd
```

---

## **5. Montagem Automática (fstab)**

Editar o arquivo `/etc/fstab`:

```bash
sudo nano /etc/fstab
```

Adicionar linha (com UUID correto):

```txt
UUID=f141a173-9bfe-4826-b1dd-383d9149cc69  /mnt/hdd  ext4  defaults,nofail  0  2
```

Recarregar configurações:

```bash
sudo systemctl daemon-reload
sudo mount -a
```

---

## **6. Correção de Permissões**

Definir usuário como dono do diretório:

```bash
sudo chown -R $USER:$USER /mnt/hdd
```

---

## **7. Verificação Final**

Checar se o HD está montado:

```bash
df -h /mnt/hdd
```

Saída esperada:

```txt
/dev/sda1       916G   24K  916G   1% /mnt/hdd
```

---

## **Notas Adicionais**

- **UUID**: Sempre use o UUID do seu sistema (ver com `sudo blkid`).
