import {
  varchar,
  integer,
  timestamp,
  smallint,
  pgTable,
  boolean,
  text,
  primaryKey,
  foreignKey
} from 'drizzle-orm/pg-core';

import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { relations } from 'drizzle-orm';  // ADD THIS
import { passive } from 'svelte/legacy';

export const languages = pgTable('languages', {
	id: integer().primaryKey().notNull(),
	name: varchar().notNull(),
	iso639: varchar(),
	created: timestamp({ withTimezone: true }).defaultNow(),
	edited: timestamp({ withTimezone: true }).defaultNow(),
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

export const companyTags = pgTable('company_tags', {
	id: integer().primaryKey().notNull(),
	name: varchar().notNull(),
	created: timestamp({ withTimezone: true }).defaultNow(),
	edited: timestamp({ withTimezone: true }).defaultNow(),
});

export const companies = pgTable('companies', {
	id: integer().primaryKey().notNull(),
	name: varchar().notNull(),
	description: varchar(),
	coverPic: varchar('cover_pic'),
	established: timestamp({ withTimezone: true }),
	defunct: timestamp({ withTimezone: true }),
	links: varchar(),
	created: timestamp({ withTimezone: true }).defaultNow(),
	edited: timestamp({ withTimezone: true }).defaultNow(),
});

export const jtCompaniesCompanyTags = pgTable('jt_companies_company_tags', {
	fkCompanyID: integer('fk_company_id').references(() => companies.id),
	fkCompanyTagID: integer('fk_company_tag_id').references(() => companyTags.id),
	score: smallint().notNull(),
	created: timestamp({ withTimezone: true }).defaultNow(),
	edited: timestamp({ withTimezone: true }).defaultNow(),
});

export const jt_companies_countries = pgTable('jt_companies_countries', {
	fkCompanyId: integer('fk_company_id').references(() => companies.id),
	fkCountryId: integer('fk_country_id').references(() => countries.id),
	created: timestamp({ withTimezone: true }).defaultNow(),
	edited: timestamp({ withTimezone: true }).defaultNow(),
});

export const occupations = pgTable('occupations', {
	id: integer().primaryKey().notNull().unique(),
	name: varchar().notNull().unique(),
	created: timestamp({ withTimezone: true }).defaultNow(),
	edited: timestamp({ withTimezone: true }).defaultNow(),
});

export const staff = pgTable('staff', {
	id: integer().primaryKey().notNull().unique(),
	name: varchar().notNull().unique(),
	description: varchar(),
	coverPic: varchar('cover_pic'),
	sex: boolean(),
	birthday: timestamp({ withTimezone: true }),
	deathday: timestamp({ withTimezone: true }),
	links: varchar(),
	created: timestamp({ withTimezone: true }).defaultNow(),
	edited: timestamp({ withTimezone: true }).defaultNow(),
});

export const jtLanguagesStaff = pgTable('jt_languages_staff', {
	fkLanguageId: integer('fk_language_id').references(() => languages.id),
	fkStaffId: integer('fk_staff_id').references(() => staff.id),
	created: timestamp({ withTimezone: true }).defaultNow(),
	edited: timestamp({ withTimezone: true }).defaultNow(),
});

export const jtOccupationsStaff = pgTable('jt_occupations_staff', {
	fkOccupationId: integer('fk_occupation_id').references(() => occupations.id),
	fkStaffId: integer('fk_staff_id').references(() => staff.id),
	created: timestamp({ withTimezone: true }).defaultNow(),
	edited: timestamp({ withTimezone: true }).defaultNow(),
});

export const jtCountriesStaff = pgTable('jt_countries_staff', {
	fkCountryId: integer('fk_country_id').references(() => countries.id),
	fkStaffId: integer('fk_staff_id').references(() => staff.id),
	created: timestamp({ withTimezone: true }).defaultNow(),
	edited: timestamp({ withTimezone: true }).defaultNow(),
});

export const characters = pgTable('characters', {
	id: integer().primaryKey().notNull().unique(),
	name: varchar().notNull().unique(),
	description: varchar(),
	coverPic: varchar('cover_pic'),
	fkOriginalCreator: integer('fk_original_creator').references(() => staff.id),
	sex: boolean(),
	birthday: timestamp({ withTimezone: true }),
	inception: timestamp({ withTimezone: true }),
	created: timestamp({ withTimezone: true }).defaultNow(),
	edited: timestamp({ withTimezone: true }).defaultNow(),
});

export const tags = pgTable('tags', {
	id: integer().primaryKey().notNull().unique(),
	name: varchar().notNull().unique(),
	created: timestamp({ withTimezone: true }).defaultNow(),
	edited: timestamp({ withTimezone: true }).defaultNow(),
});

export const cartoonTypes = pgTable('cartoon_types', {
	id: integer().primaryKey().notNull().unique(),
	name: varchar().notNull().unique(),
	created: timestamp({ withTimezone: true }).defaultNow(),
	edited: timestamp({ withTimezone: true }).defaultNow(),
});

export const cartoons = pgTable('cartoons', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 128 }).notNull(),
	description: varchar({ length: 512 }),
	coverPic: varchar("cover_pic"),
	seasons: smallint(),
	episodes: smallint(),
	duration: smallint(),
	status: smallint(),
	airStart: timestamp('air_start'),
	airEnd: timestamp('air_end'),
	source: varchar({ length: 64 }),
	ageRating: varchar('age_rating'),
	links: varchar({ length: 512 }),
	created: timestamp().defaultNow(),
	edited: timestamp().defaultNow(),
});

