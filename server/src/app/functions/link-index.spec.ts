import { randomUUID } from 'node:crypto'
import { isRight, unwrapEither } from '@/infra/shared/either'
import { makeLink } from '@/test/factories/make-link'
import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { indexLink } from './link-index'

describe('Links', () => {
	it('should be able to get the links', async () => {
		const shortenedLink = randomUUID()

		const link1 = await makeLink({ shortenedLink: `${shortenedLink}-1` })
		const link2 = await makeLink({ shortenedLink: `${shortenedLink}-2` })
		const link3 = await makeLink({ shortenedLink: `${shortenedLink}-3` })
		const link4 = await makeLink({ shortenedLink: `${shortenedLink}-4` })
		const link5 = await makeLink({ shortenedLink: `${shortenedLink}-5` })

		const sut = await indexLink({
			searchQuery: shortenedLink,
		})

		expect(isRight(sut)).toBe(true)
		expect(unwrapEither(sut).total).toEqual(5)
		expect(unwrapEither(sut).links).toEqual([
			expect.objectContaining({
				shortenedLink: `${shortenedLink}-5`,
			}),
			expect.objectContaining({
				shortenedLink: `${shortenedLink}-4`,
			}),
			expect.objectContaining({
				shortenedLink: `${shortenedLink}-3`,
			}),
			expect.objectContaining({
				shortenedLink: `${shortenedLink}-2`,
			}),
			expect.objectContaining({
				shortenedLink: `${shortenedLink}-1`,
			}),
		])
	})

	it('should be able to get paginated links', async () => {
		const shortenedLink = randomUUID()

		const link1 = await makeLink({ shortenedLink: `${shortenedLink}-1` })
		const link2 = await makeLink({ shortenedLink: `${shortenedLink}-2` })
		const link3 = await makeLink({ shortenedLink: `${shortenedLink}-3` })
		const link4 = await makeLink({ shortenedLink: `${shortenedLink}-4` })
		const link5 = await makeLink({ shortenedLink: `${shortenedLink}-5` })

		let sut = await indexLink({
			searchQuery: shortenedLink,
			page: 1,
			pageSize: 3,
		})

		expect(isRight(sut)).toBe(true)
		expect(unwrapEither(sut).total).toEqual(5)
		expect(unwrapEither(sut).links).toEqual([
			expect.objectContaining({
				shortenedLink: `${shortenedLink}-5`,
			}),
			expect.objectContaining({
				shortenedLink: `${shortenedLink}-4`,
			}),
			expect.objectContaining({
				shortenedLink: `${shortenedLink}-3`,
			}),
		])

		sut = await indexLink({
			searchQuery: shortenedLink,
			page: 2,
			pageSize: 3,
		})

		expect(isRight(sut)).toBe(true)
		expect(unwrapEither(sut).total).toEqual(5)
		expect(unwrapEither(sut).links).toEqual([
			expect.objectContaining({
				shortenedLink: `${shortenedLink}-2`,
			}),
			expect.objectContaining({
				shortenedLink: `${shortenedLink}-1`,
			}),
		])
	})

	it('should be able to get a sorted links', async () => {
		const shortenedLink = randomUUID()

		const link1 = await makeLink({
			shortenedLink: `${shortenedLink}-1`,
			createdAt: new Date(),
		})
		const link2 = await makeLink({
			shortenedLink: `${shortenedLink}-2`,
			createdAt: dayjs().subtract(1, 'day').toDate(),
		})
		const link3 = await makeLink({
			shortenedLink: `${shortenedLink}-3`,
			createdAt: dayjs().subtract(2, 'day').toDate(),
		})
		const link4 = await makeLink({
			shortenedLink: `${shortenedLink}-4`,
			createdAt: dayjs().subtract(3, 'day').toDate(),
		})
		const link5 = await makeLink({
			shortenedLink: `${shortenedLink}-5`,
			createdAt: dayjs().subtract(4, 'day').toDate(),
		})

		let sut = await indexLink({
			searchQuery: shortenedLink,
			sortyBy: 'createdAt',
			sortDirection: 'desc',
		})

		expect(isRight(sut)).toBe(true)
		expect(unwrapEither(sut).total).toEqual(5)
		expect(unwrapEither(sut).links).toEqual([
			expect.objectContaining({
				shortenedLink: `${shortenedLink}-1`,
			}),
			expect.objectContaining({
				shortenedLink: `${shortenedLink}-2`,
			}),
			expect.objectContaining({
				shortenedLink: `${shortenedLink}-3`,
			}),
			expect.objectContaining({
				shortenedLink: `${shortenedLink}-4`,
			}),
			expect.objectContaining({
				shortenedLink: `${shortenedLink}-5`,
			}),
		])

		sut = await indexLink({
			searchQuery: shortenedLink,
			sortyBy: 'createdAt',
			sortDirection: 'asc',
		})

		expect(isRight(sut)).toBe(true)
		expect(unwrapEither(sut).total).toEqual(5)
		expect(unwrapEither(sut).links).toEqual([
			expect.objectContaining({
				shortenedLink: `${shortenedLink}-5`,
			}),
			expect.objectContaining({
				shortenedLink: `${shortenedLink}-4`,
			}),
			expect.objectContaining({
				shortenedLink: `${shortenedLink}-3`,
			}),
			expect.objectContaining({
				shortenedLink: `${shortenedLink}-2`,
			}),
			expect.objectContaining({
				shortenedLink: `${shortenedLink}-1`,
			}),
		])
	})
})
