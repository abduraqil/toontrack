import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { eq } from 'drizzle-orm'
import { companies } from '$lib/server/db/schema'
import '$lib/server/db/relations'

/* TODO
add in type guard for companyID
*/

export const load: PageServerLoad = async ({ params }) => {
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
