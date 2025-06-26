FROM node:22-slim

# && apt install -y gpg rclone msmtp \
RUN apt update \
    && apt autoremove -y \
    && apt clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app


