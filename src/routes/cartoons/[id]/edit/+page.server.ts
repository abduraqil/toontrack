import type { Actions, PageServerLoad } from './$types'
import { error, redirect } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { and, eq } from 'drizzle-orm'
import { cartoons, jtCartoonsTags } from '$lib/server/db/schema'
import '$lib/server/db/relations'
import { fail } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ locals, url }) => {
    // redirect to login page if not signed in
    if (!locals?.session?.fkUserId) {
        redirect(
            303,
            '/login?reference='.concat(encodeURIComponent(url.pathname))
        )
    }
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

export interface ActionData {
    message?: string
    errors?: {
        general?: string
    }
    editorMessage: string
    fields: {
        name: string
        description: string
        coverPic?: string
        seasons?: number
        episodes?: number
        duration?: number
        status?: number
        airStart?: Date
        airEnd?: Date
        ageRating?: string
        links?: string
        jts: {
            jtCartoonsCartoonTypes?: [
                fkCartoonTypeId: number,
                score: number, // TODO: perhaps this should be modified elsewhere
            ]
            jtCartoonsLanguages?: [fkLanguageId: number, score: number]
            jtCartoonsCountries?: [fkCountryId: number]
            jtCartoonsCompanies?: [fkCompanyId: number, role: number]
            jtCartoonsStaff?: [
                // TODO: problem, possibly too many to send over, might have to use a search feature
                credited: boolean,
                fkLanguageId: number, // this should probably not be used but sometimes there are more differences than just voices between dubs (music?)
                fkStaffId: number,
                role?: string,
            ]
            jtCartoonsCharacters?: [
                // TODO: problem, possibly too many to send over, might have to use a search feature
                credited: boolean,
                fkStaffId: number,
                fkCharacterId: number,
                fkLanguageId: number,
            ]
            jtCartoonsTags?: [
                fkTagId: number,
                score: number, // TODO: perhaps this should be modified elsewhere
                spoiler: boolean,
            ]
        }
    }
}

export const actions = {
    default: async ({ request, locals, params }) => {
        if (!locals.user?.id) {
            console.log('Unauthorized attempted posting of review')
            return fail(401, {
                errors: { general: 'Invalid user, are you signed in?' },
            })
        }

        const { id } = params

        // Validate inputform
        const fkCartoonId = validateCartoonId(id)

        const formData = await request.formData()
        const form: ActionData = {
            fields: {
                name: formData.get('name')!.toString(),
                description: formData.get('description')!.toString(),
                coverPic: formData.get('coverPic')?.toString(),
                seasons: parseInt(formData.get('seasons')?.toString()),
                episodes: parseInt(formData.get('episodes')?.toString()),
                duration: parseInt(formData.get('duration')?.toString()),
                status: parseInt(formData.get('status')?.toString()),
                airStart: new Date(formData.get('airStart')?.toString()),
                airEnd: new Date(formData.get('airEnd')?.toString()),
                ageRating: formData.get('ageRating')?.toString(),
                links: formData.get('links')?.toString(),
            },
            jts: {},
        }
        // console.log({ form: form.fields })
        console.log('Edit attempt - Cartoon page:', {
            fkCartoonId,
            name: form.fields.name,
        })
        if (!form.fields.description || !form.fields.name) {
            console.log('fail')
            return fail(400, {
                errors: { general: 'review and score required' },
                // fields: { general, score },
            })
        }
        if (!fkCartoonId) {
            console.log('fail')
            return fail(400, {
                errors: { general: 'invalid cartoon id' },
                fields: form.fields,
            })
        }

        // if (typeof score !== 'number' && score >= 0 && score <= 10) {
        //     console.log('fail')
        //     return fail(400, {
        //         errors: { general: 'score must be a number between 0 and 10' },
        //         fields: form.fields
        //     })
        // }
        // if (description.length < 1000 || description.length > 5000) {
        //     console.log('fail')
        //     return fail(400, {
        //         errors: {
        //             general: 'review must be between 1000 & 5000 characters',
        //         },
        //         fields: form.fields
        //     })
        // }

        try {
            const fkUserId = locals.session.fkUserId

            // insert review if user passes authentication
            console.log('Review post attempt:', { fkUserId })
            const { jts, ...rest } = form.fields
            console.log('FORM: ', form.fields)
            return
            await db
                .insert(cartoons)
                .values(...rest)
                .onConflictDoUpdate({
                    target: [fkUserId, fkCartoonId],
                    set: { ...rest },
                })

            // if (jts.jtCartoonsTags) {
            //     await db
            //         .insert(jtCartoonsTags)
            //         .values(jts.jtCartoonsTags)
            //         .onConflictDoUpdate({
            //             target: [fkUserId, fkCartoonId],
            //             set: jts.jtCartoonsTags,
            //         })
            // }

            console.log('Cartoon edit successful:', { fkCartoonId })
        } catch (error) {
            console.error('Review post error:', error)
            return fail(500, {
                errors: { general: 'Error. Please try again.' },
                fields: form.fields,
            })
        }
        redirect(303, '/cartoons/'.concat(fkCartoonId.toString()))
    },
} satisfies Actions
