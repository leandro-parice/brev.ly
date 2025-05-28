import { CopyIcon, TrashIcon, LinkIcon } from '@phosphor-icons/react';
import { Link } from 'react-router';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type LinkItemProps = {
	id: string;
	link: string;
	shortenedLink: string;
	access: number;
	onCopy: (text: string) => void;
	onDelete: (id: string) => void;
};

export function LinksListItem({
	id,
	link,
	shortenedLink,
	access,
	onCopy,
	onDelete,
}: LinkItemProps) {
	return (
		<div className="flex justify-around items-center gap-4 w-full border-b border-gray-200 py-4 min-w-[350px]">
			<div className="flex flex-col gap-1 w-1/2 md:w-auto">
				<Link
					className="text-md text-blue-base truncate hover:underline underline-offset-4"
					to={`/redirect/${shortenedLink}`}
					target="_blank"
				>
					brev.ly/{shortenedLink}
				</Link>
				<span className="text-gray-500 text-sm truncate">{link}</span>
			</div>
			<div className="flex items-center justify-end gap-2 ml-auto w-1/2 md:w-auto">
				<span className="text-gray-500 text-sm">{access} acesso(s)</span>
				<button
					type="button"
					className="rounded bg-gray-200 w-[32px] h-[32px] flex items-center justify-center cursor-pointer"
					onClick={() => onCopy(link)}
				>
					<CopyIcon size={16} color="#1f2025" />
				</button>
				<AlertDialog>
					<AlertDialogTrigger>
						<div className="rounded bg-gray-200 w-[32px] h-[32px] flex items-center justify-center cursor-pointer">
							<TrashIcon size={16} color="#1f2025" />
						</div>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								Tem certeza que deseja excluir este link?
							</AlertDialogTitle>
							<AlertDialogDescription>
								Essa ação não pode ser desfeita. Isso irá excluir este link
								permanentemente e remover todos os dados associados a ele dos
								nossos servidores.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel className="cursor-pointer">
								Cancelar
							</AlertDialogCancel>
							<AlertDialogAction
								className="bg-blue-base hover:bg-blue-base opacity-80 transition-opacity duration-200 hover:opacity-100 text-white cursor-pointer"
								onClick={() => onDelete(id)}
							>
								Continue
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</div>
	);
}
