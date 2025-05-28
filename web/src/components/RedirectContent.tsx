import imageIcon from '../assets/images/brevly-icon.svg';

export default function RedirectContent({
	redirectLink,
}: {
	redirectLink: string;
}) {
	return (
		<>
			<img
				src={imageIcon}
				alt="Brev.ly"
				className="w-full max-w-[48px] h-auto"
			/>
			<h1 className="text-xl text-gray-600">Redirecionando...</h1>
			<p className="text-gray-500 text-md text-center">
				O link será aberto automaticamente em alguns instantes. <br />
				Não foi direcionado?
				<a
					className="text-blue-base hover:underline underline-offset-4"
					href={redirectLink}
					target="_blank"
					rel="noreferrer"
				>
					Acesse aqui
				</a>
				.
			</p>
		</>
	);
}
