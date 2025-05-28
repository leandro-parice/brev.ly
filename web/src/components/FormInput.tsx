import { WarningIcon } from '@phosphor-icons/react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	id: string;
	label: string;
	error?: string;
	icon?: React.ReactNode;
}

export function FormInput({
	id,
	label,
	error,
	icon,
	...props
}: FormInputProps) {
	return (
		<div className="mb-4">
			<label
				htmlFor={id}
				className="text-xs text-gray-500 uppercase block mb-1"
			>
				{label}
			</label>
			<div className="relative w-full">
				{icon && (
					<span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-md">
						{icon}
					</span>
				)}
				<input
					id={id}
					className={`${
						icon ? 'pl-[75px]' : 'px-4'
					} pr-4 py-3 rounded-lg border-gray-300 border block text-md w-full`}
					aria-invalid={!!error}
					aria-describedby={error ? `${id}-error` : undefined}
					{...props}
				/>
			</div>
			{error && (
				<span
					id={`${id}-error`}
					className="text-sm text-feedback-red-500 mt-2 flex items-center gap-2"
				>
					<span className="w-[16px]">
						<WarningIcon size={16} color="#b12c4d" />
					</span>
					<span>{error}</span>
				</span>
			)}
		</div>
	);
}
