import { randomUUID } from 'node:crypto'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isLeft, isRight } from '@/infra/shared/either'
import { eq } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { ZodError } from 'zod'
import { DuplicateShortenedLink } from './errors/duplicate-shortened-link'
import { createLink } from './link-create'

describe('Link create', () => {
	it('should be able create a new link', async () => {
		const shortenedLink = randomUUID()

		const sut = await createLink({
			link: 'https://www.google.com',
			shortenedLink,
		})

		expect(isRight(sut)).toBe(true)

		const result = await db
			.select()
			.from(schema.links)
			.where(eq(schema.links.shortenedLink, shortenedLink))

		expect(result).toHaveLength(1)
	})

	it('should not be able create a new link when it has a invalid link', async () => {
		const shortenedLink = randomUUID()

		try {
			await createLink({
				link: 'invalid-link',
				shortenedLink,
			})
			throw new Error('Expected createLink to throw a ZodError')
		} catch (error) {
			expect(error).toBeInstanceOf(ZodError)
			if (error instanceof ZodError) {
				expect(error.errors[0].message).toBe('link must be a valid URL')
			}
		}
	})

	it('should not be able create a new link when it has a invalid shortned link', async () => {
		const shortenedLink = 'invalid shortned link @'

		try {
			await createLink({
				link: 'https://www.google.com',
				shortenedLink,
			})
			throw new Error('Expected createLink to throw a ZodError')
		} catch (error) {
			expect(error).toBeInstanceOf(ZodError)
			if (error instanceof ZodError) {
				expect(error.errors[0].message).toBe(
					'shortenedLink must only contain letters, numbers, dashes or underscores'
				)
			}
		}
	})

	it('should not be able create a new link when it it already exists', async () => {
		const shortenedLink = randomUUID()

		const firstLink = await createLink({
			link: 'https://www.google.com',
			shortenedLink,
		})
		expect(isRight(firstLink)).toBe(true)

		if (isRight(firstLink)) {
			expect(firstLink.right.message).toBe('Link created successfully')
		}

		const sut = await createLink({
			link: 'https://www.google.com',
			shortenedLink,
		})

		expect(isLeft(sut)).toBe(true)
		expect(sut.left).toBeInstanceOf(DuplicateShortenedLink)
	})
})
