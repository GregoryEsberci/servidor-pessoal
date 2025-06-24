FROM python:3.12-slim

RUN apt update && apt install -y ffmpeg aria2 && \
    pip install -U yt-dlp && \
    mkdir -p /downloads

WORKDIR /downloads

ENTRYPOINT ["yt-dlp"]
