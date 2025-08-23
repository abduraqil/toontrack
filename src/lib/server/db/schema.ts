import {
  pgTable,
  integer,
  varchar,
  timestamp,
  foreignKey,
  smallint,
  boolean,
  unique
} from 'drizzle-orm/pg-core'
import type { InferSelectModel } from 'drizzle-orm'

export const jtCartoonsCharacters = pgTable('jt_cartoons_characters', {
  credited: boolean(),
  fkLanguageId: integer('fk_language_id'),
  fkCartoonId: integer('fk_cartoon_id').notNull(),
  fkStaffId: integer('fk_staff_id'),
  fkCharacterId: integer('fk_character_id').notNull(),
  created: timestamp({ withTimezone: true, mode: 'date' }).defaultNow(),
  edited: timestamp({ withTimezone: true, mode: 'date' }).defaultNow()
}, (table) => [
  foreignKey({
    columns: [table.fkLanguageId],
    foreignColumns: [languages.id],
    name: 'jt_cartoons_characters_fk_language_id_fkey'
  }),
  foreignKey({
    columns: [table.fkCartoonId],
    foreignColumns: [cartoons.id],
    name: 'jt_cartoons_characters_fk_cartoon_id_fkey'
  }),
  foreignKey({
    columns: [table.fkStaffId],
    foreignColumns: [staff.id],
    name: 'jt_cartoons_characters_fk_staff_id_fkey'
  }),
  foreignKey({
    columns: [table.fkCharacterId],
    foreignColumns: [characters.id],
    name: 'jt_cartoons_characters_fk_character_id_fkey'
  }),
  unique('uq_cartoon_character_language_staff').on(table.fkLanguageId, table.fkCartoonId, table.fkStaffId, table.fkCharacterId)
])

export const jtCartoonsCompanies = pgTable('jt_cartoons_companies', {
  role: smallint().default(0),
  fkCartoonId: integer('fk_cartoon_id').notNull(),
  fkCompanyId: integer('fk_company_id').notNull(),
  created: timestamp({ withTimezone: true, mode: 'date' }).defaultNow(),
  edited: timestamp({ withTimezone: true, mode: 'date' }).defaultNow(),
  credited: boolean()
}, (table) => [
  foreignKey({
    columns: [table.fkCartoonId],
    foreignColumns: [cartoons.id],
    name: 'jt_cartoons_companies_fk_cartoon_id_fkey'
  }),
  foreignKey({
    columns: [table.fkCompanyId],
    foreignColumns: [companies.id],
    name: 'jt_cartoons_companies_fk_company_id_fkey'
  }),
  unique('uq_cartoon_company_role').on(table.role, table.fkCartoonId, table.fkCompanyId)
])

export const companies = pgTable('companies', {
  id: integer().primaryKey().notNull(),
  name: varchar().notNull(),
  description: varchar(),
  coverPic: varchar('cover_pic'),
  established: timestamp({ mode: 'date' }),
  defunct: timestamp({ mode: 'date' }),
  links: varchar(),
  created: timestamp({ withTimezone: true, mode: 'date' }).defaultNow(),
  edited: timestamp({ withTimezone: true, mode: 'date' }).defaultNow()
})

export const jtCountriesStaff = pgTable('jt_countries_staff', {
  fkCountryId: integer('fk_country_id').notNull(),
  fkStaffId: integer('fk_staff_id').notNull(),
  created: timestamp({ withTimezone: true, mode: 'date' }).defaultNow(),
  edited: timestamp({ withTimezone: true, mode: 'date' }).defaultNow()
}, (table) => [
  foreignKey({
    columns: [table.fkCountryId],
    foreignColumns: [countries.id],
    name: 'jt_countries_staff_fk_country_id_fkey'
  }),
  foreignKey({
    columns: [table.fkStaffId],
    foreignColumns: [staff.id],
    name: 'jt_countries_staff_fk_staff_id_fkey'
  }),
  unique('uq_country_staff').on(table.fkCountryId, table.fkStaffId)
])

export const jtCompaniesCompanyTags = pgTable('jt_companies_company_tags', {
  fkCompanyId: integer('fk_company_id').notNull(),
  fkCompanyTagId: integer('fk_company_tag_id').notNull(),
  score: smallint(),
  created: timestamp({ withTimezone: true, mode: 'date' }).defaultNow(),
  edited: timestamp({ withTimezone: true, mode: 'date' }).defaultNow()
}, (table) => [
  foreignKey({
    columns: [table.fkCompanyId],
    foreignColumns: [companies.id],
    name: 'jt_companies_company_tags_fk_company_id_fkey'
  }),
  foreignKey({
    columns: [table.fkCompanyTagId],
    foreignColumns: [companyTags.id],
    name: 'jt_companies_company_tags_fk_company_tag_id_fkey'
  }),
  unique('uq_company_company_tag').on(table.fkCompanyId, table.fkCompanyTagId)
])

