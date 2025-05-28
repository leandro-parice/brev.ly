import { api } from '../lib/axios';

export async function deleteLink(shortenedLinkId: string) {
	await api.delete(`/links/${shortenedLinkId}`);
}
