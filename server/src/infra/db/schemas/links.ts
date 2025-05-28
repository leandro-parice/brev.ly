import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { integer } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'

export const links = pgTable('links', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => uuidv7()),
	link: text('link').notNull(),
	shortenedLink: text('shortened_link').notNull().unique(),
	access: integer('quantity_accesses')
		.$default(() => 0)
		.notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
})
