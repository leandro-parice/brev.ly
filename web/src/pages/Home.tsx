import imageLogo from '../assets/images/brevly.svg';
import LinksList from '../components/LinksList';
import LinksForm from '../components/LinksForm';
import { Toaster } from '@/components/ui/sonner';

export default function Home() {
	return (
		<>
			<main className="w-full max-w-[980px] flex gap-8 flex-col">
				<header
					className="flex items-center justify-center md:justify-start"
					aria-label="Logo da Brev.ly"
				>
					<img
						src={imageLogo}
						alt="Brev.ly"
						className="w-full max-w-[96px] h-auto"
					/>
				</header>
				<section
					className="w-full max-w-[980px] mx-auto flex flex-col gap-5 md:flex-row justify-between items-start"
					aria-labelledby="shortened-links"
				>
					<LinksForm />
					<LinksList />
				</section>
			</main>
			<Toaster />
		</>
	);
}
