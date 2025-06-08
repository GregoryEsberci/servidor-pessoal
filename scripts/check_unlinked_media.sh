#!/bin/bash

torrents_dir="/mnt/hdd/public/data/torrents"
jellyfin_dir="/mnt/hdd/jellyfin"

blacklist_extensions=(".url" ".txt" ".jpg" ".png" ".iso")
min_video_size_mb=100

tmp_torrents=$(mktemp)
tmp_jellyfin_links=$(mktemp)

cleanup() {
  rm "$tmp_torrents" "$tmp_jellyfin_links"
}

trap 'cleanup' EXIT

find "$torrents_dir" -type f | while read -r file; do
  filename=$(basename "$file")
  extension=".${file##*.}"
  skip_file=0

  for ext in "${blacklist_extensions[@]}"; do
    if [[ "${extension,,}" == "${ext,,}" ]]; then
      skip_file=1
      break
    fi
  done

  if [[ $skip_file -eq 0 ]]; then
    file_size_mb=$(du -m "$file" | cut -f1)
    if [[ $file_size_mb -lt $min_video_size_mb ]]; then
      skip_file=1
    fi
  fi

  if [[ $skip_file -eq 0 ]]; then
    echo "$file"
  fi
done > "$tmp_torrents"

find "$jellyfin_dir" -type l | while read -r link; do
  target=$(readlink -f "$link")
  if [[ "$target" == "$torrents_dir"* ]]; then
    echo "$target"
  fi
done | sort -u > "$tmp_jellyfin_links"

echo "═══════════════════════════════════════════════════════════════════════════════"
echo "$(tput bold)Arquivos em \"$torrents_dir\" sem links em \"$jellyfin_dir\"$(tput sgr0)"
echo "═══════════════════════════════════════════════════════════════════════════════"
echo

comm -23 <(sort "$tmp_torrents") <(sort "$tmp_jellyfin_links")
