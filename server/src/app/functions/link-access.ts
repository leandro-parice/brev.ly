import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { eq, sql } from 'drizzle-orm'
import { ac } from 'vitest/dist/chunks/reporters.d.DG9VKi4m.js'
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

export async function accessLink(
	shortenedLinkId: string
): Promise<Either<ShortnedLinkNotAvaliable, IndexLinkOutput>> {
	const [shortenedLinkInfo] = await db
		.update(schema.links)
		.set({ access: sql`${schema.links.access} + 1` })
		.where(eq(schema.links.id, shortenedLinkId))
		.returning({
			id: schema.links.id,
			link: schema.links.link,
			shortenedLink: schema.links.shortenedLink,
			access: schema.links.access,
			createdAt: schema.links.createdAt,
		})

	if (!shortenedLinkInfo) {
		return makeLeft(new ShortnedLinkNotAvaliable())
	}

	return makeRight({ link: shortenedLinkInfo })
}