export const jtCartoonsStaff = pgTable('jt_cartoons_staff', {
  role: smallint(),
  credited: boolean(),
  fkLanguageId: integer('fk_language_id'),
  fkCartoonId: integer('fk_cartoon_id').notNull(),
  fkStaffId: integer('fk_staff_id'),
  created: timestamp({ withTimezone: true, mode: 'date' }).defaultNow(),
  edited: timestamp({ withTimezone: true, mode: 'date' }).defaultNow(),
  fkCharacterId: varchar('fk_character_id')
}, (table) => [
  foreignKey({
    columns: [table.fkCartoonId],
    foreignColumns: [cartoons.id],
    name: 'jt_cartoons_staff_fk_cartoon_id_fkey'
  }),
  foreignKey({
    columns: [table.fkLanguageId],
    foreignColumns: [languages.id],
    name: 'jt_cartoons_staff_fk_language_id_fkey'
  }),
  foreignKey({
    columns: [table.fkStaffId],
    foreignColumns: [staff.id],
    name: 'jt_cartoons_staff_fk_staff_id_fkey'
  })
])

export const jtCartoonsCartoonTypes = pgTable('jt_cartoons_cartoon_types', {
  score: smallint().default(0),
  fkCartoonId: integer('fk_cartoon_id').notNull(),
  fkCartoonTypeId: integer('fk_cartoon_type_id').notNull(),
  created: timestamp({ withTimezone: true, mode: 'date' }).defaultNow(),
  edited: timestamp({ withTimezone: true, mode: 'date' }).defaultNow()
}, (table) => [
  foreignKey({
    columns: [table.fkCartoonId],
    foreignColumns: [cartoons.id],
    name: 'jt_cartoons_cartoon_types_fk_cartoon_id_fkey'
  }),
  foreignKey({
    columns: [table.fkCartoonTypeId],
    foreignColumns: [cartoonTypes.id],
    name: 'jt_cartoons_cartoon_types_fk_cartoon_type_id_fkey'
  }),
  unique('uq_cartoon_cartoon_type').on(table.fkCartoonId, table.fkCartoonTypeId)
])

export const jtLanguagesStaff = pgTable('jt_languages_staff', {
  fkLanguageId: integer('fk_language_id').notNull(),
  fkStaffId: integer('fk_staff_id').notNull(),
  created: timestamp({ withTimezone: true, mode: 'date' }).defaultNow(),
  edited: timestamp({ withTimezone: true, mode: 'date' }).defaultNow()
}, (table) => [
  foreignKey({
    columns: [table.fkLanguageId],
    foreignColumns: [languages.id],
    name: 'jt_languages_staff_fk_language_id_fkey'
  }),
  foreignKey({
    columns: [table.fkStaffId],
    foreignColumns: [staff.id],
    name: 'jt_languages_staff_fk_staff_id_fkey'
  }),
  unique('uq_language_staff').on(table.fkLanguageId, table.fkStaffId)
])

export const characters = pgTable('characters', {
  id: integer().primaryKey().notNull(),
  name: varchar().notNull(),
  description: varchar(),
  coverPic: varchar('cover_pic'),
  fkOriginalCreator: integer('fk_original_creator'),
  sex: boolean(),
  birthday: timestamp({ mode: 'date' }),
  inception: timestamp({ mode: 'date' }),
  created: timestamp({ withTimezone: true, mode: 'date' }).defaultNow(),
  edited: timestamp({ withTimezone: true, mode: 'date' }).defaultNow()
}, (table) => [
  foreignKey({
    columns: [table.fkOriginalCreator],
    foreignColumns: [staff.id],
    name: 'characters_fk_original_creator_fkey'
  })
])

