import { ApiBase } from './api-base.js';

// não tá 100% atualizada mas é oq temos
// https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)

const urlEncoded = (body: Record<string, string>) => ({
	method: 'POST',
	body: new URLSearchParams(body).toString(),
	headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
});

class QBittorrentApi extends ApiBase {
	BASE_URL = 'http://qbittorrent:8080/api/v2/';
	API_KEY = process.env.QBITORRENT_API_KEY;

	fetch(url: URL, init: RequestInit) {
		return super.fetch(url, {
			...init,
			headers: {
				Authorization: `Bearer ${this.API_KEY}`,
				...init.headers,
			},
		});
	}

	/**
	 * https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-list
	 */
	async getTorrents(params: ListTorrentsParams = {}) {
		const query = new URLSearchParams(
			Object.entries({ ...params, hashes: params?.hashes?.join('|') })
				.filter(([, value]) => value !== undefined)
				.map(([key, value]): [string, string] => [key, String(value)]),
		);

		const parseTorrent = (torrent: Torrent) => {
			torrent.tags = (torrent.tags as unknown as string).split(', ');

			return torrent;
		};

		return this.requestJson<Torrent[]>(`torrents/info?${query}`).then(
			(torrents) => torrents.map(parseTorrent),
		);
	}

	async findTorrent(hash: string) {
		const [torrent] = await this.getTorrents({ hashes: [hash] });

		if (!torrent) throw new Error(`Torrent não encontrado (${hash})`);

		return torrent;
	}

	/**
	 * https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#add-torrent-tags
	 */
	async addTorrentTags(hashes: string | string[], tags: string) {
		const normalizedHashes = Array.isArray(hashes) ? hashes.join('|') : hashes;

		await this.request(
			'torrents/addTags',
			urlEncoded({ hashes: normalizedHashes, tags }),
		);
	}

	/**
	 * https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#remove-torrent-tags
	 */
	async removeTorrentTags(hashes: string | string[], tags: string) {
		const normalizedHashes = Array.isArray(hashes) ? hashes.join('|') : hashes;

		await this.request(
			'torrents/removeTags',
			urlEncoded({ hashes: normalizedHashes, tags }),
		);
	}

	// https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)#get-torrent-contents
	async getTorrentFiles(hash: string) {
		return this.requestJson<TorrentFile[]>(`torrents/files?hash=${hash}`);
	}

	async updateTorrentStatusTag(hash: string, status: TorrentStatusTag) {
		const torrent = await this.findTorrent(hash);
		const torrentTags = torrent.tags;
		const hasStatus = torrentTags.includes(status);

		const oldStatus = Object.values(TorrentStatusTag)
			.filter(
				(torrentStatus) =>
					torrentStatus !== status && torrentTags.includes(torrentStatus),
			)
			.join(',');

		if (oldStatus) {
			await this.removeTorrentTags(hash, oldStatus);
		}

		if (!hasStatus) {
			await this.addTorrentTags(hash, status);
		}
	}
}

export const qBittorrentApi = new QBittorrentApi();

export enum TorrentStatusTag {
	Linked = 'linked',
	FailedLink = 'failed-link',
	PendingLink = 'pending-link',
	NonLinkable = 'non-linkable',
}

export type TorrentState =
	| 'error'
	| 'missingFiles'
	| 'uploading'
	| 'stoppedUP'
	| 'queuedUP'
	| 'stalledUP'
	| 'checkingUP'
	| 'forcedUP'
	| 'downloading'
	| 'metaDL'
	| 'forcedMetaDL'
	| 'stoppedDL'
	| 'queuedDL'
	| 'stalledDL'
	| 'checkingDL'
	| 'forcedDL'
	| 'checkingResumeData'
	| 'moving'
	| 'unknown';

export type TorrentFilter =
	| 'all'
	| 'downloading'
	| 'seeding'
	| 'completed'
	| 'stopped'
	| 'active'
	| 'inactive'
	| 'running'
	| 'stalled'
	| 'stalled_uploading'
	| 'stalled_downloading'
	| 'errored';

// campos e ordem batem com serialize_torrent.cpp da release-5.2.3, não com a wiki
// (que ta desatualizada: "isPrivate" não existe, o campo real é "private")
export type Torrent = {
	hash: string;
	infohash_v1: string;
	infohash_v2: string;
	name: string;
	has_metadata: boolean;
	created_by: string;
	creation_date: number;
	private: boolean | null;
	total_size: number;
	pieces_num: number;
	piece_size: number;
	magnet_uri: string;
	size: number;
	progress: number;
	total_wasted: number;
	pieces_have: number;
	dlspeed: number;
	upspeed: number;
	priority: number;
	num_seeds: number;
	num_complete: number;
	num_leechs: number;
	num_incomplete: number;
	state: TorrentState;
	eta: number;
	seq_dl: boolean;
	f_l_piece_prio: boolean;
	category: string;
	// Originalmente separado por por ", " (virgula + espaço)
	tags: string[];
	super_seeding: boolean;
	force_start: boolean;
	save_path: string;
	content_path: string;
	root_path: string;
	added_on: number;
	completion_on: number;
	tracker: string;
	trackers_count: number;
	dl_limit: number;
	up_limit: number;
	downloaded: number;
	uploaded: number;
	downloaded_session: number;
	uploaded_session: number;
	amount_left: number;
	completed: number;
	connections_count: number;
	connections_limit: number;
	max_ratio: number;
	max_seeding_time: number;
	max_inactive_seeding_time: number;
	ratio: number;
	ratio_limit: number;
	popularity: number;
	seeding_time_limit: number;
	inactive_seeding_time_limit: number;
	share_limit_action: string;
	seen_complete: number;
	auto_tmm: boolean;
	time_active: number;
	seeding_time: number;
	last_activity: number;
	availability: number;
	reannounce: number;
	comment: string;
};

export type ListTorrentsParams = {
	filter?: TorrentFilter;
	category?: string;
	tag?: string;
	sort?: string;
	reverse?: boolean;
	limit?: number;
	offset?: number;
	hashes?: string[];
};

export interface TorrentFile {
	availability: number;
	index: number;
	is_seed: boolean;
	/**
	 * File name (including relative path)
	 */
	name: string;
	piece_range: number[];
	priority: number;
	progress: number;
	size: number;
}
