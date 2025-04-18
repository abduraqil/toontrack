import { pgTable, serial, varchar, text, integer } from 'drizzle-orm/pg-core';
import { passive } from 'svelte/legacy';

export const user = pgTable('user', {
	id: serial('id').primaryKey(),
	username: varchar({ length: 255 }).notNull(),
	password: text().notNull(),
});
