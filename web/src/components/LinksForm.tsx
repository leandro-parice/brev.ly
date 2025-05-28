import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createNewLink } from '../api/create-new-link';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../lib/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircleIcon, WarningIcon } from '@phosphor-icons/react';
import { toast } from 'sonner';
import axios from 'axios';
import { FormInput } from './FormInput';

const newLinkForm = z.object({
	link: z.string().url('URL inválida').nonempty('Campo obrigatório'),
	shortnedLink: z
		.string()
		.regex(/^[a-zA-Z0-9-_]+$/, {
			message: 'Deve conter apenas letras, números, hífens ou underscores',
		})
		.nonempty('Campo obrigatório'),
});

type NewLinkForm = z.infer<typeof newLinkForm>;

export default function LinksForm() {
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { isSubmitting, errors: formErrors, isValid: isFormValid },
		reset,
	} = useForm<NewLinkForm>({
		resolver: zodResolver(newLinkForm),
		mode: 'onChange',
	});

	const link = watch('link');
	const shortnedLink = watch('shortnedLink');

	const isFormFilled = link && shortnedLink;

	const { mutateAsync: createNewLinkFn } = useMutation({
		mutationFn: createNewLink,
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

	async function handleNewLink(data: NewLinkForm) {
		try {
			await createNewLinkFn({
				link: data.link,
				shortenedLink: data.shortnedLink,
			});

			queryClient.refetchQueries({ queryKey: ['linksList'], exact: true });

			reset();

			toast('Link criado com sucesso!', {
				icon: <CheckCircleIcon size={20} color="#2c46b1" />,
			});
		} catch (error) {
			console.error(error);
		}
	}

	function handleLinkBlur(e: React.FocusEvent<HTMLInputElement>) {
		const value = e.target.value;
		if (value && !/^https?:\/\//i.test(value)) {
			setValue('link', `http://${value}`, { shouldValidate: true });
		}
	}

	return (
		<section className="bg-gray-100 p-8 rounded-lg w-full md:flex-[38.77%] md:min-w-none lg:min-w-[380px]">
			<h1 className="text-lg text-gray-600 mb-6">Novo link</h1>
			<form
				className="w-full flex flex-col"
				onSubmit={handleSubmit(handleNewLink)}
			>
				<FormInput
					id="txt-link"
					label="Link original"
					placeholder="www.exemplo.com.br"
					{...register('link')}
					disabled={isSubmitting}
					onBlur={handleLinkBlur}
					error={formErrors.link?.message}
					autoComplete="url"
				/>

				<FormInput
					id="txt-shortned-link"
					label="Link encurtado"
					placeholder="meu-link-encurtado"
					{...register('shortnedLink')}
					disabled={isSubmitting}
					error={formErrors.shortnedLink?.message}
					icon="brev.ly/"
				/>

				<button
					type="submit"
					className="rounded-lg bg-blue-base text-white h-[48px] w-full flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-100 transition-opacity duration-200 mt-2 text-md"
					disabled={!isFormFilled || !isFormValid || isSubmitting}
				>
					{isSubmitting ? 'Salvando...' : 'Salvar link'}
				</button>
			</form>
		</section>
	);
}
