import { createBrowserRouter } from 'react-router';
import Home from './pages/Home';
import Redirect from './pages/Redirect';
import NotFound from './pages/NotFound';

export const router = createBrowserRouter([
	{ path: '/', element: <Home /> },
	{ path: '/redirect/:shortnedLink', element: <Redirect /> },
	{ path: '*', element: <NotFound /> },
]);
