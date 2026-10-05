import fs from 'node:fs/promises';
import path from 'node:path';
import type { Torrent } from '../../shared/apis/qbittorrent-api.js';
import type { SamaritanoTorrent } from '../../shared/apis/samaritano-api.js';
import type { TmdbMovie, TmdbTv } from '../../shared/apis/tmdb-api.js';
import { jellyfinLinkSearch } from '../../shared/jellyfin-link-search.js';
import {
	isFile,
	isSymbolicLink,
	isVideo,
	safeFileName,
} from '../../shared/utils.js';

// Vai dar problema se precisar ser usado pra musicas por exemplo
// Não é tão genérico quando deveria mas é so pra uso pessoal então segue a vida
export class LinkerBase {
	constructor(
		public torrent: Torrent,
		readonly samaritanoTorrent: SamaritanoTorrent,
	) {
		// O mais correto seria no process()
		if (!this.isValid()) {
			throw new Error('Linker invalido, não é possível prosseguir');
		}
	}

	static canProcess(_torrent: SamaritanoTorrent) {
		return false;
	}

	static process(...args: ConstructorParameters<typeof LinkerBase>) {
		return new this(...args).process();
	}

	isValid() {
		return (this.constructor as typeof LinkerBase).canProcess(
			this.samaritanoTorrent,
		);
	}

	async process() {
		throw new Error('Not implemented');
	}

	protected async createVideoSymlink(source: string, target: string) {
		console.log(`[createVideoSymlink] source: "${source}" target: "${target}"`);

		if (!(await isFile(source))) {
			throw new Error(
				`Falha criar o link, source não é um arquivo (${source})`,
			);
		}

		if (!(await isVideo(source))) {
			throw new Error(`Falha criar o link, source não é um video (${source})`);
		}

		const sourceLinks = (await jellyfinLinkSearch(source)).filter(
			(info) => info.linkPath !== target,
		);

		if (sourceLinks.length) {
			const paths = sourceLinks.map((info) => `"${info.linkPath}"`).join();

			throw new Error(`Falha criar o link, source já está linkado em ${paths}`);
		}

		if (
			(await isSymbolicLink(target)) &&
			(await fs.realpath(target)) === source
		) {
			console.log(`Link "${target}" já criado, ignorado`);
			return;
		}

		await fs.mkdir(path.dirname(target), { recursive: true });
		await fs.symlink(source, target);

		console.log(`Criado link em ${target}`);
	}

	protected buildJellyfinName(
		tmdb: TmdbMovie | TmdbTv,
		{ season, episode }: BuildJellyfinExtra = {},
	) {
		let name = 'title' in tmdb ? tmdb.title : tmdb.name;

		name = name
			.trim()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '') // remove acentos
			.replace(/[^a-zA-Z0-9]+/g, '_') // substitute caracteres especiais por _
			.replace(/\s+/g, '_') // substitute espaços por _
			.replace(/_+/g, '_') // remove _ repetidos mantendo apenas um
			.toLowerCase();

		const date =
			'release_date' in tmdb ? tmdb.release_date : tmdb.first_air_date;
		const year = new Date(date).getFullYear();

		if (Number.isFinite(season) && Number.isFinite(episode)) {
			const seasonString = String(season).padStart(2, '0');
			const episodeString = String(episode).padStart(2, '0');
			name += `_S${seasonString}E${episodeString}`;
		}

		name += `_(${year})_[tmdbid-${tmdb.id}]`;

		return safeFileName(name);
	}
}

export interface BuildJellyfinExtra {
	season?: number;
	episode?: number;
}
