import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeRight } from '@/infra/shared/either'
import { asc, count, desc, ilike } from 'drizzle-orm'
import z from 'zod'

const indexLinkInput = z.object({
	searchQuery: z.string().optional(),
	sortyBy: z.enum(['createdAt']).optional(),
	sortDirection: z.enum(['asc', 'desc']).optional(),
	page: z.number().optional().default(1),
	pageSize: z.number().optional().default(10),
})

type IndexLinkInput = z.input<typeof indexLinkInput>

type IndexLinkOutput = {
	total: number
	links: {
		id: string
		link: string
		shortenedLink: string
		access: number
		createdAt: Date
	}[]
}

export async function indexLink(
	input: IndexLinkInput
): Promise<Either<never, IndexLinkOutput>> {
	const { searchQuery, sortyBy, sortDirection, page, pageSize } =
		indexLinkInput.parse(input)

	const [links, [{ total }]] = await Promise.all([
		db
			.select({
				id: schema.links.id,
				link: schema.links.link,
				shortenedLink: schema.links.shortenedLink,
				access: schema.links.access,
				createdAt: schema.links.createdAt,
			})
			.from(schema.links)
			.where(
				searchQuery
					? ilike(schema.links.shortenedLink, `%${searchQuery}%`)
					: undefined
			)
			.orderBy(fields => {
				if (sortyBy && sortDirection === 'asc') {
					return asc(fields[sortyBy])
				}

				if (sortyBy && sortDirection === 'desc') {
					return desc(fields[sortyBy])
				}

				return desc(fields.id)
			})
			.offset((page - 1) * pageSize)
			.limit(pageSize),

		db
			.select({ total: count(schema.links.id) })
			.from(schema.links)
			.where(
				searchQuery
					? ilike(schema.links.shortenedLink, `%${searchQuery}%`)
					: undefined
			),
	])

	return makeRight({
		links,
		total,
	})
}
