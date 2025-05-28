import React from 'react';
import { render, screen } from '@testing-library/react';
import NotFound from './NotFound';

import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router';
import '@testing-library/jest-dom';

describe('NotFound Page', () => {
	it('renderiza o título corretamente', () => {
		const wrapper = render(
			<MemoryRouter>
				<NotFound />
			</MemoryRouter>
		);

		expect(wrapper.getByText('Link não encontrado')).toBeInTheDocument();
	});

	it('possui link para breav.ly com destino "/"', () => {
		render(
			<MemoryRouter>
				<NotFound />
			</MemoryRouter>
		);

		const link = screen.getByRole('link', { name: /breav.ly/i });
		expect(link).toHaveAttribute('href', '/');
	});
});
