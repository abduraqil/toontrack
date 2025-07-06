import {
  varchar, 
  integer, 
  timestamp, 
  bigint, 
  smallint, 
  pgTable, 
  serial, 
  text, 
  PgTimestamp,
  primaryKey,  // ADD THIS
  foreignKey   // ADD THIS
} from 'drizzle-orm/pg-core';

import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { relations } from 'drizzle-orm';  // ADD THIS
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
	id: integer().primaryKey().notNull(),
	name: varchar().notNull().unique(),
	iso3166_1_3: varchar(),
	cid: integer(),
	continent: varchar(),
	created: timestamp({ withTimezone: true }).defaultNow(),
	edited: timestamp({ withTimezone: true }).defaultNow(),
});

export const companies = pgTable('companies', {
	id: integer().primaryKey(),
	name: varchar({ length: 255 }).notNull().unique(),
	description: varchar({ length: 1000 }),
	cover_pic: varchar({ length: 255 }),
	established: timestamp({ withTimezone: true }),
	defunct: timestamp({ withTimezone: true }),
	fk_country_id: integer().references(() => countries.id),
	links: varchar({ length: 500 }),
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

export const tags = pgTable('tags', {
	id: integer().primaryKey().notNull().unique(),
	name: varchar().notNull().unique(),
	created: timestamp({ withTimezone: true }).defaultNow(),
	edited: timestamp({ withTimezone: true }).defaultNow(),
});

export const jt_cartoons_tags = pgTable('jt_cartoons_tags', {
  fk_cartoon_id: integer('fk_cartoon_id').notNull(), 
  fk_tag_id: integer('fk_tag_id').notNull(),         
  score: smallint('score').notNull(),
}, (table) => [
  // Composite primary key
  primaryKey({ columns: [table.fk_cartoon_id, table.fk_tag_id] }),
  // Foreign key constraints
  foreignKey({
    columns: [table.fk_cartoon_id],
    foreignColumns: [cartoons.id],
  }),
  foreignKey({
    columns: [table.fk_tag_id],
    foreignColumns: [tags.id],
  }),
]);


export const tagsRelations = relations(tags, ({ many }) => ({
  cartoonTags: many(jt_cartoons_tags),
}));

export const jt_cartoons_tagsRelations = relations(jt_cartoons_tags, ({ one }) => ({
  cartoon: one(cartoons, {
    fields: [jt_cartoons_tags.fk_cartoon_id],
    references: [cartoons.id],
  }),
  tag: one(tags, {
    fields: [jt_cartoons_tags.fk_tag_id],
    references: [tags.id],
  }),
}));

// Junction table for staff and cartoons (many-to-many relationship)
export const jt_cartoons_staff = pgTable('jt_cartoons_staff', {
  fk_cartoon_id: integer('fk_cartoon_id').notNull(),
  fk_staff_id: integer('fk_staff_id').notNull(),
  role: varchar('role', { length: 128 }).notNull(),
  character_name: varchar('character_name', { length: 128 }),
  language: varchar('language', { length: 64 }),
  episodes: varchar('episodes', { length: 256 }),
  created: timestamp('created', { withTimezone: true }).defaultNow(),
}, (table) => [
  // Composite primary key
  primaryKey({ columns: [table.fk_cartoon_id, table.fk_staff_id, table.role] }),
  // Foreign key constraints
  foreignKey({
    columns: [table.fk_cartoon_id],
    foreignColumns: [cartoons.id],
  }),
  foreignKey({
    columns: [table.fk_staff_id],
    foreignColumns: [staff.id],
  }),
]);

export const staffRelations = relations(staff, ({ many }) => ({
  cartoonStaff: many(jt_cartoons_staff),
}));

export const jt_cartoons_staffRelations = relations(jt_cartoons_staff, ({ one }) => ({
  cartoon: one(cartoons, {
    fields: [jt_cartoons_staff.fk_cartoon_id],
    references: [cartoons.id],
  }),
  staff: one(staff, {
    fields: [jt_cartoons_staff.fk_staff_id],
    references: [staff.id],
  }),
}));




// Relations for easier querying
export const cartoonsRelations = relations(cartoons, ({ many }) => ({
  cartoonTags: many(jt_cartoons_tags),
  cartoonStaff: many(jt_cartoons_staff),
}));

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