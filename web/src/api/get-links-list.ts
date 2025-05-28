import { api } from '../lib/axios';

export interface LinkListResponse {
	total: number;
	links: {
		id: string;
		link: string;
		shortenedLink: string;
		createdAt: string;
		access: number;
	}[];
}

export async function getLinksList() {
	const response = await api.get<LinkListResponse>('/links');
	return response.data;
}
