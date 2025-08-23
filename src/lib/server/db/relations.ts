import { relations } from "drizzle-orm/relations";
import { languages, jtCartoonsCharacters, cartoons, staff, characters, jtCartoonsCompanies, companies, countries, jtCountriesStaff, jtCompaniesCompanyTags, companyTags, jtCartoonsStaff, jtCartoonsCartoonTypes, cartoonTypes, jtLanguagesStaff, jtCartoonsTags, tags, jtCartoonsCountries, jtCartoonsLanguages, occupations, jtOccupationsStaff, jtCompaniesCountries, reviews, users, cartoonStats, follows, sessions, profileComments, staffStats, userLists } from "./schema";

export const jtCartoonsCharactersRelations = relations(jtCartoonsCharacters, ({one}) => ({
	language: one(languages, {
		fields: [jtCartoonsCharacters.fkLanguageId],
		references: [languages.id]
	}),
	cartoon: one(cartoons, {
		fields: [jtCartoonsCharacters.fkCartoonId],
		references: [cartoons.id]
	}),
	staff: one(staff, {
		fields: [jtCartoonsCharacters.fkStaffId],
		references: [staff.id]
	}),
	character: one(characters, {
		fields: [jtCartoonsCharacters.fkCharacterId],
		references: [characters.id]
	}),
}));

export const languagesRelations = relations(languages, ({many}) => ({
	jtCartoonsCharacters: many(jtCartoonsCharacters),
	jtCartoonsStaff: many(jtCartoonsStaff),
	jtLanguagesStaff: many(jtLanguagesStaff),
	jtCartoonsLanguages: many(jtCartoonsLanguages),
}));

export const cartoonsRelations = relations(cartoons, ({many}) => ({
	jtCartoonsCharacters: many(jtCartoonsCharacters),
	jtCartoonsCompanies: many(jtCartoonsCompanies),
	jtCartoonsStaff: many(jtCartoonsStaff),
	jtCartoonsCartoonTypes: many(jtCartoonsCartoonTypes),
	jtCartoonsTags: many(jtCartoonsTags),
	jtCartoonsCountries: many(jtCartoonsCountries),
	jtCartoonsLanguages: many(jtCartoonsLanguages),
	reviews: many(reviews),
	cartoonStats: many(cartoonStats),
	staffStats: many(staffStats),
	userLists: many(userLists),
}));

export const staffRelations = relations(staff, ({many}) => ({
	jtCartoonsCharacters: many(jtCartoonsCharacters),
	jtCountriesStaff: many(jtCountriesStaff),
	jtCartoonsStaff: many(jtCartoonsStaff),
	jtLanguagesStaff: many(jtLanguagesStaff),
	characters: many(characters),
	jtOccupationsStaff: many(jtOccupationsStaff),
}));

export const charactersRelations = relations(characters, ({one, many}) => ({
	jtCartoonsCharacters: many(jtCartoonsCharacters),
	staff: one(staff, {
		fields: [characters.fkOriginalCreator],
		references: [staff.id]
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

export const companiesRelations = relations(companies, ({many}) => ({
	jtCartoonsCompanies: many(jtCartoonsCompanies),
	jtCompaniesCompanyTags: many(jtCompaniesCompanyTags),
	jtCompaniesCountries: many(jtCompaniesCountries),
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

export const countriesRelations = relations(countries, ({many}) => ({
	jtCountriesStaff: many(jtCountriesStaff),
	jtCartoonsCountries: many(jtCartoonsCountries),
	jtCompaniesCountries: many(jtCompaniesCountries),
}));

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

export const companyTagsRelations = relations(companyTags, ({many}) => ({
	jtCompaniesCompanyTags: many(jtCompaniesCompanyTags),
}));

export const jtCartoonsStaffRelations = relations(jtCartoonsStaff, ({one}) => ({
	cartoon: one(cartoons, {
		fields: [jtCartoonsStaff.fkCartoonId],
		references: [cartoons.id]
	}),
	language: one(languages, {
		fields: [jtCartoonsStaff.fkLanguageId],
		references: [languages.id]
	}),
	staff: one(staff, {
		fields: [jtCartoonsStaff.fkStaffId],
		references: [staff.id]
	}),
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

export const cartoonTypesRelations = relations(cartoonTypes, ({many}) => ({
	jtCartoonsCartoonTypes: many(jtCartoonsCartoonTypes),
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
	jtOccupationsStaff: many(jtOccupationsStaff),
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

export const reviewsRelations = relations(reviews, ({one}) => ({
	cartoon: one(cartoons, {
		fields: [reviews.fkCartoonId],
		references: [cartoons.id]
	}),
	user: one(users, {
		fields: [reviews.fkUserId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	reviews: many(reviews),
	follows_fkFollowerId: many(follows, {
		relationName: "follows_fkFollowerId_users_id"
	}),
	follows_fkFollowingId: many(follows, {
		relationName: "follows_fkFollowingId_users_id"
	}),
	sessions: many(sessions),
	profileComments_fkCommenterId: many(profileComments, {
		relationName: "profileComments_fkCommenterId_users_id"
	}),
	profileComments_fkUserId: many(profileComments, {
		relationName: "profileComments_fkUserId_users_id"
	}),
	userLists: many(userLists),
}));

export const cartoonStatsRelations = relations(cartoonStats, ({one}) => ({
	cartoon: one(cartoons, {
		fields: [cartoonStats.fkCartoonId],
		references: [cartoons.id]
	}),
}));

export const followsRelations = relations(follows, ({one}) => ({
	user_fkFollowerId: one(users, {
		fields: [follows.fkFollowerId],
		references: [users.id],
		relationName: "follows_fkFollowerId_users_id"
	}),
	user_fkFollowingId: one(users, {
		fields: [follows.fkFollowingId],
		references: [users.id],
		relationName: "follows_fkFollowingId_users_id"
	}),
}));

export const sessionsRelations = relations(sessions, ({one}) => ({
	user: one(users, {
		fields: [sessions.fkUserId],
		references: [users.id]
	}),
}));

export const profileCommentsRelations = relations(profileComments, ({one}) => ({
	user_fkCommenterId: one(users, {
		fields: [profileComments.fkCommenterId],
		references: [users.id],
		relationName: "profileComments_fkCommenterId_users_id"
	}),
	user_fkUserId: one(users, {
		fields: [profileComments.fkUserId],
		references: [users.id],
		relationName: "profileComments_fkUserId_users_id"
	}),
}));

export const staffStatsRelations = relations(staffStats, ({one}) => ({
	cartoon: one(cartoons, {
		fields: [staffStats.fkStaffId],
		references: [cartoons.id]
	}),
}));

export const userListsRelations = relations(userLists, ({one}) => ({
	cartoon: one(cartoons, {
		fields: [userLists.fkCartoonId],
		references: [cartoons.id]
	}),
	user: one(users, {
		fields: [userLists.fkUserId],
		references: [users.id]
	}),
}));
