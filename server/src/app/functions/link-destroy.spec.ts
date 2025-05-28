import { randomUUID } from 'node:crypto'
import { isLeft, isRight, unwrapEither } from '@/infra/shared/either'

import { makeLink } from '@/test/factories/make-link'
import { describe, expect, it } from 'vitest'
import { ShortnedLinkNotAvaliable } from './errors/shortned-link-not-avaliable'
import { createLink } from './link-create'
import { destroyLink } from './link-destroy'

describe('Link delete', () => {
	it('should be able delete a link', async () => {
		const shortenedLink = randomUUID()

		const newLink = await makeLink({
			shortenedLink,
		})

		const sut = await destroyLink(newLink.id)
		expect(isRight(sut)).toBe(true)
	})

	it('should not be able to delete a link that does not exist', async () => {
		const sut = await destroyLink('non-existing-id')

		expect(isLeft(sut)).toBe(true)
		expect(unwrapEither(sut)).toBeInstanceOf(ShortnedLinkNotAvaliable)
	})
})
