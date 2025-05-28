import { api } from '../lib/axios';

export interface LinkDataResponse {
	link: {
		id: string;
		link: string;
		shortenedLink: string;
		createdAt: string;
		access: number;
	};
}

export async function getLinkData(shortenedLink: string) {
	const response = await api.get<LinkDataResponse>(`/links/${shortenedLink}`);
	return response.data;
}
