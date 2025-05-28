import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import z from 'zod'
import { DuplicateShortenedLink } from './errors/duplicate-shortened-link'

const createLinkInput = z.object({
	link: z
		.string({ required_error: 'link is required' })
		.url('link must be a valid URL'),
	shortenedLink: z
		.string({ required_error: 'shortenedLink is required' })
		.regex(/^[a-zA-Z0-9-_]+$/, {
			message:
				'shortenedLink must only contain letters, numbers, dashes or underscores',
		}),
})

type CreateLinkInput = z.input<typeof createLinkInput>

export async function createLink(
	input: CreateLinkInput
): Promise<
	Either<DuplicateShortenedLink, { message: string; newShortnedLinkId: string }>
> {
	const { link, shortenedLink } = createLinkInput.parse(input)

	try {
		const newShortnedLink = await db
			.insert(schema.links)
			.values({
				link,
				shortenedLink,
			})
			.returning()

		return makeRight({
			message: 'Link created successfully',
			newShortnedLinkId: newShortnedLink[0].id,
		})
	} catch (error) {
		// Check for PostgreSQL unique constraint violation (error code 23505)
		if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
			return makeLeft(new DuplicateShortenedLink())
		}

		throw error
	}
}
