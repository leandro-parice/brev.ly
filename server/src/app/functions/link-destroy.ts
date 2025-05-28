import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { eq } from 'drizzle-orm'
import { ShortnedLinkNotAvaliable } from './errors/shortned-link-not-avaliable'

export async function destroyLink(
	shortnedLinkId: string
): Promise<Either<ShortnedLinkNotAvaliable, { message: string }>> {
	const result = await db
		.delete(schema.links)
		.where(eq(schema.links.id, shortnedLinkId))
		.returning()

	if (result.length > 0) {
		return makeRight({
			message: 'Link deleted successfully',
		})
	}

	return makeLeft(new ShortnedLinkNotAvaliable())
}
