import React from 'react';
import { Link } from 'react-router';
import image404 from '../assets/images/404.svg';

export default function NotFound() {
	return (
		<main className="p-16 flex flex-col items-center justify-center gap-6 bg-gray-100 rounded-lg w-full max-w-[580px]">
			<img
				src={image404}
				alt="404 Not Found"
				className="w-full max-w-[194px] h-auto"
			/>
			<h1 className="text-xl text-gray-600">Link não encontrado</h1>
			<p className="text-gray-500 text-md text-center">
				link que você está tentando acessar não existe, foi removido ou é uma
				URL inválida. Saiba mais em
				<Link
					className="text-blue-base hover:underline underline-offset-4"
					to={{ pathname: '/' }}
				>
					breav.ly
				</Link>
			</p>
		</main>
	);
}
