import { PassThrough, Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { db, pg } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeRight } from '@/infra/shared/either'
import { uploadFileToStorage } from '@/infra/storage/upload-file-to-storage'
import { stringify } from 'csv-stringify'
import { ilike } from 'drizzle-orm' // or the correct package for your project
import { z } from 'zod'

const exportLinksInput = z.object({
	searchQuery: z.string().optional(),
})

type ExportLinksOutput = {
	reportUrl: string
}

export async function exportLink(): Promise<Either<never, ExportLinksOutput>> {
	const { sql, params } = db
		.select({
			id: schema.links.id,
			link: schema.links.link,
			shortenedLink: schema.links.shortenedLink,
			access: schema.links.access,
			createdAt: schema.links.createdAt,
		})
		.from(schema.links)
		.toSQL()

	const cursor = pg.unsafe(sql, params as string[]).cursor(2)

	const csv = stringify({
		delimiter: ',',
		header: true,
		columns: [
			{ key: 'id', header: 'ID' },
			{ key: 'link', header: 'Link' },
			{ key: 'shortened_link', header: 'Shortned link' },
			{ key: 'quantity_accesses', header: 'Access' },
			{ key: 'created_at', header: 'Created at' },
		],
	})

	const uploadToStorageStream = new PassThrough()

	const convertToCSVPipeline = pipeline(
		cursor,
		new Transform({
			objectMode: true,
			transform(chunks: unknown[], encoding, callback) {
				for (const chunk of chunks) {
					this.push(chunk)
				}
				callback()
			},
		}),
		csv,
		uploadToStorageStream
	)

	const uploadToStorage = uploadFileToStorage({
		folder: 'downloads',
		fileName: `${new Date().toISOString()}-links.csv`,
		contentType: 'text/csv',
		contentStream: uploadToStorageStream,
	})

	const [{ url }] = await Promise.all([uploadToStorage, convertToCSVPipeline])

	return makeRight({
		reportUrl: url,
	})
}
