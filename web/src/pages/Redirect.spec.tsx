import React from 'react';
import { render } from '@testing-library/react';

import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import '@testing-library/jest-dom';
import Redirect from './Redirect';

describe('Redirect Page', () => {
	it('exibe o componente de loading enquanto está carregando os dados', () => {
		const wrapper = render(
			<MemoryRouter>
				<Redirect />
			</MemoryRouter>
		);

		wrapper.debug();
	});
});
