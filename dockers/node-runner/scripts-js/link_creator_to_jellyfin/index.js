const fs = require('fs');
const path = require('path');
const process = require('process');

const VIDEO_EXTENSIONS = ['.mp4', '.mkv', '.avi', '.mov', '.wmv', '.flv'];
const SUBTITLE_EXTENSIONS = ['.srt', '.sub', '.ass'];
const MIN_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB

const SEARCH_DIR = '/mnt/hdd/public/data/';
const targetDir = process.env.EXEC_PWD;

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question) =>
  new Promise((resolve) => readline.question(`\n${question}`, resolve));

const isVideoFile = (filePath) =>
  VIDEO_EXTENSIONS.includes(path.extname(filePath).toLowerCase());

const isSubtitleFile = (filePath) =>
  SUBTITLE_EXTENSIONS.includes(path.extname(filePath).toLowerCase());

const isValidVideo = (filePath) => fs.statSync(filePath).size >= MIN_VIDEO_SIZE;

const normalize = (str) => str.toLowerCase().replace(/[\s\.]+/g, ' ');

const extractEpisodeCode = (filename) => {
  const [episodeCode] = filename.match(/S\d{2}E\d{2}/i) || [];

  return episodeCode || '';
};

const readdir = (folder, options = {}) => {
  return new Promise((resolve, reject) => {
    fs.readdir(folder, options, (error, files) => {
      if (error) {
        reject(error);
      } else {
        resolve(files);
      }
    });
  });
};


const fileNameSuggestion = ({ fileName, serieName, index, session }) => {
  const ext = path.extname(fileName);
  const nameBase = path.basename(fileName, ext);
  let episodeCode = extractEpisodeCode(nameBase);

  if (!episodeCode && typeof session === 'number') {
    const format = (n) => n.toString().padStart(2, '0')

    episodeCode = `S${format(session)}E${format(index + 1)}`
  }

  const name = `${serieName} ${episodeCode}`.trim()

  return `${name}${ext}`;
}

const findFiles = async (dir, searchTerm) => {
  const normalizedSearch = normalize(searchTerm);

  const sortByName = (a, b) =>
    a.normalizedName.localeCompare(b.normalizedName, undefined, { numeric: true, sensitivity: 'base' });

  const content = await readdir(dir, { withFileTypes: true, recursive: true });

  return content
    .reduce((acc, entry) => {
      const normalizedName = normalize(entry.name);

      if (entry.isFile() && normalizedName.includes(normalizedSearch)) {
        acc.push({ file: entry, normalizedName });
      }

      return acc;
    }, [])
    .sort(sortByName)
    .map(({ file }) => path.resolve(file.path, file.name));
};

const getSession = async () => {
  const session = (await ask(`O valor so sera utilizado caso não seja encontrada a temporada no nome do arquivo\nTemporada (opcional): `)).trim();

  if (!Number.isFinite(+session)) {
    console.log('Valor inválido, insira um número ou deixe o campo vazio.');
    return getSession();
  }

  return session ? +session : undefined;
}

async function main() {
  const searchTerm = (await ask('Buscar por: ')).trim();

  if (searchTerm.length < 2) {
    throw new Error('Input invalido');
  }

  const serieName = (await ask(`Pressione enter para usar "${searchTerm}" ou insira um valor\nNome da serie: `)).trim() || searchTerm;
  const session = await getSession();

  const files = await findFiles(SEARCH_DIR, searchTerm);

  if (files.length === 0) {
    console.log(`Nenhum arquivo encontrado para "${searchTerm}"`);
    return;
  }

  for (let index = 0; index < files.length; index++) {
    const fileName = files[index];
    const isVideo = isVideoFile(fileName);
    const isSubtitle = isSubtitleFile(fileName);

    if (!isVideo && !isSubtitle) continue;
    if (isVideo && !isValidVideo(fileName)) continue;

    const suggestion = fileNameSuggestion({ fileName, serieName, index, session });
    console.log(`\nEncontrado: ${path.basename(fileName)}\nSugestão:   ${suggestion}`,);

    const newName = (await ask('Pressione enter para aceitar a sugestão, digite _next pra ignorar ou insira o nome\nNome: ')).trim() || suggestion;

    if (newName === '_next') continue;

    const symlinkPath = path.join(targetDir, newName);

    if (fs.existsSync(symlinkPath)) {
      console.log(`${symlinkPath} já existe, ignorando`);
    } else {
      fs.symlinkSync(path.resolve(fileName), symlinkPath);
      console.log(`Link criado: ${symlinkPath}`);
    }
  }
}

main()
  .finally(() => {
    readline.close();
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
