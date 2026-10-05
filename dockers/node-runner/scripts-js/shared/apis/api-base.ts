export class FetchError extends Error {
	constructor(public response: Response) {
		super(`Fetch error (${response.status}: ${response.statusText}) ${response.url}`);
	}
}

// Axios resolveria isso bem melhor?
// sim, mas não quero adicionar a dependência por pura teimosia
export class ApiBase {
	BASE_URL = '';

	async request(url: string, init: RequestInit = {}) {
		const response = await this.fetch(new URL(url, this.BASE_URL), init);

		if (!response.ok) throw new FetchError(response);

		return response;
	}

	async requestJson<T>(url: string, init: RequestInit = {}) {
		const response = await this.fetch(new URL(url, this.BASE_URL), init);

		if (!response.ok) throw new FetchError(response);

		return response.json() as T;
	}

	// Nao curti tanto essa estrutura com 2 métodos
	// mas facilita na hora de fazer overwrite sem complicar mt
	async fetch(url: URL, init: RequestInit) {
		return fetch(url, init);
	}
}
