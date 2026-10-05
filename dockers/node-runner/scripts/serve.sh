#!/bin/bash

cd /home/gregory/servidor-pessoal/dockers/node-runner/scripts-js || exit 1

exec yarn start server/index
