import path from 'node:path';
import {
	SamaritanoCategoryId,
	type SamaritanoTorrent,
} from '../../shared/apis/samaritano-api.js';
import { tmdbApi } from '../../shared/apis/tmdb-api.js';
import { LinkerBase } from './linker-base.js';

export class MovieLinker extends LinkerBase {
	readonly BASE_DIR = '/mnt/hdd/jellyfin/Movies/';

	static canProcess(torrent: SamaritanoTorrent) {
		return torrent.attributes.category_id === SamaritanoCategoryId.Movie;
	}

	async process(): Promise<void> {
		console.log(
			`Gerando link para o filme (${this.torrent.hash}) ${this.torrent.name}`,
		);

		const tmdb = await tmdbApi.findMovie(
			this.samaritanoTorrent.attributes.tmdb_id,
		);

		const jellyfinName = this.buildJellyfinName(tmdb);
		const targetDir = path.join(this.BASE_DIR, jellyfinName);
		const sourceFile = this.torrent.content_path;
		const sourceExt = path.extname(sourceFile);

		const symlinkPath = path.join(targetDir, `${jellyfinName}${sourceExt}`);

		await this.createVideoSymlink(sourceFile, symlinkPath);
	}
}
