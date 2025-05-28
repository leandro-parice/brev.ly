import { api } from '../lib/axios';

interface CreateNewLinkBody {
	link: string;
	shortenedLink: string;
}

export async function createNewLink({
	link,
	shortenedLink,
}: CreateNewLinkBody) {
	await api.post('/links', { link, shortenedLink });
}
