import {varchar, integer, timestamp, bigint, smallint, pgTable, serial, text, PgTimestamp} from 'drizzle-orm/pg-core';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { passive } from 'svelte/legacy';
import { duration } from 'drizzle-orm/gel-core';

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

export const cartoons = pgTable('cartoons', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 128 }).notNull(),
	description: varchar({ length: 512 }),
	cover_pic: varchar({ length: 64 }),
	of_type: smallint(),
	status: smallint(),
	episodes: smallint(),
	air_start: timestamp(),
	air_end: timestamp(),
	source: varchar({ length: 64 }),
	duration: smallint(),
	age_rating: varchar({ length: 32 }),
	country: varchar({ length: 128 }),
	original_language: varchar({ length: 128 }),
	links: varchar({ length: 512 }),
	created: timestamp().defaultNow(),
	edited: timestamp().defaultNow(),
});

export const cartoonStats = pgTable('cartoonstats', {
	fk_cartoon_id: integer().references(() => cartoons.id),
	score: smallint(),
	ranked: integer(),
	popularity: integer(),
	members: integer(),
	favorites: integer(),
});

export const countries = pgTable('countries', {
	id: integer().primaryKey().notNull().unique(),
	name: varchar().notNull().unique(),
	iso3166_1_3: varchar(),
	cid: integer(),
	continent: varchar(),
	created: timestamp({ withTimezone: true }).defaultNow(),
	edited: timestamp({ withTimezone: true }).defaultNow(),
});

export const companies = pgTable('companies', {
	id: integer().primaryKey().notNull().unique(),
	name: varchar().notNull().unique(),
	description: varchar(),
	cover_pic: varchar(),
	established: timestamp({ withTimezone: true }),
	defunct: timestamp({ withTimezone: true }),
	fk_country_id: integer().references(() => countries.id),
	links: varchar(),
	created: timestamp({ withTimezone: true }).defaultNow(),
	edited: timestamp({ withTimezone: true }).defaultNow(),
});

export const jt_cartoons_companies = pgTable('jt_cartoons_companies', {
	role: smallint(),
	fk_cartoon_id: integer().references(() => cartoons.id),
	fk_producer_id: integer().references(() => companies.id),
});

// STAFF
export const staff = pgTable('staff', {
	id: integer().primaryKey().notNull().unique(),
	name: varchar().notNull().unique(),
	description: varchar(),
	cover_pic: varchar(),
	sex: integer(), // use 0/1 for boolean
	birthday: timestamp({ withTimezone: true }),
	deathday: timestamp({ withTimezone: true }),
	country: varchar(),
	languages: varchar(),
	occupations: varchar(),
	links: varchar(),
	created: timestamp({ withTimezone: true }).defaultNow(),
	edited: timestamp({ withTimezone: true }).defaultNow(),
});

export const characters = pgTable('characters', {
	id: integer().primaryKey().notNull().unique(),
	name: varchar().notNull().unique(),
	description: varchar(),
	cover_pic: varchar(),
	fk_original_creator: integer().references(() => staff.id),
	birthday: timestamp({ withTimezone: true }),
	created: timestamp({ withTimezone: true }).defaultNow(),
	edited: timestamp({ withTimezone: true }).defaultNow(),
});

export const jt_cartoons_staff = pgTable('jt_cartoons_staff', {
	role: varchar(),
	language: varchar(),
	fk_cartoon_id: integer().references(() => cartoons.id),
	fk_staff_id: integer().references(() => staff.id),
	fk_character_id: integer().references(() => characters.id),
});

export const tags = pgTable('tags', {
	id: integer().primaryKey().notNull().unique(),
	name: varchar().notNull().unique(),
	created: timestamp({ withTimezone: true }).defaultNow(),
	edited: timestamp({ withTimezone: true }).defaultNow(),
});

export const jt_cartoons_tags = pgTable('jt_cartoons_tags', {
	fk_cartoon_id: integer().references(() => cartoons.id),
	fk_tag_id: integer().references(() => tags.id),
	score: smallint(),
});

// User lists and more


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

// export const cartoonstaffrelation = pgTable('cartoonstaffrelation', {
// 	role: varchar({ length: 64 }),
// 	cartoonid: integer().references(() => cartoons.id),
// 	staffid: integer().references(() => staff.id),
// 	characterid: integer().references(() => characters.id),
// });

export type User = InferSelectModel<typeof users>;
export type Session = InferSelectModel<typeof sessionTable>;