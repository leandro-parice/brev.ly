import { destroyLink } from '@/app/functions/link-destroy'
import { isRight, unwrapEither } from '@/infra/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const destroyLinkRoute: FastifyPluginAsyncZod = async server => {
	server.delete(
		'/links/:shortenedLinkId',
		{
			schema: {
				summary: 'Delete a shortned link',
				params: z.object({
					shortenedLinkId: z.string(),
				}),
				response: {
					204: z.object({
						message: z.undefined().describe('No content'),
					}),
					404: z
						.object({ message: z.string() })
						.describe('The requested resource was not found.'),
				},
			},
		},

		async (request, reply) => {
			const { shortenedLinkId } = request.params

			const result = await destroyLink(shortenedLinkId)

			if (isRight(result)) {
				return reply.status(204).send()
			}

			const error = unwrapEither(result)

			switch (error.constructor.name) {
				case 'ShortnedLinkNotAvaliable':
					return reply.status(404).send({ message: error.message })
			}
		}
	)
}
