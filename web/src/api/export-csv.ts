import { api } from '../lib/axios';

export async function exportCsv() {
	const result = await api.post('/links/export');

	return result.data;
}