export const jtCartoonsTags = pgTable('jt_cartoons_tags', {
  fkCartoonId: integer('fk_cartoon_id').notNull(),
  fkTagId: integer('fk_tag_id').notNull(),
  score: smallint(),
  spoiler: boolean(),
  created: timestamp({ withTimezone: true, mode: 'date' }).defaultNow(),
  edited: timestamp({ withTimezone: true, mode: 'date' }).defaultNow()
}, (table) => [
  foreignKey({
    columns: [table.fkCartoonId],
    foreignColumns: [cartoons.id],
    name: 'jt_cartoons_tags_fk_cartoon_id_fkey'
  }),
  foreignKey({
    columns: [table.fkTagId],
    foreignColumns: [tags.id],
    name: 'jt_cartoons_tags_fk_tag_id_fkey'
  }),
  unique('uq_cartoon_tag').on(table.fkCartoonId, table.fkTagId)
])

export const jtCartoonsCountries = pgTable('jt_cartoons_countries', {
  fkCartoonId: integer('fk_cartoon_id').notNull(),
  fkCountryId: integer('fk_country_id').notNull(),
  created: timestamp({ withTimezone: true, mode: 'date' }).defaultNow(),
  edited: timestamp({ withTimezone: true, mode: 'date' }).defaultNow()
}, (table) => [
  foreignKey({
    columns: [table.fkCartoonId],
    foreignColumns: [cartoons.id],
    name: 'jt_cartoons_countries_fk_cartoon_id_fkey'
  }),
  foreignKey({
    columns: [table.fkCountryId],
    foreignColumns: [countries.id],
    name: 'jt_cartoons_countries_fk_country_id_fkey'
  }),
  unique('uq_cartoon_country').on(table.fkCartoonId, table.fkCountryId)
])

export const languages = pgTable('languages', {
  id: integer().primaryKey().notNull(),
  name: varchar().notNull(),
  iso639: varchar(),
  created: timestamp({ withTimezone: true, mode: 'date' }).defaultNow(),
  edited: timestamp({ withTimezone: true, mode: 'date' }).defaultNow()
})

export const cartoons = pgTable('cartoons', {
  id: integer().primaryKey().notNull(),
  name: varchar().notNull(),
  description: varchar(),
  coverPic: varchar('cover_pic'),
  seasons: smallint(),
  episodes: smallint(),
  duration: smallint(),
  status: smallint(),
  airStart: timestamp('air_start', { mode: 'date' }),
  airEnd: timestamp('air_end', { mode: 'date' }),
  source: varchar(),
  ageRating: varchar('age_rating'),
  links: varchar(),
  created: timestamp({ withTimezone: true, mode: 'date' }).defaultNow(),
  edited: timestamp({ withTimezone: true, mode: 'date' }).defaultNow()
})

export const jtCartoonsLanguages = pgTable('jt_cartoons_languages', {
  score: smallint().default(0),
  fkCartoonId: integer('fk_cartoon_id').notNull(),
  fkLanguageId: integer('fk_language_id').notNull(),
  created: timestamp({ withTimezone: true, mode: 'date' }).defaultNow(),
  edited: timestamp({ withTimezone: true, mode: 'date' }).defaultNow()
}, (table) => [
  foreignKey({
    columns: [table.fkCartoonId],
    foreignColumns: [cartoons.id],
    name: 'jt_cartoons_languages_fk_cartoon_id_fkey'
  }),
  foreignKey({
    columns: [table.fkLanguageId],
    foreignColumns: [languages.id],
    name: 'jt_cartoons_languages_fk_language_id_fkey'
  }),
  unique('uq_cartoon_language').on(table.score, table.fkCartoonId, table.fkLanguageId)
])

export const jtOccupationsStaff = pgTable('jt_occupations_staff', {
  fkOccupationId: integer('fk_occupation_id').notNull(),
  fkStaffId: integer('fk_staff_id').notNull(),
  created: timestamp({ withTimezone: true, mode: 'date' }).defaultNow(),
  edited: timestamp({ withTimezone: true, mode: 'date' }).defaultNow()
}, (table) => [
  foreignKey({
    columns: [table.fkOccupationId],
    foreignColumns: [occupations.id],
    name: 'jt_occupations_staff_fk_occupation_id_fkey'
  }),
  foreignKey({
    columns: [table.fkStaffId],
    foreignColumns: [staff.id],
    name: 'jt_occupations_staff_fk_staff_id_fkey'
  }),
  unique('uq_occupation_staff').on(table.fkOccupationId, table.fkStaffId)
])

