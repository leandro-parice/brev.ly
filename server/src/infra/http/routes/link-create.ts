import { createLink } from '@/app/functions/link-create'
import { isRight, unwrapEither } from '@/infra/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const createLinkRoute: FastifyPluginAsyncZod = async server => {
	server.post(
		'/links',
		{
			schema: {
				summary: 'Create a new shortned link',
				body: z.object({
					link: z
						.string({ required_error: 'link is required' })
						.url('link must be a valid URL'),
					shortenedLink: z
						.string({ required_error: 'shortenedLink is required' })
						.regex(/^[a-zA-Z0-9-_]+$/, {
							message:
								'shortenedLink must only contain letters, numbers, dashes or underscores',
						}),
				}),
				response: {
					201: z.object({
						message: z
							.string()
							.describe(
								"New shortened link created. Returns the link's unique ID."
							),
						newShortnedLinkId: z
							.string()
							.describe('The new shortened link ID.'),
					}),
					400: z
						.object({ message: z.string() })
						.catchall(z.any())
						.describe('The request was invalid or missing required data.'),
				},
			},
		},

		async (request, reply) => {
			const { link, shortenedLink } = request.body

			const result = await createLink({
				link,
				shortenedLink,
			})

			if (isRight(result)) {
				return reply.status(201).send({
					message: 'Link created successfully',
					newShortnedLinkId: result.right.newShortnedLinkId,
				})
			}

			const error = unwrapEither(result)

			switch (error.constructor.name) {
				case 'DuplicateShortenedLink':
					return reply.status(400).send({ message: error.message })
			}
		}
	)
}
