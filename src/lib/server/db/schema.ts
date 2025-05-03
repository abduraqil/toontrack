import {varchar, integer, timestamp, bigint, smallint, pgTable, serial, text, PgTimestamp} from 'drizzle-orm/pg-core';
import { passive } from 'svelte/legacy';

/* TODO:
created at is not working
*/
export const users = pgTable('users', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	username: varchar({ length: 64 }).notNull().unique(),
	bio: varchar({ length: 512 }),
	prof_pic: varchar({ length: 64 }),
	// email: varchar({ length: 254 }).notNull(),
	pwd: varchar({ length: 256 }).notNull(),
	created: timestamp().defaultNow(),
});

export const sessionTable = pgTable('session', {
	id: text("id").primaryKey(),
	userID: integer("userID")
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date"
	}).notNull()
});

// export const profilecomments = pgTable('profilecomments', {
// 	id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
// 	commenterid: integer().notNull().references(() => users.id),
// 	comment: varchar({ length: 512 }).notNull(),
// 	userid: integer().references(() => users.id),
// 	created: timestamp().defaultNow(),
// });

// export const follows = pgTable('follows', {
// 	followingid: integer().references(() => users.id),
// 	followerid: integer().references(() => users.id),
// 	created: timestamp().defaultNow(),
// });

// export const cartoons = pgTable('cartoons', {
// 	id: integer().primaryKey().generatedAlwaysAsIdentity(),
// 	name: varchar({ length: 64 }).notNull(),
// 	description: varchar({ length: 512 }),
// 	cover_pic: varchar({ length: 64 }),
// 	status: smallint().notNull(),
// 	episodes: smallint(),
// 	released: timestamp().defaultNow(),
// 	age_rating: varchar({ length: 32 }),
// 	country: varchar({ length: 64 }),
// 	created: timestamp().defaultNow(),
// });

// export const userlists = pgTable('userlists', {
// 	id: integer().primaryKey().generatedAlwaysAsIdentity(),
// 	userid: bigint({ mode: 'number' }).references(() => users.id),
// 	cartoonid: integer().references(() => cartoons.id),
// 	status: smallint().notNull(),
// 	score: smallint(),
// 	startdate: timestamp().defaultNow(),
// 	finishdate: timestamp().defaultNow(),
// 	rewatches: smallint(),
// 	episodes_watched: smallint(),
// 	notes: varchar({ length: 512 }),
// 	created: timestamp().defaultNow(),
// });

// export const reviews = pgTable('reviews', {
// 	id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
// 	review: varchar({ length: 512 }).notNull(),
// 	rating: smallint().notNull(),
// 	userid: integer().notNull().references(() => users.id),
// 	cartoonid: integer().notNull().references(() => cartoons.id),
// 	created: timestamp().defaultNow(),
// });

// export const characters = pgTable('characters', {
// 	id: integer().primaryKey().generatedAlwaysAsIdentity(),
// 	name: varchar({ length: 64 }).notNull(),
// 	bio: varchar({ length: 512 }),
// 	created: timestamp().defaultNow(),
// });

// export const staff = pgTable('staff', {
// 	id: integer().primaryKey().generatedAlwaysAsIdentity(),
// 	name: varchar({ length: 64 }).notNull(),
// 	bio: varchar({ length: 512 }),
// 	created: timestamp().defaultNow(),
// });

// export const cartoonstaffrelation = pgTable('cartoonstaffrelation', {
// 	role: varchar({ length: 64 }),
// 	cartoonid: integer().references(() => cartoons.id),
// 	staffid: integer().references(() => staff.id),
// 	characterid: integer().references(() => characters.id),
// });

// export const tags = pgTable('tags', {
// 	id: integer().primaryKey().generatedAlwaysAsIdentity(),
// 	name: varchar({ length: 64 })
// });

// export const cartoontags = pgTable('cartoontags', {
// 	cartoonid: integer().references(() => cartoons.id),
// 	tagid: integer().references(() => tags.id),
// });


