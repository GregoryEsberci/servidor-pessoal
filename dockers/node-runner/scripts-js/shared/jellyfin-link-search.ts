import fs from 'node:fs/promises';
import path from 'node:path';

export interface SymlinkInfo {
	realPath: string;
	linkPath: string;
}

// TODO: Mover pra envs
const DIRS = ['/mnt/hdd/jellyfin/Movies/', '/mnt/hdd/jellyfin/Shows/'];

const fetchSymbolicLinks = () => {
	const promises = DIRS.map((dir) =>
		fs.readdir(dir, { recursive: true, withFileTypes: true }),
	);

	return Promise.all(promises).then((dirs) =>
		dirs.flat().filter((file) => file.isSymbolicLink()),
	);
};

export const jellyfinLinkSearch = async (searchPath: string) => {
	const allLinks = await fetchSymbolicLinks();

	const result: SymlinkInfo[] = [];

	const promises = allLinks.map(async (file) => {
		const linkPath = path.join(file.parentPath, file.name);
		const realPath = await fs.realpath(linkPath);

		if (realPath === searchPath) {
			result.push({ realPath, linkPath });
		}
	});

	await Promise.all(promises);

	return result;
};
