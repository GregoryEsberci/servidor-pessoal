#!/bin/bash

source "$(dirname "$0")/setup.sh"

README_FILE="$DOCS_DIR/README.md"

get_markdown_title() {
  local file="$1"
  # Pega a primeira linha não vazia que começa com #
  local title=$(grep -m 1 -E '^#\s+.+' "$file" | sed -E 's/^#\s+//')
  echo "$title"
}

generate_readme_content() {
  local content="# Índice de Documentação\n\n"

  local md_files=($(find "$DOCS_DIR" -maxdepth 1 -type f -name "*.md" ! -name "README.md" | sort))

  for file in "${md_files[@]}"; do
    local filename=$(basename "$file")
    local github_url="https://github.com/GregoryEsberci/servidor-pessoal/blob/main/docs/$filename"

    local title=$(get_markdown_title "$file")

    if [ -z "$title" ]; then
      title="${filename%.md}"
      title=$(echo "$title" | tr '-' ' ' | sed -e 's/\b\(.\)/\u\1/g')
    fi

    content+="- [$title]($github_url)\n"
  done

  echo -e "$content"
}

main() {
  log "Iniciando geração do README.md na pasta docs"

  if [ -f "$README_FILE" ]; then
    log "Removendo README.md existente"
    rm "$README_FILE" || throw "Falha ao remover README.md existente"
  fi

  local readme_content=$(generate_readme_content)

  echo -e "$readme_content" > "$README_FILE"

  if [ $? -eq 0 ]; then
    log "README.md gerado com sucesso em $README_FILE"
  else
    throw "Falha ao escrever no arquivo README.md"
  fi
}

main
