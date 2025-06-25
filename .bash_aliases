# cd <dir>
alias cd..='cd ../'
alias cd-='cd -'
alias cd~='cd ~/'
alias ..='cd ..'

# Busca de comandos
hs() {
  local search_term="$*"
  history | grep "$search_term" | awk '{$1=""; print substr($0,2)}' | grep -v '^hs ' | grep "$search_term"
}

# IP
alias myip='
echo "IP local: "`hostname -I | cut -d " " -f 1`
echo "IP remoto: "`curl -s https://ifconfig.me`'

# nano
alias nano-clean='f() { : > "$1" && nano "$1"; }; f'

# docker compose
alias up="./scripts/up.sh"
alias down="./scripts/down.sh"

# vscode
# https://github.com/GregoryEsberci/vscode-file-context-writer
alias ccd='cd "$(cat "$HOME/.vscode-fcw-active-patch")"'