export const jtCompaniesCountries = pgTable('jt_companies_countries', {
  fkCompanyId: integer('fk_company_id').notNull(),
  fkCountryId: integer('fk_country_id').notNull(),
  created: timestamp({ withTimezone: true, mode: 'date' }).defaultNow(),
  edited: timestamp({ withTimezone: true, mode: 'date' }).defaultNow()
}, (table) => [
  foreignKey({
    columns: [table.fkCompanyId],
    foreignColumns: [companies.id],
    name: 'jt_companies_countries_fk_company_id_fkey'
  }),
  foreignKey({
    columns: [table.fkCountryId],
    foreignColumns: [countries.id],
    name: 'jt_companies_countries_fk_country_id_fkey'
  }),
  unique('uq_company_country').on(table.fkCompanyId, table.fkCountryId)
])

export const countries = pgTable('countries', {
  id: integer().primaryKey().notNull(),
  name: varchar().notNull(),
  iso316613: varchar('iso3166_1_3'),
  cid: integer(),
  continent: varchar(),
  created: timestamp({ withTimezone: true, mode: 'date' }).defaultNow(),
  edited: timestamp({ withTimezone: true, mode: 'date' }).defaultNow()
})

export const companyTags = pgTable('company_tags', {
  id: integer().primaryKey().notNull(),
  name: varchar().notNull(),
  created: timestamp({ withTimezone: true, mode: 'date' }).defaultNow(),
  edited: timestamp({ withTimezone: true, mode: 'date' }).defaultNow()
})

export const cartoonTypes = pgTable('cartoon_types', {
  id: integer().primaryKey().notNull(),
  name: varchar().notNull(),
  created: timestamp({ withTimezone: true, mode: 'date' }).defaultNow(),
  edited: timestamp({ withTimezone: true, mode: 'date' }).defaultNow()
})

export const reviews = pgTable('reviews', {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ name: 'reviews_id_seq', startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
  review: varchar(),
  score: smallint().notNull(),
  fkUserId: integer('fk_user_id').notNull(),
  fkCartoonId: integer('fk_cartoon_id').notNull(),
  created: timestamp({ withTimezone: true, mode: 'date' }).defaultNow(),
  edited: timestamp({ withTimezone: true, mode: 'date' }).defaultNow()
}, (table) => [
  foreignKey({
    columns: [table.fkCartoonId],
    foreignColumns: [cartoons.id],
    name: 'reviews_fk_cartoon_id_fkey'
  }),
  foreignKey({
    columns: [table.fkUserId],
    foreignColumns: [users.id],
    name: 'reviews_fk_user_id_fkey'
  })
])

export const cartoonStats = pgTable('cartoon_stats', {
  fkCartoonId: integer('fk_cartoon_id').notNull(),
  score: smallint(),
  ranked: integer(),
  popularity: integer(),
  members: integer(),
  favorites: integer(),
  created: timestamp({ withTimezone: true, mode: 'date' }).defaultNow(),
  edited: timestamp({ withTimezone: true, mode: 'date' }).defaultNow()
}, (table) => [
  foreignKey({
    columns: [table.fkCartoonId],
    foreignColumns: [cartoons.id],
    name: 'cartoon_stats_fk_cartoon_id_fkey'
  })
])

export const follows = pgTable('follows', {
  fkFollowingId: integer('fk_following_id').notNull(),
  fkFollowerId: integer('fk_follower_id').notNull(),
  created: timestamp({ withTimezone: true, mode: 'date' }).defaultNow(),
  edited: timestamp({ withTimezone: true, mode: 'date' }).defaultNow()
}, (table) => [
  foreignKey({
    columns: [table.fkFollowerId],
    foreignColumns: [users.id],
    name: 'follows_fk_follower_id_fkey'
  }),
  foreignKey({
    columns: [table.fkFollowingId],
    foreignColumns: [users.id],
    name: 'follows_fk_following_id_fkey'
  }),
  unique('uq_follow').on(table.fkFollowingId, table.fkFollowerId)
])

export const staff = pgTable('staff', {
  id: integer().primaryKey().notNull(),
  name: varchar().notNull(),
  description: varchar(),
  coverPic: varchar('cover_pic'),
  sex: boolean(),
  birthday: timestamp({ mode: 'date' }),
  deathday: timestamp({ mode: 'date' }),
  links: varchar(),
  created: timestamp({ withTimezone: true, mode: 'date' }).defaultNow(),
  edited: timestamp({ withTimezone: true, mode: 'date' }).defaultNow()
})

