import { qBittorrentApi } from '../shared/apis/qbittorrent-api.js';
import { isSamaritanoTorrent } from '../shared/utils.js';
import util from 'node:util';

const { values: args } = util.parseArgs({
	options: {
		hash: { type: 'string' },
	},
});

const samaritanoTag = 'samaritano';
const torrents = await qBittorrentApi.getTorrents(
	args.hash ? { hashes: [args.hash] } : undefined,
);

const hashes = torrents.reduce(
	(acc, torrent) => {
		const hasTag = torrent.tags.includes(samaritanoTag);
		const isSamaritano = isSamaritanoTorrent(torrent);

		if (isSamaritano && !hasTag) {
			acc.toAdd.push(torrent.hash);
		} else if (!isSamaritano && hasTag) {
			acc.toRemote.push(torrent.hash);
		}

		return acc;
	},
	{ toRemote: <string[]>[], toAdd: <string[]>[] },
);

const promises = [];

if (hashes.toAdd.length) {
	promises.push(qBittorrentApi.addTorrentTags(hashes.toAdd, samaritanoTag));
}

if (hashes.toRemote.length) {
	promises.push(
		qBittorrentApi.removeTorrentTags(hashes.toRemote, samaritanoTag),
	);
}

await Promise.all(promises);