export const jtCartoonsCartoonTypes = pgTable('jt_cartoons_cartoon_types', {
	score: smallint().notNull(),
	fkCartoonID: integer('fk_cartoon_id').references(() => cartoons.id),
	fkCartoonTypeID: integer('fk_cartoon_type_id').references(() => cartoonTypes.id),
	created: timestamp({ withTimezone: true }).defaultNow(),
	edited: timestamp({ withTimezone: true }).defaultNow(),
});

export const jtCartoonsLanguages = pgTable('jt_cartoons_languages', {
	score: smallint().notNull(),
	fkCartoonID: integer('fk_cartoon_id').references(() => cartoons.id),
	fkLanguageID: integer('fk_language_id').references(() => languages.id),
	created: timestamp({ withTimezone: true }).defaultNow(),
	edited: timestamp({ withTimezone: true }).defaultNow(),
});

export const jtCartoonsCountries = pgTable('jt_cartoons_countries', {
	fkCartoonID: integer('fk_cartoon_id').references(() => cartoons.id),
	fkCountryID: integer('fk_country_id').references(() => countries.id),
	created: timestamp({ withTimezone: true }).defaultNow(),
	edited: timestamp({ withTimezone: true }).defaultNow(),
});

export const jtCartoonsCompanies = pgTable('jt_cartoons_companies', {
	role: smallint(),
	fkCartoonID: integer('fk_cartoon_id').references(() => cartoons.id),
	fkCompanyID: integer('fk_company_id').references(() => companies.id),
	created: timestamp({ withTimezone: true }).defaultNow(),
	edited: timestamp({ withTimezone: true }).defaultNow(),
});

export const jtCartoonsStaff = pgTable('jt_cartoons_staff', {
	role: varchar('role', { length: 128 }).notNull(),
	credited: boolean(),
	fkLanguageID: integer('fk_language_id').notNull(),
	fkCartoonID: integer('fk_cartoon_id').notNull(),
	fkStaffID: integer('fk_staff_id').notNull(),
	fkCharacterID: integer('fk_character_id').notNull(),
	created: timestamp({ withTimezone: true }).defaultNow(),
	edited: timestamp({ withTimezone: true }).defaultNow(),
}, (table) => [
	// Composite primary key
	primaryKey({ columns: [table.fkCartoonID, table.fkStaffID, table.role] }),
	// Foreign key constraints
	foreignKey({
		columns: [table.fkCartoonID],
		foreignColumns: [cartoons.id],
	}),
	foreignKey({
		columns: [table.fkStaffID],
		foreignColumns: [staff.id],
	}),
]);

export const jtCartoonsTags = pgTable('jt_cartoons_tags', {
	fkCartoonID: integer('fk_cartoon_id').notNull(),
	fkTagID: integer('fk_tag_id').notNull(),
	score: smallint('score').notNull(),
	spoiler: boolean(),
	created: timestamp({ withTimezone: true }).defaultNow(),
	edited: timestamp({ withTimezone: true }).defaultNow(),
}, (table) => [
	// Composite primary key
	primaryKey({ columns: [table.fkCartoonID, table.fkTagID] }),
	// Foreign key constraints
	foreignKey({
		columns: [table.fkCartoonID],
		foreignColumns: [cartoons.id],
	}),
	foreignKey({
		columns: [table.fkTagID],
		foreignColumns: [tags.id],
	}),
]);

