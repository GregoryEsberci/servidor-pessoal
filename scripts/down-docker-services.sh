#!/bin/bash
for dir in ../dockers/*/; do
  (cd "$dir" && docker compose down)
done
