import { spawn } from 'node:child_process';
import http from 'node:http';
import {
	qBittorrentApi,
	TorrentStatusTag,
} from '../shared/apis/qbittorrent-api.js';

const PORT = Number(process.env.PORT ?? 8080);

const runScript = (script: string, args: string[] = []) =>
	new Promise<void>((resolve, reject) => {
		const child = spawn('yarn', ['start', `${script}/index`, ...args], {
			cwd: '/home/gregory/servidor-pessoal/dockers/node-runner/scripts-js',
			stdio: 'inherit',
		});

		child.on('error', reject);
		child.on('exit', (code) => {
			if (code === 0) resolve();
			else reject(new Error(`${script} saiu com código ${code}`));
		});
	});

const server = http.createServer(async (request, response) => {
	const url = new URL(request.url ?? '/', 'http://localhost');

	console.log(`[server] ${request.method} ${url.pathname}`);

	try {
		if (request.method === 'GET' && url.pathname === '/health') {
			response.writeHead(200).end('ok');
			return;
		}

		if (request.method === 'POST' && url.pathname === '/torrent-added') {
			const hash = url.searchParams.get('hash');

			if (!hash) {
				response.writeHead(400).end('hash é obrigatório');
				return;
			}

			await qBittorrentApi.updateTorrentStatusTag(
				hash,
				TorrentStatusTag.PendingLink,
			);

			await runScript('update_samaritano_torrent_tag', ['--hash', hash]);

			response.writeHead(200).end('ok');
			return;
		}

		if (request.method === 'POST' && url.pathname === '/torrent-completed') {
			const hash = url.searchParams.get('hash');

			if (!hash) {
				response.writeHead(400).end('hash é obrigatório');
				return;
			}

			await runScript('samaritano_link_creator_to_jellyfin', ['--hash', hash]);

			response.writeHead(200).end('ok');
			return;
		}

		response.writeHead(404).end('not found');
	} catch (error) {
		console.error('[server] erro ao processar requisição', error);
		response.writeHead(500).end('erro interno');
	}
});

server.listen(PORT, () => {
	console.log(`[server] node-runner API ouvindo na porta ${PORT}`);
});