export const cartoonStats = pgTable('cartoon_stats', {
	fkCartoonID: integer('fk_cartoon_id').references(() => cartoons.id),
	score: smallint(),
	ranked: integer(),
	popularity: integer(),
	members: integer(),
	favorites: integer(),
	created: timestamp({ withTimezone: true }).defaultNow(),
	edited: timestamp({ withTimezone: true }).defaultNow(),
});

/* TODO:
	created at is not working
*/
export const users = pgTable('users', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	username: varchar({ length: 64 }).notNull().unique(),
	bio: varchar({ length: 512 }),
	coverPic: varchar('cover_pic'),
	// email: varchar({ length: 254 }).notNull(),
	pwd: varchar({ length: 256 }).notNull(),
	created: timestamp({ withTimezone: true }).defaultNow(),
	edited: timestamp({ withTimezone: true }).defaultNow(),
	lastLogin: timestamp('last_login', { withTimezone: true }),
});

export const sessions = pgTable('sessions', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	fkUserID: integer('fk_user_id').notNull().references(() => users.id),
	expiresAt: timestamp("expires_at", {withTimezone: true,
			     mode: "date"}).notNull(),
	created: timestamp({ withTimezone: true }).defaultNow(),
	edited: timestamp({ withTimezone: true }).defaultNow(),
});

export const profileComments = pgTable('profile_comments', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	fkCommenterID: integer('fk_commenter_id').notNull().references(() => users.id),
	userComment: varchar('user_comment').notNull(),
	fkUserID: integer('fk_user_id').references(() => users.id),
	created: timestamp({ withTimezone: true }).defaultNow(),
	edited: timestamp({ withTimezone: true }).defaultNow(),
});

export const follows = pgTable('follows', {
	fkFollowingID: integer('fk_following_id').references(() => users.id),
	fkFollowerID: integer('fk_follower_id').references(() => users.id),
	created: timestamp({ withTimezone: true }).defaultNow(),
	edited: timestamp({ withTimezone: true }).defaultNow(),
});

export const userLists = pgTable('user_lists', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	fkUserID: integer('fk_user_id').references(() => users.id),
	fkCartoonID: integer('fk_cartoon_id').references(() => cartoons.id),
	status: smallint().notNull(),
	score: smallint(),
	startDate: timestamp('start_date').defaultNow(),
	finishDate: timestamp('finish_date').defaultNow(),
	rewatches: smallint(),
	episodesWatched: smallint('episodes_watched'),
	favorite: smallint(),
	notes: varchar(),
	created: timestamp({ withTimezone: true }).defaultNow(),
	edited: timestamp({ withTimezone: true }).defaultNow(),
	// TODO:  UNIQUE (fk_cartoon_id, fk_user_id)
});

export const reviews = pgTable('reviews', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	review: varchar().notNull(),
	score: smallint().notNull(),
	fkUserID: integer('fk_user_id').notNull().references(() => users.id),
	fkCartoonID: integer('fk_cartoon_id').notNull().references(() => cartoons.id),
	created: timestamp({ withTimezone: true }).defaultNow(),
	edited: timestamp({ withTimezone: true }).defaultNow(),
});

// Relations for easier querying
export const tagsRelations = relations(tags, ({ many }) => ({
	cartoonTags: many(jtCartoonsTags),
}));

export const jtCartoonsTagsRelations = relations(jtCartoonsTags, ({ one }) => ({
	cartoon: one(cartoons, {
		fields: [jtCartoonsTags.fkCartoonID],
		references: [cartoons.id],
	}),
	tag: one(tags, {
		fields: [jtCartoonsTags.fkTagID],
		references: [tags.id],
	}),
}));

export const cartoonstaffrelation = pgTable('cartoonstaffrelation', {
	role: varchar({ length: 64 }),
	cartoonid: integer().references(() => cartoons.id),
	staffid: integer().references(() => staff.id),
	characterid: integer().references(() => characters.id),
});

export const staffRelations = relations(staff, ({ many }) => ({
	cartoonStaff: many(jtCartoonsStaff),
}));

export const jtCartoonsStaffRelations = relations(jtCartoonsStaff, ({ one }) => ({
	cartoon: one(cartoons, {
		fields: [jtCartoonsStaff.fkCartoonID],
		references: [cartoons.id],
	}),
	staff: one(staff, {
		fields: [jtCartoonsStaff.fkStaffID],
		references: [staff.id],
	}),
}));

export const cartoonsRelations = relations(cartoons, ({ many }) => ({
	cartoonTags: many(jtCartoonsTags),
	cartoonStaff: many(jtCartoonsStaff),
}));

export type User = InferSelectModel<typeof users>;
export type Session = InferSelectModel<typeof sessions>;
