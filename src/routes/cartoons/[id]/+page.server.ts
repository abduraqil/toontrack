import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { and, eq } from 'drizzle-orm'
import { cartoons, userLists } from '$lib/server/db/schema'
import '$lib/server/db/relations'
import test from 'node:test'

/*
 * TODO:
 * Remove useless columns from query
 */

// Type definitions for better type safety
interface TransformedCartoon {
    id: number
    name: string
    description: string | null
    coverPic: string | null
    seasons: number | null
    episodes: number | null
    duration: number | null
    status: string | null
    airStart: Date | null
    airEnd: Date | null
    source: string | null
    ageRating: string | null
    links: any
    types: CartoonType[]
    languages: CartoonLanguage[]
    countries: CartoonCountry[]
    companies: CartoonCompany[]
    staff: CartoonStaff[]
    characters: CartoonCharacters[]
    tags: CartoonTag[]
    reviews: any[]
    stats: any[]
    userListEntry: any | null
    isFavorited: boolean
}

interface CartoonType {
    id: number
    name: string
    score: number | null
}

interface CartoonLanguage {
    id: number
    name: string
    iso639: string | null
    score: number | null
}

interface CartoonCountry {
    id: number
    name: string
    iso316613: string | null
}

interface CartoonCompany {
    role: string | null
    credited: boolean | null
    id: number
    name: string
    coverPic: string | null
}

interface CartoonStaff {
    role: number | null
    credited: boolean | null
    staff: {
        id: number
        name: string | null
        coverPic: string | null
    }
    language: {
        id: number | null
        name: string | null
    }
    // character: {
    //   id: number | null;
    //   name: string | null;
    //   coverPic: string | null;
    // };
}

interface CartoonCharacters {
    role: number | null
    credited: boolean | null
    staff: {
        id: number
        name: string | null
        coverPic: string | null
    }
    language: {
        id: number | null
        name: string | null
    }
    character: {
        id: number | null
        name: string | null
        coverPic: string | null
    }
}

interface CartoonTag {
    id: number
    name: string
    score: number | null
    spoiler: boolean | null
}

// Validate cartoon ID parameter
function validateCartoonId(id: string): number {
    if (!/^\d+$/.test(id)) {
        throw error(400, 'Invalid cartoon ID format')
    }

    const cartoonID = parseInt(id, 10)

    if (cartoonID <= 0) {
        throw error(400, 'Invalid cartoon ID')
    }

    return cartoonID
}

// Transforms junction table data into clean arrays
function transformCartoonData(
    tmpCartoon: any
): Omit<TransformedCartoon, 'userListEntry' | 'isFavorited'> {
    const cartoonTypes: CartoonType[] =
        tmpCartoon.jtCartoonsCartoonTypes?.map((type: any) => ({
            id: type.fkCartoonTypeId,
            name: type.cartoonType.name,
            score: type.score,
        })) ?? []

    const cartoonLanguages: CartoonLanguage[] =
        tmpCartoon.jtCartoonsLanguages?.map((lang: any) => ({
            id: lang.fkLanguageId,
            name: lang.language.name,
            iso639: lang.language.iso639,
            score: lang.score,
        })) ?? []

    const cartoonCountries: CartoonCountry[] =
        tmpCartoon.jtCartoonsCountries?.map((country: any) => ({
            id: country.fkCountryId,
            name: country.country.name,
            iso316613: country.country.iso316613,
        })) ?? []

    const cartoonCompanies: CartoonCompany[] =
        tmpCartoon.jtCartoonsCompanies?.map((company: any) => ({
            role: company.role,
            credited: company.credited,
            id: company.fkCompanyId,
            name: company.company.name,
            coverPic: company.company.coverPic,
        })) ?? []

    const cartoonStaff: CartoonStaff[] =
        tmpCartoon.jtCartoonsStaff?.map((role: any) => ({
            role: role.role,
            credited: role.credited,
            staff: {
                id: role.fkStaffId,
                name: role.staff?.name ?? null,
                coverPic: role.staff?.coverPic ?? null,
            },
            language: {
                id: role.fkLanguageId,
                name: role.language?.name ?? null,
            },
            // character: {
            //   id: role.fkCharacterId,
            //   name: role.character?.name ?? null,
            //   coverPic: role.character?.coverPic ?? null,
            // },
        })) ?? []

    const cartoonCharacters: CartoonCharacters[] =
        tmpCartoon.jtCartoonsCharacters?.map((role: any) => ({
            role: role.role,
            credited: role.credited,
            staff: {
                id: role.fkStaffId,
                name: role.staff?.name ?? null,
                coverPic: role.staff?.coverPic ?? null,
            },
            language: {
                id: role.fkLanguageId,
                name: role.language?.name ?? null,
            },
            character: {
                id: role.fkCharacterId,
                name: role.character?.name ?? null,
                coverPic: role.character?.coverPic ?? null,
            },
        })) ?? []

    const cartoonTags: CartoonTag[] =
        tmpCartoon.jtCartoonsTags?.map((tag: any) => ({
            id: tag.fkTagId,
            name: tag.tag.name,
            score: tag.score,
            spoiler: tag.spoiler,
        })) ?? []

    return {
        id: tmpCartoon.id,
        name: tmpCartoon.name,
        description: tmpCartoon.description,
        coverPic: tmpCartoon.coverPic,
        seasons: tmpCartoon.seasons,
        episodes: tmpCartoon.episodes,
        duration: tmpCartoon.duration,
        status: tmpCartoon.status,
        airStart: tmpCartoon.airStart,
        airEnd: tmpCartoon.airEnd,
        source: tmpCartoon.source,
        ageRating: tmpCartoon.ageRating,
        links: tmpCartoon.links,
        types: cartoonTypes,
        languages: cartoonLanguages,
        countries: cartoonCountries,
        companies: cartoonCompanies,
        characters: cartoonCharacters,
        staff: cartoonStaff,
        tags: cartoonTags,
        reviews: tmpCartoon.reviews ?? [],
        stats: tmpCartoon.cartoonStats ?? [],
    }
}

