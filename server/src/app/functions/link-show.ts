import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { eq } from 'drizzle-orm'
import { ShortnedLinkNotAvaliable } from './errors/shortned-link-not-avaliable'

type IndexLinkOutput = {
	link: {
		id: string
		link: string
		shortenedLink: string
		access: number
		createdAt: Date
	}
}

export async function showLink(
	shortenedLink: string
): Promise<Either<ShortnedLinkNotAvaliable, IndexLinkOutput>> {
	const [shortenedLinkInfo] = await db
		.select({
			id: schema.links.id,
			link: schema.links.link,
			shortenedLink: schema.links.shortenedLink,
			access: schema.links.access,
			createdAt: schema.links.createdAt,
		})
		.from(schema.links)
		.where(eq(schema.links.shortenedLink, shortenedLink))

	if (!shortenedLinkInfo) {
		return makeLeft(new ShortnedLinkNotAvaliable())
	}

	return makeRight({ link: shortenedLinkInfo })
}
