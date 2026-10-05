import { promisify } from 'node:util';
import parseTorrent, { remote } from 'parse-torrent';
import { FetchError } from '../shared/apis/api-base.js';
import { qBittorrentApi } from '../shared/apis/qbittorrent-api.js';
import { samaritanoApi } from '../shared/apis/samaritano-api.js';
import { isSamaritanoTorrent, sleep } from '../shared/utils.js';

// await Promise.allSettled(
// 	Array(30)
// 		.fill(null)
// 		.map(() => samaritanoApi.request('torrents/5189')),
// );

// const response = await samaritanoApi
// 	.request('torrents/5189')
// 	.catch((error) => (error instanceof FetchError ? error.response : undefined));

// if (!response) {
// 	throw new Error('return undefined');
// }

// const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');

// console.log('aguardar')

// // if (rateLimitRemaining === '0') {
// // 	await sleep();
// // }

// console.log('response.headers', response.headers.get('x-ratelimit-remaining'));

// const torrent = await fetch(
// 	'https://samaritano.cc/torrent/download/8300.a2079c6f061699a00bbd48103e2422d8',
// );

// const content = torrent.body?.getReader()!;
// console.log('content', content);

// console.log(
// 	'a',
// 	await promisify(remote)(
// 		'https://samaritano.cc/torrent/download/8300.a2079c6f061699a00bbd48103e2422d8',
// 	),
// );

const torrent = await qBittorrentApi.getTorrents();

torrent
	.filter((t) => !isSamaritanoTorrent(t))
	.sort((a, b) => b.size - a.size)
	.map(({ name }) => console.log(name));
