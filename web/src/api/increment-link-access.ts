import { api } from '../lib/axios';

export async function incrementLinkAccess(shortenedLinkId: string) {
	await api.patch(`/links/${shortenedLinkId}/access`);
}
