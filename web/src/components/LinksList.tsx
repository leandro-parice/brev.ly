import {
	CheckCircleIcon,
	CircleNotchIcon,
	DownloadSimpleIcon,
	LinkIcon,
	WarningIcon,
} from '@phosphor-icons/react';
import { useIsFetching, useMutation, useQuery } from '@tanstack/react-query';
import { getLinksList } from '../api/get-links-list';
import { deleteLink } from '../api/delete-link';
import { queryClient } from '../lib/react-query';
import { exportCsv } from '../api/export-csv';
import { downloadUrl } from '../utils/download-url';
import { useState } from 'react';
import clsx from 'clsx';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import axios from 'axios';
import { LinksListItem } from './LinksListItem';

export default function LinksList() {
	const [isDownloading, setIsDownloading] = useState(false);

	const isFetchingLinksList = useIsFetching({ queryKey: ['linksList'] }) > 0;

	const { data: linksListData, isLoading: isLoadingLinksList } = useQuery({
		queryKey: ['linksList'],
		queryFn: getLinksList,
	});

	const handleDeleteLink = async (linkId: string) => {
		try {
			await DeleteLinkFn(linkId);

			queryClient.refetchQueries({ queryKey: ['linksList'], exact: true });

			toast.success('Link removido com sucesso!', {
				icon: <CheckCircleIcon size={20} color="#2c46b1" />,
			});
		} catch (error) {
			console.error('Error deleting link:', error);
		}
	};

	const { mutateAsync: DeleteLinkFn } = useMutation({
		mutationFn: deleteLink,
		onError: (error) => {
			console.error('Error creating new link:', error);

			if (axios.isAxiosError(error) && error.response?.data?.message) {
				toast.error(error.response.data.message, {
					icon: <WarningIcon size={20} color="#b12c4d" />,
				});
			} else {
				toast.error('Erro ao criar o link. Tente novamente.', {
					icon: <WarningIcon size={20} color="#b12c4d" />,
				});
			}
		},
	});

	const { mutateAsync: exportCsvFn } = useMutation({
		mutationFn: exportCsv,
	});

	const handleExportCsv = async () => {
		setIsDownloading(true);
		const exportResponse = await exportCsvFn();
		if (exportResponse?.reportUrl) {
			await downloadUrl(exportResponse?.reportUrl);
			setIsDownloading(false);
		}
	};

	function handleCopy(textToCopy: string) {
		navigator.clipboard
			.writeText(textToCopy)
			.then(() => {
				toast.success('Link copiado com sucesso!', {
					icon: <CheckCircleIcon size={20} color="#2c46b1" />,
				});
			})
			.catch((err) => {
				console.error('Erro ao copiar:', err);
			});
	}

	return (
		<section
			className={clsx(
				'bg-gray-100 p-8 rounded-lg w-full md:flex-[59.18%] md:min-w-none lg:min-w-[580px] overflow-hidden',
				{
					'processing-border': isFetchingLinksList,
				}
			)}
		>
			<header className="pb-5 flex items-center justify-between border-b border-gray-200">
				<h2 className="text-lg text-gray-600">Meus links</h2>

				{typeof linksListData?.total === 'number' &&
					linksListData.total > 0 && (
						<button
							type="button"
							className="bg-gray-200 hover:bg-gray-300 transition-colors  duration-200 text-sm text-gray-500 rounded-lg px-3 py-2 flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
							onClick={() => handleExportCsv()}
							disabled={isDownloading}
						>
							{isDownloading ? (
								<CircleNotchIcon
									size={16}
									color="#4d505c"
									className="animate-spin"
								/>
							) : (
								<DownloadSimpleIcon size={16} />
							)}
							{isDownloading ? 'Baixando...' : 'Baixar CSV'}
						</button>
					)}
			</header>
			<div className="w-full overflow-x-auto">
				{isLoadingLinksList && (
					<div className="flex flex-col items-center justify-center gap-4 h-[100px] w-full">
						<CircleNotchIcon
							size={32}
							color="#4d505c"
							className="animate-spin"
						/>
						<span className="text-xs text-gray-500 uppercase">
							Carregando links...
						</span>
					</div>
				)}

				{linksListData?.total === 0 && !isLoadingLinksList && (
					<div className="flex flex-col items-center justify-center gap-4 h-[100px] w-full">
						<LinkIcon size={32} color="#4d505c" />
						<span className="text-xs text-gray-500 uppercase">
							Ainda não existem links cadastrados
						</span>
					</div>
				)}
				<ScrollArea className="max-h-[500px] w-full rounded-md pr-4">
					{linksListData?.links.map((link) => (
						<LinksListItem
							key={link.id}
							id={link.id}
							link={link.link}
							shortenedLink={link.shortenedLink}
							access={link.access}
							onCopy={handleCopy}
							onDelete={handleDeleteLink}
						/>
					))}
				</ScrollArea>
			</div>
		</section>
	);
}