// Fetches user's list entry for the cartoon
async function getUserListEntry(userId: number, cartoonId: number) {
    try {
        return await db.query.userLists.findFirst({
            where: and(
                eq(userLists.fkUserId, userId),
                eq(userLists.fkCartoonId, cartoonId)
            ),
        })
    } catch (err) {
        console.error('Error fetching user list entry:', err)
        return null
    }
}

// Main load function
export const load: PageServerLoad = async ({ params, locals }) => {
    const { id } = params

    // Validate input
    const cartoonID = validateCartoonId(id)

    try {
        // Fetch user list entry if user is authenticated
        let userListEntry = null
        let isFavorited = false

        if (locals.user?.id) {
            userListEntry = await getUserListEntry(locals.user.id, cartoonID)
            isFavorited = userListEntry?.favorite === 1
        }

        // Fetch cartoon data
        const tmpCartoon = await db.query.cartoons.findFirst({
            where: eq(cartoons.id, cartoonID),
            with: {
                jtCartoonsCartoonTypes: {
                    with: {
                        cartoonType: true,
                    },
                },
                jtCartoonsLanguages: {
                    with: {
                        language: true,
                    },
                },
                jtCartoonsCountries: {
                    with: {
                        country: true,
                    },
                },
                jtCartoonsCompanies: {
                    with: {
                        company: true,
                    },
                },
                jtCartoonsStaff: {
                    with: {
                        staff: true,
                        // character: true,
                        language: true,
                    },
                },
                jtCartoonsCharacters: {
                    with: {
                        staff: true,
                        character: true,
                        language: true,
                    },
                },
                jtCartoonsTags: {
                    with: {
                        tag: true,
                    },
                },
                cartoonStats: {
                    with: {
                        cartoon: true,
                    },
                },
                reviews: {
                    with: {
                        user: true,
                    },
                },
            },
        })

        if (tmpCartoon == null) {
            throw error(404, 'Cartoon not found')
        }

        // Transform the data
        const cartoonData = transformCartoonData(tmpCartoon)

        // Combine with user-specific data
        const cartoon: TransformedCartoon = {
            ...cartoonData,
            userListEntry,
            isFavorited,
        }

        console.log('Loaded cartoon:', cartoon.name, `(ID: ${cartoon.id})`)
        console.log('User', locals.user)
        console.log('User list entry:', userListEntry)
        console.log('Is favorited:', isFavorited)

        return {
            cartoon,
        }
    } catch (err) {
        // Re-throw SvelteKit errors
        if (err && typeof err === 'object' && 'status' in err) {
            throw err
        }

        console.error('Error fetching cartoon:', err)
        throw error(500, 'Failed to load cartoon')
    }
}
