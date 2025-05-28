import { exportLink } from '@/app/functions/link-export'
import { unwrapEither } from '@/infra/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const exportLinkRoute: FastifyPluginAsyncZod = async server => {
	server.post(
		'/links/export',
		{
			schema: {
				summary: 'Export links',
				response: {
					200: z.object({
						reportUrl: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const result = await exportLink()

			const { reportUrl } = unwrapEither(result)

			return reply.status(200).send({ reportUrl })
		}
	)
}
