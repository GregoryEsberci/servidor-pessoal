# cd <dir>
alias cd..='cd ../'
alias cd-='cd -'
alias cd~='cd ~/'
alias ..='cd ..'

# Busca de comandos
hs() {
    history | grep "$1" | awk '{$1=""; print substr($0,2)}' | grep -v '^hs ' | grep "$1"
}

# IP
alias myip='
echo "IP local: "`hostname -I | cut -d " " -f 1`
echo "IP remoto: "`curl -s ifconfig.me`'
