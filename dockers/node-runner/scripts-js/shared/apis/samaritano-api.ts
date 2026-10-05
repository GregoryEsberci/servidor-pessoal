import { ApiBase } from './api-base.js';

// https://hdinnovations.github.io/UNIT3D/torrent_api.html
class SamaritanoApi extends ApiBase {
	BASE_URL = 'https://samaritano.cc/api/';
	API_KEY = process.env.SAMARITANO_API_KEY;

	async fetch(url: URL, init: RequestInit) {
		const response = await super.fetch(url, {
			...init,
			headers: {
				Authorization: `Bearer ${this.API_KEY}`,
				...init.headers,
			},
		});


		// response.headers.get('x-ratelimit-remaining')

		return response
	}

	findTorrent(id: string) {
		return this.requestJson<SamaritanoTorrent>(`torrents/${id}`);
	}

	filter(filter: SamaritanoFilters = {}) {
		// remove null e undefined
		const params = Object.fromEntries(
			Object.entries(filter).filter(([_key, value]) => value != null),
		);

		const search = new URLSearchParams(params).toString();

		return this.requestJson<SamaritanoFilterResponse>(
			`torrents/filter?${search}`,
		);
	}
}

export const samaritanoApi = new SamaritanoApi();

export interface SamaritanoFilters {
	perPage?: number;
	sortField?: string;
	sortDirection?: 'asc' | 'desc';
	name?: string;
	description?: string;
	mediainfo?: string;
	bdinfo?: string;
	uploader?: string;
	keywords?: string;
	startYear?: number;
	endYear?: number;
	categories?: number[];
	types?: number[];
	resolutions?: number[];
	genres?: number[];
	tmdbId?: number;
	imdbId?: number;
	tvdbId?: number;
	malId?: number;
	playlistId?: number;
	collectionId?: number;
	free?: number;
	doubleup?: boolean;
	featured?: boolean;
	refundable?: boolean;
	highspeed?: boolean;
	internal?: boolean;
	personalRelease?: boolean;
	alive?: boolean;
	dying?: boolean;
	dead?: boolean;
	file_name?: string;
	seasonNumber?: number;
	episodeNumber?: number;
}

// Tem mais, mas esses são os relevantes no momento
export enum SamaritanoCategoryId {
	Movie = 1,
	TvShow = 2,
	Anime = 3,
}

export interface SamaritanoPageMeta {
	current_page: number;
	per_page: number;
	from: number;
	to: number;
}

export interface SamaritanoFilterResponse {
	meta: SamaritanoPageMeta;
	links: unknown; // n to a fim de tipar agora
	data: SamaritanoTorrent[];
}

export interface SamaritanoTorrent {
	type: string;
	id: string;
	attributes: SamaritanoTorrentAttr;
}

export interface SamaritanoTorrentAttr {
	meta: SamaritanoTorrentMeta;
	name: string;
	release_year: string;
	category: string;
	type: string;
	resolution: string;
	media_info: string;
	bd_info: null;
	description: string;
	size: number;
	folder: null;
	num_file: number;
	files: SamaritanoTorrentFile[];
	freeleech: string;
	double_upload: boolean;
	refundable: boolean;
	internal: number;
	personal_release: boolean;
	uploader: string;
	seeders: number;
	leechers: number;
	times_completed: number;
	tmdb_id: number;
	imdb_id: number | null;
	tvdb_id: number | null;
	mal_id: number | null;
	igdb_id: number | null;
	category_id: SamaritanoCategoryId;
	type_id: number;
	resolution_id: number;
	created_at: Date;
	download_link: string;
	details_link: string;
}

export interface SamaritanoTorrentFile {
	name: string;
	size: number;
}

export interface SamaritanoTorrentMeta {
	poster: string;
	genres: string;
}
