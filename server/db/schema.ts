import { sql } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

export const image = sqliteTable('image', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	originalImageUrl: text('originalImageUrl').notNull(),
	convertedImageUrl: text('convertedImageUrl').notNull(),
	createdAt: text('createdAt')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: text('updatedAt').default(sql`CURRENT_TIMESTAMP`)
});
