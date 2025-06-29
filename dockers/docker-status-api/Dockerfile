FROM alpine:latest

RUN apk add --no-cache bash socat docker-cli

COPY status-api.sh /usr/local/bin/status-api.sh
RUN chmod +x /usr/local/bin/status-api.sh

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD wget -q --spider http://127.0.0.1:${PORT:-8080} || exit 1

CMD ["bash", "/usr/local/bin/status-api.sh"]
