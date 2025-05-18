#!/bin/bash
for dir in ../dockers/*/; do
  (cd "$dir" && docker compose restart)
done
