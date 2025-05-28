import { RouterProvider } from 'react-router';
import { router } from './routes';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/react-query';

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	);
}
