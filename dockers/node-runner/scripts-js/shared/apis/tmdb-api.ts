import { ApiBase } from './api-base.js';

class TmdbApi extends ApiBase {
	BASE_URL = 'https://api.themoviedb.org';
	DEFAULT_LANGUAGE = 'pt-BR';
	API_KEY = process.env.TMDB_API_KEY;

	async findMovie(id: number | string) {
		return this.requestJson<TmdbMovie>(`3/movie/${id}`);
	}

	async findTv(id: number | string) {
		return this.requestJson<TmdbTv>(`3/tv/${id}`);
	}

	fetch(url: URL, init: RequestInit) {
		if (!url.searchParams.has('language')) {
			url.searchParams.set('language', this.DEFAULT_LANGUAGE);
		}

		return super.fetch(url, {
			...init,
			headers: {
				Authorization: `Bearer ${this.API_KEY}`,
				...init.headers,
			},
		});
	}
}

export const tmdbApi = new TmdbApi();

// Nao são types completos pra não ficar desnecessariamente verboso já que a maioria dos attrs não vão ser usados
export interface TmdbBase {
	adult: boolean;
	backdrop_path: string;
	homepage: string;
	id: number;
	origin_country: string[];
	original_language: string;
	overview: string;
	popularity: number;
	poster_path: string;
	softcore: boolean;
	status: string;
	tagline: string;
	vote_average: number;
	vote_count: number;
}

export interface TmdbMovie extends TmdbBase {
	belongs_to_collection: null;
	budget: number;
	imdb_id: string;
	original_title: string;
	release_date: Date;
	revenue: number;
	runtime: number;
	title: string;
	video: boolean;
}

export interface TmdbTv extends TmdbBase {
	episode_run_time: unknown[];
	first_air_date: Date;
	in_production: boolean;
	languages: string[];
	last_air_date: Date;
	name: string;
	next_episode_to_air: null;
	number_of_episodes: number;
	number_of_seasons: number;
	original_name: string;
	seasons: TmdbTvSeason[];
	type: string;
}

export interface TmdbTvSeason {
	air_date: Date;
	episode_count: number;
	id: number;
	name: string;
	overview: string;
	poster_path: string;
	season_number: number;
	vote_average: number;
}
