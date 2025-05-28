import { randomUUID } from 'node:crypto'
import { exportLink } from '@/app/functions/link-export'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isRight, unwrapEither } from '@/infra/shared/either'
import * as upload from '@/infra/storage/upload-file-to-storage'
import { makeLink } from '@/test/factories/make-link'
import { describe, expect, it, vi } from 'vitest'

describe('Link Export', () => {
	it('should be able to export links', async () => {
		const uploadStub = vi
			.spyOn(upload, 'uploadFileToStorage')
			.mockImplementationOnce(async input => {
				return {
					key: `${randomUUID()}.csv`,
					url: 'http://example.com/links.csv',
				}
			})

		const link1 = await makeLink()
		const link2 = await makeLink()

		const sut = await exportLink()

		const generatedCSVStream = uploadStub.mock.calls[0][0].contentStream
		const csvAsString = await new Promise<string>((resolve, reject) => {
			const chunks: Buffer[] = []

			generatedCSVStream.on('data', chunk => chunks.push(chunk))
			generatedCSVStream.on('end', () => {
				resolve(Buffer.concat(chunks).toString('utf-8'))
			})
			generatedCSVStream.on('error', reject)
		})

		const csvAsArray = csvAsString
			.trim()
			.split('\n')
			.map(row => row.split(','))

		expect(csvAsArray[0]).toEqual([
			'ID',
			'Link',
			'Shortned link',
			'Access',
			'Created at',
		])

		const exportedLinks = csvAsArray.filter(
			row => row[0] === link1.id || row[0] === link2.id
		)

		expect(exportedLinks).toEqual([
			[
				link1.id,
				link1.link,
				link1.shortenedLink,
				expect.any(String),
				expect.any(String),
			],
			[
				link2.id,
				link2.link,
				link2.shortenedLink,
				expect.any(String),
				expect.any(String),
			],
		])
	})
})