export const profileComments = pgTable('profile_comments', {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ name: 'profile_comments_id_seq', startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
  fkCommenterId: integer('fk_commenter_id').notNull(),
  userComment: varchar('user_comment').notNull(),
  fkUserId: integer('fk_user_id').notNull(),
  created: timestamp({ withTimezone: true, mode: 'date' }).defaultNow(),
  edited: timestamp({ withTimezone: true, mode: 'date' }).defaultNow()
}, (table) => [
  foreignKey({
    columns: [table.fkCommenterId],
    foreignColumns: [users.id],
    name: 'profile_comments_fk_commenter_id_fkey'
  }),
  foreignKey({
    columns: [table.fkUserId],
    foreignColumns: [users.id],
    name: 'profile_comments_fk_user_id_fkey'
  })
])

export const tags = pgTable('tags', {
  id: integer().primaryKey().notNull(),
  name: varchar().notNull(),
  created: timestamp({ withTimezone: true, mode: 'date' }).defaultNow(),
  edited: timestamp({ withTimezone: true, mode: 'date' }).defaultNow()
})

export const staffStats = pgTable('staff_stats', {
  fkStaffId: integer('fk_staff_id'),
  score: smallint(),
  ranked: integer(),
  popularity: integer(),
  members: integer(),
  favorites: integer(),
  created: timestamp({ withTimezone: true, mode: 'date' }).defaultNow(),
  edited: timestamp({ withTimezone: true, mode: 'date' }).defaultNow()
}, (table) => [
  foreignKey({
    columns: [table.fkStaffId],
    foreignColumns: [cartoons.id],
    name: 'staff_stats_fk_staff_id_fkey'
  })
])

export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ name: 'users_id_seq', startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
  name: varchar({ length: 64 }).notNull(),
  description: varchar(),
  coverPic: varchar('cover_pic'),
  pwd: varchar({ length: 256 }).notNull(),
  created: timestamp({ withTimezone: true, mode: 'date' }).defaultNow(),
  edited: timestamp({ withTimezone: true, mode: 'date' }).defaultNow(),
  lastLogin: timestamp('last_login', { withTimezone: true, mode: 'date' })
}, (table) => [
  unique('users_name_key').on(table.name)
])

export const sessions = pgTable('sessions', {
  id: integer().primaryKey().generatedAlwaysAsIdentity({
    name: 'sessions_id_seq',
    startWith: 1,
    increment: 1,
    minValue: 1,
    maxValue: 2147483647,
    cache: 1
  }),
  token: varchar({ length: 64 }).unique(), // Add this line
  fkUserId: integer('fk_user_id').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
  created: timestamp({ withTimezone: true, mode: 'date' }).defaultNow(),
  edited: timestamp({ withTimezone: true, mode: 'date' }).defaultNow()
}, (table) => [
  foreignKey({
    columns: [table.fkUserId],
    foreignColumns: [users.id],
    name: 'sessions_fk_user_id_fkey'
  })
])

export const userLists = pgTable('user_lists', {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ name: 'user_lists_id_seq', startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
  fkUserId: integer('fk_user_id').notNull(),
  fkCartoonId: integer('fk_cartoon_id').notNull(),
  status: smallint().notNull(),
  score: smallint(),
  startDate: timestamp('start_date', { withTimezone: true, mode: 'date' }),
  finishDate: timestamp('finish_date', { withTimezone: true, mode: 'date' }),
  rewatches: smallint(),
  episodesWatched: smallint('episodes_watched'),
  notes: varchar(),
  favorite: smallint(),
  created: timestamp({ withTimezone: true, mode: 'date' }).defaultNow(),
  edited: timestamp({ withTimezone: true, mode: 'date' }).defaultNow()
}, (table) => [
  foreignKey({
    columns: [table.fkCartoonId],
    foreignColumns: [cartoons.id],
    name: 'user_lists_fk_cartoon_id_fkey'
  }),
  foreignKey({
    columns: [table.fkUserId],
    foreignColumns: [users.id],
    name: 'user_lists_fk_user_id_fkey'
  }),
  unique('user_lists_fk_cartoon_id_fk_user_id_key').on(table.fkUserId, table.fkCartoonId)
])

export const occupations = pgTable('occupations', {
  id: integer().primaryKey().notNull(),
  name: varchar().notNull(),
  created: timestamp({ withTimezone: true, mode: 'date' }).defaultNow(),
  edited: timestamp({ withTimezone: true, mode: 'date' }).defaultNow()
})

export type User = InferSelectModel<typeof users>
// export type Session = InferSelectModel<typeof sessions>;
export interface Session {
  id: number
  token: string | null // Add this
  fkUserId: number
  expiresAt: Date
  created: Date | null
  edited: Date | null
}
