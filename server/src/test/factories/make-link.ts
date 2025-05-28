import { randomUUID } from 'node:crypto'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { fakerPT_BR as faker } from '@faker-js/faker'
import type { InferInsertModel } from 'drizzle-orm'
import { uuidv7 } from 'uuidv7'

export async function makeLink(
	overrides?: Partial<InferInsertModel<typeof schema.links>>
) {
	const link = {
		link: faker.internet.url(),
		shortenedLink: randomUUID().replaceAll('-', ''),
		...overrides,
	}

	const result = await db.insert(schema.links).values(link).returning()

	return result[0]
}
