import { relations } from "drizzle-orm/relations";
import { companies, jtCompaniesCompanyTags, companyTags, jtCompaniesCountries, countries, languages, jtLanguagesStaff, staff, occupations, jtOccupationsStaff, jtCountriesStaff, characters, cartoons, jtCartoonsCartoonTypes, cartoonTypes, jtCartoonsLanguages, jtCartoonsCountries, jtCartoonsCompanies, jtCartoonsStaff, jtCartoonsTags, tags, cartoonStats, users, sessions, profileComments, follows, userLists, reviews } from "./schema";

export const jtCompaniesCompanyTagsRelations = relations(jtCompaniesCompanyTags, ({one}) => ({
	company: one(companies, {
		fields: [jtCompaniesCompanyTags.fkCompanyId],
		references: [companies.id]
	}),
	companyTag: one(companyTags, {
		fields: [jtCompaniesCompanyTags.fkCompanyTagId],
		references: [companyTags.id]
	}),
}));

export const companiesRelations = relations(companies, ({many}) => ({
	jtCompaniesCompanyTags: many(jtCompaniesCompanyTags),
	jtCompaniesCountries: many(jtCompaniesCountries),
	jtCartoonsCompanies: many(jtCartoonsCompanies),
}));

export const companyTagsRelations = relations(companyTags, ({many}) => ({
	jtCompaniesCompanyTags: many(jtCompaniesCompanyTags),
}));

export const jtCompaniesCountriesRelations = relations(jtCompaniesCountries, ({one}) => ({
	company: one(companies, {
		fields: [jtCompaniesCountries.fkCompanyId],
		references: [companies.id]
	}),
	country: one(countries, {
		fields: [jtCompaniesCountries.fkCountryId],
		references: [countries.id]
	}),
}));

export const countriesRelations = relations(countries, ({many}) => ({
	jtCompaniesCountries: many(jtCompaniesCountries),
	jtCountriesStaffs: many(jtCountriesStaff),
	jtCartoonsCountries: many(jtCartoonsCountries),
}));

export const jtLanguagesStaffRelations = relations(jtLanguagesStaff, ({one}) => ({
	language: one(languages, {
		fields: [jtLanguagesStaff.fkLanguageId],
		references: [languages.id]
	}),
	staff: one(staff, {
		fields: [jtLanguagesStaff.fkStaffId],
		references: [staff.id]
	}),
}));

export const languagesRelations = relations(languages, ({many}) => ({
	jtLanguagesStaffs: many(jtLanguagesStaff),
	jtCartoonsLanguages: many(jtCartoonsLanguages),
	jtCartoonsStaffs: many(jtCartoonsStaff),
}));

export const staffRelations = relations(staff, ({many}) => ({
	jtLanguagesStaffs: many(jtLanguagesStaff),
	jtOccupationsStaffs: many(jtOccupationsStaff),
	jtCountriesStaffs: many(jtCountriesStaff),
	characters: many(characters),
	jtCartoonsStaffs: many(jtCartoonsStaff),
}));

export const jtOccupationsStaffRelations = relations(jtOccupationsStaff, ({one}) => ({
	occupation: one(occupations, {
		fields: [jtOccupationsStaff.fkOccupationId],
		references: [occupations.id]
	}),
	staff: one(staff, {
		fields: [jtOccupationsStaff.fkStaffId],
		references: [staff.id]
	}),
}));

export const occupationsRelations = relations(occupations, ({many}) => ({
	jtOccupationsStaffs: many(jtOccupationsStaff),
}));

export const jtCountriesStaffRelations = relations(jtCountriesStaff, ({one}) => ({
	country: one(countries, {
		fields: [jtCountriesStaff.fkCountryId],
		references: [countries.id]
	}),
	staff: one(staff, {
		fields: [jtCountriesStaff.fkStaffId],
		references: [staff.id]
	}),
}));

export const charactersRelations = relations(characters, ({one, many}) => ({
	staff: one(staff, {
		fields: [characters.fkOriginalCreator],
		references: [staff.id]
	}),
	jtCartoonsStaffs: many(jtCartoonsStaff),
}));

export const jtCartoonsCartoonTypesRelations = relations(jtCartoonsCartoonTypes, ({one}) => ({
	cartoon: one(cartoons, {
		fields: [jtCartoonsCartoonTypes.fkCartoonId],
		references: [cartoons.id]
	}),
	cartoonType: one(cartoonTypes, {
		fields: [jtCartoonsCartoonTypes.fkCartoonTypeId],
		references: [cartoonTypes.id]
	}),
}));

export const cartoonsRelations = relations(cartoons, ({many}) => ({
	jtCartoonsCartoonTypes: many(jtCartoonsCartoonTypes),
	jtCartoonsLanguages: many(jtCartoonsLanguages),
	jtCartoonsCountries: many(jtCartoonsCountries),
	jtCartoonsCompanies: many(jtCartoonsCompanies),
	jtCartoonsStaffs: many(jtCartoonsStaff),
	jtCartoonsTags: many(jtCartoonsTags),
	cartoonStats: many(cartoonStats),
	userLists: many(userLists),
	reviews: many(reviews),
}));

