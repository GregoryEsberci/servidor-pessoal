import os
import sys
import re
import shutil
from pathlib import Path

# https://jellyfin.org/docs/general/server/media/shows/

VIDEO_EXTENSIONS = ['.mp4', '.mkv', '.avi', '.mov', '.wmv', '.flv']
SUBTITLE_EXTENSIONS = ['.srt', '.sub', '.ass']
MIN_FILE_SIZE = 100 * 1024 * 1024 # 100 MB

SEARCH_DIR = Path('/mnt/hdd/public/data/torrents')
FILE_NAME_BLACKLIST = [
  '1080p',
  '720p',
  'DUAL',
  'WEB-DL',
  'WEB',
  'DDP5.1',
  '5.1',
  'COMANDOTORENTS',
  'x264',
]

target_dir = Path(os.environ["EXEC_PWD"])

FILE_NAME_BLACKLIST_PATTERN = re.compile('|'.join(map(re.escape, FILE_NAME_BLACKLIST)))

def is_video_file(path):
  return path.suffix.lower() in VIDEO_EXTENSIONS

def is_subtitle_file(path):
  return path.suffix.lower() in SUBTITLE_EXTENSIONS

def file_is_valid(path):
  return path.stat().st_size >= MIN_FILE_SIZE

def normalize(s):
  return s.lower().replace(' ', '').replace('.', '')

def find_matching_dirs(base_dir, search_term):
  matches = []
  normalized_search_term = normalize(search_term)

  for root, dirs, _ in os.walk(base_dir):
    for d in dirs:
      if normalized_search_term in normalize(d):
        matches.append(Path(root) / d)
  return matches

def file_name_suggestion(file_name):
  name_base, extension = os.path.splitext(file_name)

  # São poucos casos onde a sugestão fica 100%, mas não é viavel cobrir todos os casos, 
  # melhor fazer o ajuste fino caso a caso 
  cleaned_name = FILE_NAME_BLACKLIST_PATTERN.sub('', name_base).replace('.', ' ')
  
  return f'{" ".join(cleaned_name.split())}{extension}'

def main():
  search_term = input("Buscar por: ").strip()

  if len(search_term) < 2:
    print("Input invalido")
    sys.exit(1)

  matches = find_matching_dirs(SEARCH_DIR, search_term)

  if not matches:
    print("Nenhuma pasta correspondente encontrada.")
    return

  for folder in matches:
    # TODO: Agrupar todos os files em um array com o nome sugerido e o original e so dai ordenar pelo nome sugerido
    # isso vai evitar os casos onde as series estão espalhadas por varias pastas e a ordenação fica quebrada
    for file in sorted(folder.iterdir(), key=lambda x: x.name):
      if not file.is_file():
        continue

      is_video = is_video_file(file)
      is_subtitle = is_subtitle_file(file)

      if is_video or is_subtitle:
        if is_video and not file_is_valid(file):
          continue

        name_suggestion = file_name_suggestion(file.name)

        print(f"\nEncontrado: {file.name}\nSugestão:   {name_suggestion}")
        print("Pressione enter para aceitar a sugestão, digite _next pra ignorar ou insira o nome")
        new_name = input("Nome: ").strip() or name_suggestion

        if new_name != "_next":
          symlink_path = target_dir / new_name
          if symlink_path.exists():
            print(f"{symlink_path} já existe, ignorando")
            continue
          os.symlink(file.resolve(), symlink_path)
          print(f"Link criado: {symlink_path}")

if __name__ == "__main__":
  main()
