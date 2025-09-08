import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { eq, and } from 'drizzle-orm'
import '$lib/server/db/relations'
import { companies, userCompanyFavorites } from '$lib/server/db/schema'
/* TODO add in type gaurd for CompanyFID */

// Fetches user's favorites entry for the CompanyFer
async function getUserFavoriteEntry(userId: number, companyId: number) {
    try {
        return await db.query.userCompanyFavorites.findFirst({
            where: and(
                eq(userCompanyFavorites.fkUserId, userId),
                eq(userCompanyFavorites.fkCompanyId, companyId)
            ),
        })
    } catch (err) {
        console.error('Error fetching user favorites entry:', err)
        return null
    }
}

/* TODO
add in type guard for companyID
*/

export const load: PageServerLoad = async ({ params, locals }) => {
    const { id } = params

    // Only allow numeric IDs
    if (!/^\d+$/.test(id)) {
        throw error(400, 'Invalid company ID format')
    }

    const companyID = parseInt(id, 10)

    // Additional safety check
    if (companyID <= 0) {
        throw error(400, 'Invalid company ID')
    }

    try {
        // Fetch user list entry if user is authenticated
        let userFavoriteEntry = null

        if (locals.user?.id) {
            userFavoriteEntry = await getUserFavoriteEntry(locals.user.id, companyID)
        }

        const tmpCompany = await db.query.companies.findFirst({
            where: eq(companies.id, companyID),
            with: {
                jtCompaniesCompanyTags: {
                    with: {
                        companyTag: true,
                    },
                },
                jtCompaniesCountries: {
                    with: {
                        country: true,
                    },
                },
                jtCartoonsCompanies: {
                    with: {
                        cartoon: true,
                    },
                },
            },
        })

        if (tmpCompany == null) {
            throw error(404, 'company not found')
        }

        let tags: any[] = []
        tmpCompany?.jtCompaniesCompanyTags.forEach((x) => {
            tags = tags.concat({
                id: x.fkCompanyTagId,
                score: x.score,
                name: x.companyTag.name,
            })
        })

        let countries: any[] = []
        tmpCompany?.jtCompaniesCountries.forEach((x) => {
            countries = countries.concat({
                id: x.fkCountryId,
                name: x.country?.name,
                iso: x.country?.iso316613,
            })
        })

        let cartoons: any[] = []
        tmpCompany?.jtCartoonsCompanies.forEach((x) => {
            cartoons = cartoons.concat({
                id: x.fkCartoonId,
                name: x.cartoon.name,
                coverPic: x.cartoon.coverPic,
                role: x.role,
            })
        })

        const company = {
            id: tmpCompany.id,
            name: tmpCompany.name,
            description: tmpCompany.description,
            coverPic: tmpCompany.coverPic,
            established: tmpCompany.established,
            defunct: tmpCompany.defunct,
            links: tmpCompany.links,
            tags,
            countries,
            cartoons,
            userFavoriteEntry,
        }
        console.log(company)
        // console.log("company ")
        // console.log(tmpCompany)

        return {
            company,
        }
    } catch (err) {
        console.error('Error fetching company:', err)
        throw error(500, 'Failed to load company')
    }
}