export const cartoonTypesRelations = relations(cartoonTypes, ({many}) => ({
	jtCartoonsCartoonTypes: many(jtCartoonsCartoonTypes),
}));

export const jtCartoonsLanguagesRelations = relations(jtCartoonsLanguages, ({one}) => ({
	cartoon: one(cartoons, {
		fields: [jtCartoonsLanguages.fkCartoonId],
		references: [cartoons.id]
	}),
	language: one(languages, {
		fields: [jtCartoonsLanguages.fkLanguageId],
		references: [languages.id]
	}),
}));

export const jtCartoonsCountriesRelations = relations(jtCartoonsCountries, ({one}) => ({
	cartoon: one(cartoons, {
		fields: [jtCartoonsCountries.fkCartoonId],
		references: [cartoons.id]
	}),
	country: one(countries, {
		fields: [jtCartoonsCountries.fkCountryId],
		references: [countries.id]
	}),
}));

export const jtCartoonsCompaniesRelations = relations(jtCartoonsCompanies, ({one}) => ({
	cartoon: one(cartoons, {
		fields: [jtCartoonsCompanies.fkCartoonId],
		references: [cartoons.id]
	}),
	company: one(companies, {
		fields: [jtCartoonsCompanies.fkCompanyId],
		references: [companies.id]
	}),
}));

export const jtCartoonsStaffRelations = relations(jtCartoonsStaff, ({one}) => ({
	language: one(languages, {
		fields: [jtCartoonsStaff.fkLanguageId],
		references: [languages.id]
	}),
	cartoon: one(cartoons, {
		fields: [jtCartoonsStaff.fkCartoonId],
		references: [cartoons.id]
	}),
	staff: one(staff, {
		fields: [jtCartoonsStaff.fkStaffId],
		references: [staff.id]
	}),
	character: one(characters, {
		fields: [jtCartoonsStaff.fkCharacterId],
		references: [characters.id]
	}),
}));

export const jtCartoonsTagsRelations = relations(jtCartoonsTags, ({one}) => ({
	cartoon: one(cartoons, {
		fields: [jtCartoonsTags.fkCartoonId],
		references: [cartoons.id]
	}),
	tag: one(tags, {
		fields: [jtCartoonsTags.fkTagId],
		references: [tags.id]
	}),
}));

export const tagsRelations = relations(tags, ({many}) => ({
	jtCartoonsTags: many(jtCartoonsTags),
}));

export const cartoonStatsRelations = relations(cartoonStats, ({one}) => ({
	cartoon: one(cartoons, {
		fields: [cartoonStats.fkCartoonId],
		references: [cartoons.id]
	}),
}));

export const sessionsRelations = relations(sessions, ({one}) => ({
	user: one(users, {
		fields: [sessions.fkUserId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	sessions: many(sessions),
	profileComments_fkUserId: many(profileComments, {
		relationName: "profileComments_fkUserId_users_id"
	}),
	profileComments_fkCommenterId: many(profileComments, {
		relationName: "profileComments_fkCommenterId_users_id"
	}),
	follows_fkFollowingId: many(follows, {
		relationName: "follows_fkFollowingId_users_id"
	}),
	follows_fkFollowerId: many(follows, {
		relationName: "follows_fkFollowerId_users_id"
	}),
	userLists: many(userLists),
	reviews: many(reviews),
}));

export const profileCommentsRelations = relations(profileComments, ({one}) => ({
	user_fkUserId: one(users, {
		fields: [profileComments.fkUserId],
		references: [users.id],
		relationName: "profileComments_fkUserId_users_id"
	}),
	user_fkCommenterId: one(users, {
		fields: [profileComments.fkCommenterId],
		references: [users.id],
		relationName: "profileComments_fkCommenterId_users_id"
	}),
}));

export const followsRelations = relations(follows, ({one}) => ({
	user_fkFollowingId: one(users, {
		fields: [follows.fkFollowingId],
		references: [users.id],
		relationName: "follows_fkFollowingId_users_id"
	}),
	user_fkFollowerId: one(users, {
		fields: [follows.fkFollowerId],
		references: [users.id],
		relationName: "follows_fkFollowerId_users_id"
	}),
}));

export const userListsRelations = relations(userLists, ({one}) => ({
	user: one(users, {
		fields: [userLists.fkUserId],
		references: [users.id]
	}),
	cartoon: one(cartoons, {
		fields: [userLists.fkCartoonId],
		references: [cartoons.id]
	}),
}));

export const reviewsRelations = relations(reviews, ({one}) => ({
	user: one(users, {
		fields: [reviews.fkUserId],
		references: [users.id]
	}),
	cartoon: one(cartoons, {
		fields: [reviews.fkCartoonId],
		references: [cartoons.id]
	}),
}));