#!/bin/bash

set -e
set -o pipefail

source "$(dirname "$0")/setup.sh"

work_dir="/tmp/make_backup-$(uuidgen)"
mkdir -p "$work_dir"

log_file="$work_dir/make_backup.log"

exec > >(
  while IFS= read -r line; do
    echo -e "\033[38;5;39m[$(date '+%d/%m/%Y %H:%M:%S')]\033[0m ${line}";
  done | tee "$log_file"
) 2>&1

timestamp=$(date +%s)
backup_time=$(date -d @"$timestamp" +%d-%m-%Y_%H-%M-%S)
formatted_time=$(date -d @"$timestamp" "+%d/%m/%Y %H:%M:%S")
backup_root_dir="$work_dir/$backup_time"
backup_dockers_dir="$backup_root_dir/dockers"

email_to=$BACKUP_EMAIL
backup_pass_file=~/.secrets/backup_pass

cleanup() {
  rm -rf "$work_dir"
}

get_msmtp_email() {
  echo | msmtp -P | awk '/^from = / { print $3 }' | head -n 1
}

send_email() {
  local subject="$1"
  local body="$2"
  local sender_email
  sender_email=$(get_msmtp_email)

  {
    echo "Subject: $subject"
    echo "From: Backup <${sender_email}>"
    echo "Content-Type: text/html"
    echo ""
    echo "<html><body>"
    echo "<p>$body</p>"
    echo "<hr style='border: none;height: 1px;background-color: #333;'>"
    echo "<h4 style='margin: 0;'>Logs:</h4>"
    echo "<pre style='background-color:#181818; color:#fff; padding:10px; font-family: monospace; white-space: pre-wrap;'>"
    aha --no-header < "$log_file"
    echo "</pre>"
    echo "</body></html>"
  } | msmtp "$email_to"
}

notify_error() {
  send_email "Backup falhou" "Backup falhou em $formatted_time"
  exit 1
}

verify_backup() {
  local backup_file="$1"

  if ! gpg --decrypt --passphrase-file "$backup_pass_file" --batch "$backup_file" | \
     tar -tzf - >/dev/null 2>&1; then
    throw "Verificação falhou para \"$backup_file\"" || true
    return 1
  fi

  log "Backup verificado com sucesso: "${backup_file//$backup_root_dir'/'/}""

  return 0
}

get_gdrive_url() {
  local folder_name="$backup_time"
  local folder_id
  folder_id=$(rclone lsjson "gdrive:/backups/" --no-mimetype --no-modtime --dirs-only | 
              jq -r --arg name "$folder_name" '.[] | select(.Name == $name) | .ID')

  if [[ -n "$folder_id" ]]; then
    echo "https://drive.google.com/drive/folders/$folder_id"
  else
    throw "Não foi encontrado encontrado o backups/$backup_time no Google Drive" || true
    echo "https://drive.google.com/drive/folders"
  fi
}

trap 'notify_error' ERR
trap 'cleanup' EXIT

if [[ "$EUID" -ne 0 ]]; then
  throw "Execute como root"
fi

mkdir -p "$backup_dockers_dir"

log "Backup id: $backup_time"

for service_path in "$DOCKERS_DIR"/*; do
  if [[ "${service_path##*/}" == *.md ]]; then
    continue
  fi

  service_name=$(basename "$service_path")
  output_file="$backup_dockers_dir/${service_name}.tar.gz.gpg"

  log "Processando docker $service_name"

  tmp_tar_file="$work_dir/${service_name}.tar.gz"
  if ! tar --preserve-permissions --same-owner -czf "$tmp_tar_file" "$service_path"; then
    throw "Falha ao criar o tar de $service_path"
  fi

  if ! gpg --symmetric --cipher-algo AES256 \
           --passphrase-file "$backup_pass_file" \
           --batch --yes \
           -o "$output_file" "$tmp_tar_file"; then
    throw "Falha ao criptografar $tmp_tar_file"
  fi

  verify_backup "$output_file"

  echo
done

log "Calculando tamanho total do backup"
total_size=$(du -sh "$backup_root_dir" | cut -f1)
log "Tamanho do backup: $total_size"
echo

log "Enviando pro Google Drive"
rclone copy "$backup_root_dir" "gdrive:/backups/$backup_time"

gdrive_url=$(get_gdrive_url)

log "Backup concluído: $gdrive_url"

send_email "Backup concluído" \
"<h3 style='margin: 0;margin-bottom: 5px;'>Backup concluído com sucesso.</h3>
<ul style=\"margin-top: 0; padding-left: 0; list-style-type: none;\">
  <li><strong>Data:</strong> $formatted_time</li>
  <li>
    <strong>Local:</strong> 
    <a href=\"$gdrive_url\" style=\"color: #3498db; text-decoration: none;\">
      backups/$backup_time
    </a>
  </li>
  <li><strong>Tamanho:</strong> $total_size</li>
</ul>"
