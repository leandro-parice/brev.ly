import { randomUUID } from 'node:crypto'
import { isLeft, isRight, unwrapEither } from '@/infra/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { describe, expect, it } from 'vitest'
import { ShortnedLinkNotAvaliable } from './errors/shortned-link-not-avaliable'
import { accessLink } from './link-access'

describe('Link access', () => {
	it('should be able to increment link access', async () => {
		const shortenedLink = randomUUID()

		const newLink = await makeLink({
			shortenedLink,
		})

		const sut = await accessLink(newLink.id)
		expect(isRight(sut)).toBe(true)

		if (isRight(sut)) {
			const result = unwrapEither(sut)
			expect(result.link.access).toEqual(1)
		}
	})

	it('should not be able to increment link access with invalid id', async () => {
		const sut = await accessLink('invalid-id')

		expect(isLeft(sut)).toBe(true)
		expect(unwrapEither(sut)).toBeInstanceOf(ShortnedLinkNotAvaliable)
	})
})
