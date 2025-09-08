import type { Actions, PageServerLoad } from './$types'
import { error, redirect } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { and, eq } from 'drizzle-orm'
import { cartoons, userCartoonHistory, reviews } from '$lib/server/db/schema'
import '$lib/server/db/relations'
import { fail } from '@sveltejs/kit'
import { SESSION_COOKIE_NAME } from '$lib/constants/auth'
import { validateSessionToken } from '$lib/server/auth/session'

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
    // reviews: any[]
    reviews: Review[]
    stats: any[]
    userListEntry: any | null
    isFavorited: boolean
}

interface Review {
    id: number
    review: string
    score: number | null
    created: Date
    user: {
        id: number
        name: string
    }
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

    const reviews: Review[] =
        tmpCartoon.reviews?.map((review: any) => ({
            id: review.id,
            review: review.review,
            score: review.score,
            created: review.created,
            user: {
                id: review.user.id,
                name: review.user.name,
            },
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
        // reviews: tmpCartoon.reviews ?? [],
        reviews: reviews,
        stats: tmpCartoon.cartoonStats ?? [],
    }
}

// Fetches user's list entry for the cartoon
async function getUserListEntry(userId: number, cartoonId: number) {
    try {
        return await db.query.userCartoonHistory.findFirst({
            where: and(
                eq(userCartoonHistory.fkUserId, userId),
                eq(userCartoonHistory.fkCartoonId, cartoonId)
            ),
        })
    } catch (err) {
        console.error('Error fetching user list entry:', err)
        return null
    }
}

// Main load function
export const load: PageServerLoad = async ({ params, locals, cookies }) => {
    const { id } = params

    // Validate inputform
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

        // const user: User = {
        //     id: locals.user?.id,
        //     name: locals.user?.name,
        //     token: locals.session?.token,
        //     sessionId: locals.session?.id,
        // }

        const session = cookies.get(SESSION_COOKIE_NAME)

        console.log('User Cookies', session)
        console.log('Loaded cartoon:', cartoon.name, `(ID: ${cartoon.id})`)
        console.log('cartoonid', id)
        console.log('User list entry:', userListEntry)
        console.log('Is favorited:', isFavorited)

        let userReview

        if (session) {
            const { session: s } = await validateSessionToken(session)
            if (s?.id) {
                const x = (
                    await db
                        .select()
                        .from(reviews)
                        .where(
                            and(
                                eq(reviews.fkUserId, s?.fkUserId),
                                eq(reviews.fkCartoonId, cartoonID)
                            )
                        )
                        .limit(1)
                )[0]
                console.log('raw review query', x)
                userReview = {
                    id: x?.id, // this will be used to remove the logged in user's review from the rest of the reviews
                    review: x?.review,
                    score: x?.score,
                    created: x?.edited,
                }
            }
        }

        console.log('Existing User Review:', userReview)

        return {
            cartoon,
            session,
            userReview,
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

export interface ActionData {
    message?: string
    errors?: {
        general?: string
        review?: string
        score?: string
    }
    fields?: {
        review?: string
        score?: string
        fkCartoonId?: number
        token?: string //unhashed
    }
}
export const actions = {
    postReview: async ({ request }) => {
        const formData = await request.formData()
        const review = formData.get('review')?.toString()
        const score = parseInt(formData.get('score')?.toString()!)
        const token = formData.get('token')?.toString()
        const fkCartoonId = parseInt(formData.get('fkCartoonId')?.toString()!)
        console.log('Review post attempt:', {
            review,
            score,
            fkCartoonId,
            token,
        })
        if (!score || !review) {
            console.log('fail')
            return fail(400, {
                errors: { review: 'review and score required' },
                fields: { review, score },
            })
        }
        if (!fkCartoonId) {
            console.log('fail')
            return fail(400, {
                errors: { review: 'invalid cartoon id' },
                fields: { review, score },
            })
        }
        if (typeof score !== 'number' && score >= 0 && score <= 10) {
            console.log('fail')
            return fail(400, {
                errors: { score: 'score must be a number between 0 and 10' },
                fields: { review, score },
            })
        }
        if (review.length < 1000 || review.length > 5000) {
            // if (review.length < 10 || review.length > 5000) {// TODO: this line is for testing only
            console.log('fail')
            return fail(400, {
                errors: {
                    review: 'review must be between 1000 & 5000 characters',
                },
                fields: { review, score },
            })
        }

        try {
            console.log('Review post attempt:', { token, score, review })

            const cartoon = (
                await db
                    .select()
                    .from(cartoons)
                    .where(eq(cartoons.id, fkCartoonId))
                    .limit(1)
            )[0]

            if (!cartoon) {
                console.log(`Unable to find cartoon: ${fkCartoonId}`)
                return fail(400, {
                    errors: { general: 'Invalid cartoon' },
                    fields: { fkCartoonId },
                })
            }

            if (!token) {
                console.log(`Unable to find user token: ${token}`)
                return fail(400, {
                    errors: { general: 'Invalid user, are you signed in?' },
                })
            }

            // validate session
            const { session } = await validateSessionToken(token)

            if (!session?.fkUserId || !session) {
                console.log(`Unable to find user id: ${session?.fkUserId}`)
                return fail(400, {
                    errors: { general: 'Invalid user, are you signed in?' },
                })
            }

            const reviewExists = await db
                .select()
                .from(reviews)
                .where(
                    and(
                        eq(reviews.fkUserId, session?.fkUserId),
                        eq(reviews.fkCartoonId, fkCartoonId)
                    )
                )
                .limit(1)

            if (reviewExists.length > 0) {
                console.log(
                    `Attempted double reviewing of cartoonid: ${fkCartoonId}`
                )
                return fail(400, {
                    errors: { general: 'you have already posted a review' },
                })
            }

            console.log(`Attempting to post with`, { session, token })

            // insert review if user passes authentication
            await db.insert(reviews).values({
                review: review,
                score: score,
                fkUserId: session.fkUserId,
                fkCartoonId: fkCartoonId,
            })

            console.log(`New review posted by uid ${session.fkUserId}`, {
                score,
                review,
            })
        } catch (error) {
            console.error('Review post error:', error)
            return fail(500, {
                errors: { general: 'Error. Please try again.' },
                fields: { review, score },
            })
        }
        redirect(303, '/cartoons/'.concat(fkCartoonId.toString()))
    },
} satisfies Actions
