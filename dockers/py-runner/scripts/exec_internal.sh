#!/bin/bash

cd "/app/scripts-py/$SCRIPT_TO_RUN" || exit 1

if [ -f "requirements.txt" ]; then
  pip install --user -r requirements.txt
fi

python main.py
