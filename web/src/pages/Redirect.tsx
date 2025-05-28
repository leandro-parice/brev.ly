import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getLinkData } from '../api/get-link-data';
import { incrementLinkAccess } from '../api/increment-link-access';
import { useEffect } from 'react';
import { queryClient } from '../lib/react-query';
import LoadingRedirectPage from '@/components/LoadingRedirectPage';
import RedirectContent from '@/components/RedirectContent';

export default function Redirect() {
	const { shortnedLink } = useParams();
	const navigate = useNavigate();

	const {
		data: linkData,
		isLoading: isLoadingLinksList,
		isError,
	} = useQuery({
		queryKey: ['linkData', shortnedLink],
		queryFn: () => getLinkData(shortnedLink as string),
		retry: false,
	});

	const { mutateAsync: IncrementLinkAccessFn } = useMutation({
		mutationFn: incrementLinkAccess,
	});

	useEffect(() => {
		if (isError) {
			navigate('/404');
		}
	}, [isError, navigate]);

	useEffect(() => {
		if (!linkData?.link?.id) return;

		if (linkData?.link?.id) {
			IncrementLinkAccessFn(linkData.link.id);

			queryClient.refetchQueries({ queryKey: ['linksList'], exact: true });
		}

		if (linkData?.link?.link) {
			handleRedirectToLink(linkData.link.link);
		}
	}, [linkData, IncrementLinkAccessFn]);

	function handleRedirectToLink(link: string) {
		const timeout = setTimeout(() => {
			window.location.href = link;
		}, 3000);
		return () => clearTimeout(timeout);
	}

	return (
		<main className="p-16 flex flex-col items-center justify-center gap-6 bg-gray-100 rounded-lg w-full max-w-[580px]">
			{isLoadingLinksList ? (
				<LoadingRedirectPage />
			) : (
				linkData?.link?.link && (
					<RedirectContent redirectLink={linkData.link.link} />
				)
			)}
		</main>
	);
}
