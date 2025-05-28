import { randomUUID } from 'node:crypto'
import { isLeft, isRight, unwrapEither } from '@/infra/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { describe, expect, it } from 'vitest'
import { showLink } from './link-show'

describe('Link data', () => {
	it('should be able to get link data', async () => {
		const shortenedLink = randomUUID()

		const newLink = await makeLink({
			shortenedLink,
		})

		const sut = await showLink(newLink.shortenedLink)
		expect(isRight(sut)).toBe(true)

		if (isRight(sut)) {
			const result = unwrapEither(sut)
			expect(result.link).toStrictEqual({
				id: newLink.id,
				link: newLink.link,
				shortenedLink: newLink.shortenedLink,
				access: newLink.access,
				createdAt: newLink.createdAt,
			})
		}
	})
})
