import { existsSync, type PathLike } from 'node:fs';
import fs from 'node:fs/promises';
import { promisify } from 'node:util';
import { fileTypeFromFile } from 'file-type';
import { remote as _parseRemoteTorrent } from 'parse-torrent';
import type { Torrent } from './apis/qbittorrent-api.js';

export const parseRemoteTorrent = promisify(_parseRemoteTorrent);

export const isSamaritanoTorrent = (torrent: Torrent) =>
	torrent.tracker.startsWith('https://samaritano.cc');

// https://en.wikipedia.org/wiki/Filename#Reserved_characters_and_words
export const safeFileName = (name: string) =>
	name.replace(/[/\\?%*:|"<>]/g, '-');

export const isFile = async (path: PathLike) =>
	existsSync(path) && (await fs.lstat(path)).isFile();

export const isDirectory = async (path: PathLike) =>
	existsSync(path) && (await fs.lstat(path)).isDirectory();

export const isSymbolicLink = async (path: PathLike) =>
	existsSync(path) && (await fs.lstat(path)).isSymbolicLink();

export const isVideo = async (path: string) => {
	const fileType = await fileTypeFromFile(path);

	if (!fileType) return false;

	return fileType.mime.startsWith('video/');
};

export const sleep = (time: number) =>
	new Promise<void>((resolve) => {
		setTimeout(resolve, time);
	});
