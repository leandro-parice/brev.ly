import { CircleNotchIcon } from '@phosphor-icons/react';

export default function Loading() {
	return (
		<>
			<CircleNotchIcon size={32} color="#4d505c" className="animate-spin" />
			<span className="text-xs text-gray-500 uppercase">
				Carregando links...
			</span>
		</>
	);
}
