import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
	hasZodFastifySchemaValidationErrors,
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
} from 'fastify-type-provider-zod'
import { linkAccessRoute } from './routes/link-access'
import { createLinkRoute } from './routes/link-create'
import { destroyLinkRoute } from './routes/link-destroy'
import { exportLinkRoute } from './routes/link-export'
import { indexLinkRoute } from './routes/link-index'
import { showLinkRoute } from './routes/link-show'

const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler((error, request, reply) => {
	if (hasZodFastifySchemaValidationErrors(error)) {
		return reply
			.status(400)
			.send({ message: 'Validation error', issues: error.validation })
	}

	return reply.status(500).send({
		message: 'Internal server error',
	})
})

server.register(fastifyCors, {
	origin: '*',
	methods: ['GET', 'POST', 'PATCH', 'DELETE'],
})

server.register(fastifySwagger, {
	openapi: {
		info: {
			title: 'API',
			description: 'API documentation',
			version: '1.0.0',
		},
	},
	transform: jsonSchemaTransform,
})

server.register(fastifySwaggerUi, {
	routePrefix: '/docs',
})

server.register(indexLinkRoute)
server.register(createLinkRoute)
server.register(showLinkRoute)
server.register(linkAccessRoute)
server.register(destroyLinkRoute)
server.register(exportLinkRoute)

server.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
	console.log('HTTP server running on http://localhost:3333')
})
