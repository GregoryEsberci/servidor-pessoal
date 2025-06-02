FROM python:3.9-slim

WORKDIR /app

COPY scripts/exec_internal.sh /app/exec_internal.sh
RUN chmod +x /app/exec_internal.sh

ENTRYPOINT ["/app/exec_internal.sh"]