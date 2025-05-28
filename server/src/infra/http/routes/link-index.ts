import { createLink } from '@/app/functions/link-create'
import { indexLink } from '@/app/functions/link-index'
import { isRight, unwrapEither } from '@/infra/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const indexLinkRoute: FastifyPluginAsyncZod = async server => {
	server.get(
		'/links',
		{
			schema: {
				summary: 'Get all shortned links',
				querystring: z.object({
					searchQuery: z.string().optional(),
					sortyBy: z.enum(['createdAt']).optional(),
					sortDirection: z.enum(['asc', 'desc']).optional(),
					page: z.coerce.number().optional().default(1),
					pageSize: z.coerce.number().optional().default(10),
				}),
				response: {
					200: z.object({
						total: z.number().describe('Total number of links'),
						links: z
							.array(
								z.object({
									id: z.string(),
									link: z.string(),
									shortenedLink: z.string(),
									access: z.number(),
									createdAt: z.date(),
								})
							)
							.describe('Array of links'),
					}),
				},
			},
		},

		async (request, reply) => {
			const { searchQuery, sortyBy, sortDirection, page, pageSize } =
				request.query

			const result = await indexLink({
				searchQuery,
				sortyBy,
				sortDirection,
				page,
				pageSize,
			})

			const { total, links } = unwrapEither(result)

			return reply.status(200).send({ total, links })
		}
	)
}
