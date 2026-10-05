import path from 'node:path';
import {
	qBittorrentApi,
	type TorrentFile,
} from '../../shared/apis/qbittorrent-api.js';
import {
	SamaritanoCategoryId,
	type SamaritanoTorrent,
	samaritanoApi,
} from '../../shared/apis/samaritano-api.js';
import { type TmdbTv, tmdbApi } from '../../shared/apis/tmdb-api.js';
import { isVideo } from '../../shared/utils.js';
import { LinkerBase } from './linker-base.js';

// Presume que so vai existir uma temporada por torrent
export class SeasonLinker extends LinkerBase {
	skipSeasonCheck = false;

	readonly BASE_DIR = '/mnt/hdd/jellyfin/Shows/';

	static canProcess(torrent: SamaritanoTorrent) {
		return [SamaritanoCategoryId.Anime, SamaritanoCategoryId.TvShow].includes(
			torrent.attributes.category_id,
		);
	}

	async process() {
		const tmdb = await tmdbApi.findTv(
			this.samaritanoTorrent.attributes.tmdb_id,
		);
		const seasonNumber = await this.getTvShowSeasonNumber(tmdb);
		// const tmdbSeason = tmdb.seasons.find(
		// 	(season) => season.season_number === seasonNumber,
		// );

		// if (!seasonNumber || !tmdbSeason) {
		if (!seasonNumber) {
			throw new Error(
				`Não foi possível encontrar a temporada da serie/anime ${this.torrent.name} - ${this.torrent.hash}`,
			);
		}

		const files = await qBittorrentApi.getTorrentFiles(this.torrent.hash);
		const videoPaths = await this.getVideoPaths(files);

		// Tem casos onde vai ser diferente mesmo já que a stream pode juntar eps,
		// tmdb pode decidir juntar temporadas (ex: tv/117465), poderia tentar usar o episode_group mas como buscar um grupo?
		// bom, mesmo com essas questões prefiro que de erro
		// if (tmdbSeason.episode_count !== videoPaths.length) {
		// 	throw new Error(
		// 		`Quantidade de episódios diferente do de arquivos para o torrent "${this.torrent.hash}" - "${this.samaritanoTorrent.id}"`,
		// 	);
		// }

		const tvShowDirName = this.buildJellyfinName(tmdb);

		const seasonDir = path.join(
			this.BASE_DIR,
			tvShowDirName,
			`season_${seasonNumber}`,
		);

		const promises = videoPaths.map(async (videoPath) => {
			const videoName = path.basename(videoPath);
			const episode = this.extractSeasonEpisodeInfo(videoName)?.episode;

			if (typeof episode !== 'number') {
				throw new Error(
					`Não foi possível extrair o episodio do "${videoName}"`,
				);
			}

			let fileName = this.buildJellyfinName(tmdb, {
				episode: episode,
				season: seasonNumber,
			});

			fileName += path.extname(videoPath);

			const jellyfinPath = path.join(seasonDir, fileName);

			await this.createVideoSymlink(videoPath, jellyfinPath);
		});

		await Promise.all(promises);
	}

	private async getVideoPaths(files: TorrentFile[]) {
		const paths = await Promise.all(
			files.map(async (file) => {
				const filePath = path.join(this.torrent.save_path, file.name);

				if (await isVideo(filePath)) return filePath;
			}),
		);

		return paths.filter((path) => typeof path === 'string');
	}

	private async isCorrectSeason(season: number) {
		const torrents = await samaritanoApi.filter({
			name: this.samaritanoTorrent.attributes.name,
			tmdbId: this.samaritanoTorrent.attributes.tmdb_id,
			seasonNumber: season,
		});

		return torrents.data.some((data) => data.id === this.samaritanoTorrent.id);
	}

	private extractSeasonEpisodeInfo(
		filesName: string,
	): SeasonEpisodeInfo | undefined {
		// S01E02
		const fileNameInfo = /S([0-9]+)E([0-9]+)/.exec(filesName);

		const season = Number(fileNameInfo?.[1]);
		const episode = Number(fileNameInfo?.[2]);

		if (Number.isFinite(season) && Number.isFinite(episode)) {
			return { season, episode };
		}
	}

	// Não precisaria dessa desgraça se o UNIT3D simplesmente retornasse o session_number
	private async getTvShowSeasonNumber(tmdb: TmdbTv) {
		let fileNameSeason: number | undefined;

		for (const file of this.samaritanoTorrent.attributes.files) {
			const infos = this.extractSeasonEpisodeInfo(file.name);

			if (infos) {
				fileNameSeason = infos.season;
				break;
			}
		}

		if (
			typeof fileNameSeason === 'number' &&
			(await this.isCorrectSeason(fileNameSeason))
		) {
			return fileNameSeason;
		}

		// daria pra usar o tmdb.seasons.episode_count pra filtrar um pouco
		// daria pra add um array com as temporadas que já foram checadas

		// dataria pra melhorar tbm os fallbacks
		// 1. filtro pela temporada no nome do arquivo
		// 2. filtro pelo tmdb.seasons que tem a mesma episode_count que samaritanoTorrent.num_file
		// 3. filtra geral, todas temporadas restantes

		console.log(
			`Não foi possível encontrar a temporada pelo nome do arquivo do torrent "${this.torrent.hash}" - "${this.samaritanoTorrent.id}", sera usado o fallback`,
		);

		// Too many requests? oq q é isso? nunca nem vi
		const promises = Array(tmdb.number_of_seasons)
			.fill(null)
			.map(async (_, index) => {
				const season = index + 1;
				return {
					season,
					isCorrect: await this.isCorrectSeason(season),
				};
			});

		// Poderia usar race pra não precisar esperar todas, mas não quer essa complexidade agora
		const results = await Promise.all(promises);

		return results.find((result) => result.isCorrect)?.season;
	}
}

type SeasonEpisodeInfo = {
	season: number;
	episode: number;
};
