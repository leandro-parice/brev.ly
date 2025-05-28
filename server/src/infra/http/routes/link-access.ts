import { accessLink } from '@/app/functions/link-access'
import { isRight, unwrapEither } from '@/infra/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const linkAccessRoute: FastifyPluginAsyncZod = async server => {
	server.patch(
		'/links/:shortenedLinkId/access',
		{
			schema: {
				summary: 'Increment link access',
				params: z.object({
					shortenedLinkId: z.string(),
				}),
				response: {
					200: z.object({
						link: z
							.object({
								id: z.string(),
								link: z.string(),
								shortenedLink: z.string(),
								access: z.number(),
								createdAt: z.date(),
							})
							.describe('Link data'),
					}),
					404: z
						.object({ message: z.string() })
						.describe('No link found with the provided shortened link'),
				},
			},
		},

		async (request, reply) => {
			const { shortenedLinkId } = request.params

			const result = await accessLink(shortenedLinkId)

			if (isRight(result)) {
				const { link } = unwrapEither(result)
				return reply.status(200).send({ link })
			}

			const error = unwrapEither(result)

			console.log(error)

			switch (error.constructor.name) {
				case 'ShortnedLinkNotAvaliable':
					return reply.status(404).send({ message: error.message })
			}
		}
	)
}
