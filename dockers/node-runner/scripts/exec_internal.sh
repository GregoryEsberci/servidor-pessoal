#!/bin/bash

work_dir=$(mktemp -d --suffix "__node_runner$SCRIPT_TO_RUN")

cleanup() {
  rm -rf "$work_dir"
}

trap 'cleanup' EXIT

cp -r "/app/scripts-js/$SCRIPT_TO_RUN" "$work_dir/script" || exit 1
cd "$work_dir/script"

if [ -f "package.json" ]; then
  yarn install --no-lockfile
fi

exec node index.js
