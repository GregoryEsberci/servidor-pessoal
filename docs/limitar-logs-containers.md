# Configure para limitar logs dos containers

## Abre o arquivo

```sh
sudo nano /etc/logrotate.d/docker
```

## Colocar/editar o conteúdo

```conf
/var/lib/docker/containers/*/*.log {
  rotate 7
  daily
  compress
  size=10M
  missingok
  delaycompress
  copytruncate
}
```

### Significado

`Rotate 7` Mantém 7 arquivos de log rotacionados antes de apagar os mais antigos. Ou seja, guarda uma semana de logs (se combinado com daily).

`daily` Rota os logs diariamente. Alternativas: weekly, monthly, ou size-based (ex: size=100M).

`compress` Comprime os logs rotacionados (usando gzip por padrão), economizando espaço. Os arquivos ficarão com extensão .gz.

`size=10M` Rota o log se atingir 10MB, mesmo que não seja o final do dia (útil para serviços muito ativos). Se não especificar, só usa o critério de tempo (daily).

`missingok` Ignora se o arquivo de log não existir.

`delaycompress` Comprime no próximo ciclo: Mantém o log mais recente descomprimido por um ciclo (útil para serviços que ainda podem estar escrevendo no arquivo).

`copytruncate` Copia e depois esvazia o log original, em vez de mover/reiniciar o arquivo. Evita problemas com serviços que mantêm o arquivo aberto (como containers Docker). Pode perder algumas linhas de log durante a rotação, mas é mais seguro para Docker.
