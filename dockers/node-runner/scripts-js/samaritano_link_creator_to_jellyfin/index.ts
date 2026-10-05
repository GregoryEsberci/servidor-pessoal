import util from 'node:util';
import { FetchError } from '../shared/apis/api-base.js';
import {
	type ListTorrentsParams,
	qBittorrentApi,
	type Torrent,
	TorrentStatusTag,
} from '../shared/apis/qbittorrent-api.js';
import {
	type SamaritanoTorrent,
	samaritanoApi,
} from '../shared/apis/samaritano-api.js';
import {
	isSamaritanoTorrent,
	parseRemoteTorrent,
	sleep,
} from '../shared/utils.js';
import type { LinkerBase } from './linker/linker-base.js';
import { MovieLinker } from './linker/movie-linker.js';
import { SeasonLinker } from './linker/season-linker.js';

const { values: args } = util.parseArgs({
	options: {
		hash: { type: 'string' },
	},
});

// const SAMARITANO_TORRENT_URL_REGEX = new RegExp(
// 	`${RegExp.escape('https://samaritano.cc/torrents/')}([0-9]*)`,
// );

// const getSamaritanoId = (torrent: Torrent) =>
// 	SAMARITANO_TORRENT_URL_REGEX.exec(torrent.comment)?.[1];

// const getSamaritanoTorrent = async (torrent: Torrent) => {
// 	// Tbm da pra buscar pelo nome, qualquer coisa da pra adicionar como fallback ou até como busca principal
// 	// samaritano /api/torrents/filter?file_name=torrent.name
// 	const samaritanoId = getSamaritanoId(torrent);

// 	if (!samaritanoId) {
// 		throw new Error('Não é possível prosseguir, samaritanoId invalido');
// 	}

// 	return await samaritanoApi.findTorrent(samaritanoId);
// };

const filterByHash = async (
	samaritanoTorrents: SamaritanoTorrent[],
	torrent: Torrent,
) => {
	// Na teoria so vai ter um torrent com o hash, mas ainda assim prefiro
	// validar e garantir que não vai pegar o errado pra não criar links errados
	const data = await Promise.all(
		samaritanoTorrents
			.filter((data) => data.attributes.size === torrent.total_size)
			.map(async (samaritanoTorrent) => {
				const downloadLink = samaritanoTorrent.attributes.download_link;
				const hash = (await parseRemoteTorrent(downloadLink))?.infoHash;

				return { hash, samaritanoTorrent };
			}),
	);

	return data
		.filter((value) => !!value.hash && value.hash === torrent.hash)
		.map(({ samaritanoTorrent }) => samaritanoTorrent);
};

const removeFromStart = (base: string, remove: string) => {
	const regex = new RegExp(`^${RegExp.escape(remove)}`);

	return base.replace(regex, '');
};

const getSamaritanoTorrent = async (torrent: Torrent) => {
	const torrentFiles = await qBittorrentApi.getTorrentFiles(torrent.hash);
	// Precisa pq name vem com o base path e pode acontecer de ter subfolder, ex: Legendas/file.src
	// ex real: 8fcf05a309c32e720e653991f42c6f0762f18acb - Rick.and.Morty.S01.1080p.NF.WEB-DL.DD5.1.x264-PiA
	const torrentBasePath = removeFromStart(
		torrent.root_path,
		`${torrent.save_path}/`,
	);
	let firstFileName = torrentFiles[0]?.name ?? '';

	if (torrentBasePath) {
		firstFileName = removeFromStart(firstFileName, `${torrentBasePath}/`);
	}

	const { data } = await samaritanoApi.filter({ file_name: firstFileName });

	const samaritanoTorrents = await filterByHash(data, torrent);

	if (samaritanoTorrents.length > 1) {
		throw new Error(
			`Falha ao buscar o torrent ${torrent.name}, foram encontrados múltiplos resultados`,
		);
	}

	const samaritanoTorrent = samaritanoTorrents[0];

	if (!samaritanoTorrent) {
		throw new Error(
			`Falha ao buscar o torrent ${torrent.name}, nenhum resultado`,
		);
	}

	return samaritanoTorrent;
};

const processTorrent = async (torrent: Torrent, retryCount: number = 0) => {
	const RETRY_LIMIT = 3;

	console.log(`Processando ${torrent.hash} - ${torrent.name}`);

	if (torrent.progress !== 1) {
		console.log('Torrent incompleto, ignorando');
		return;
	}

	try {
		const samaritanoTorrent = await getSamaritanoTorrent(torrent);

		const Linkers: (typeof LinkerBase)[] = [MovieLinker, SeasonLinker];

		const Linker = Linkers.find((Linker) =>
			Linker.canProcess(samaritanoTorrent),
		);

		if (Linker) {
			await Linker.process(torrent, samaritanoTorrent);

			await qBittorrentApi.updateTorrentStatusTag(
				torrent.hash,
				TorrentStatusTag.Linked,
			);
		}
	} catch (error) {
		console.error(error);

		if (error instanceof FetchError && retryCount < RETRY_LIMIT) {
			if (error.response.status === 429) {
				const rateLimitReset = Number(
					error.response.headers.get('x-ratelimit-reset'),
				);

				const sleepDuration = Number.isFinite(rateLimitReset)
					? rateLimitReset * 1000 - Date.now()
					: 30_000;

				console.log(
					`Too many request, aguardando ${sleepDuration / 1000} segundos`,
				);

				await sleep(sleepDuration);
			}

			console.log(`Retry ${retryCount + 1}/${RETRY_LIMIT}`);

			return processTorrent(torrent, retryCount + 1);
		}

		if (!torrent.tags.includes(TorrentStatusTag.Linked)) {
			await qBittorrentApi.updateTorrentStatusTag(
				torrent.hash,
				TorrentStatusTag.FailedLink,
			);
		}
	}
};

const run = async () => {
	console.log('Buscando torrents');

	const params: ListTorrentsParams = {};

	if (args.hash) {
		params.hashes = [args.hash];
	} else {
		params.filter = 'completed';
	}

	let torrents = (await qBittorrentApi.getTorrents(params)).filter((torrent) =>
		isSamaritanoTorrent(torrent),
	);

	if (!args.hash) {
		torrents = torrents.filter(
			({ tags }) =>
				tags.includes(TorrentStatusTag.PendingLink) ||
				tags.includes(TorrentStatusTag.FailedLink),
		);
	}

	console.log(`Encontrado ${torrents.length} torrents`);

	for (let i = 0; i < torrents.length; i++) {
		const torrent = torrents[i];

		console.log(`Processando ${i + 1}/${torrents.length}`);

		if (torrent) await processTorrent(torrent);
	}
};

await run();
