import type { Actions, PageServerLoad } from './$types'
import { error, redirect } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { and, eq, getTableColumns } from 'drizzle-orm'
import {
    cartoons,
    jtCartoonsLanguages,
    jtCartoonsCartoonTypes,
    companies,
    jtCompaniesCompanyTags,
    companyTags,
    characters,
    countries,
    staff,
    jtLanguagesStaff,
    jtOccupationsStaff,
    occupations,
    languages,
    tags,
    cartoonTypes,
} from '$lib/server/db/schema'
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
    const allLanguages = await db
        .select({ id: languages.id, name: languages.name })
        .from(languages)
        .orderBy(languages.name)

    const allTypes = await db
        .select({ id: cartoonTypes.id, name: cartoonTypes.name })
        .from(cartoonTypes)
        .orderBy(cartoonTypes.name)

    const allCountries = await db
        .select({ id: countries.id, name: countries.name })
        .from(countries)
        .orderBy(countries.name)

    const allTags = await db
        .select({ id: tags.id, name: tags.name })
        .from(tags)
        .orderBy(tags.name)

    const allCompanies = await db
        .select({ id: companies.id, name: companies.name })
        .from(companies)
        .orderBy(companies.name)

    const allCharacters = await db
        .select({ id: characters.id, name: characters.name })
        .from(characters)
        .orderBy(characters.name)

    const allStaff = await db
        .select({ id: staff.id, name: staff.name })
        .from(staff)
        .orderBy(staff.name)
    return {
        allLanguages,
        allTypes,
        allCountries,
        allTags,
        allCompanies,
        allCharacters,
        allStaff,
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
            jtCartoonsTags?: [
                fkTagId: number,
                score: number, // TODO: perhaps this should be modified elsewhere
                spoiler: boolean,
            ]
            jtCartoonsCompanies?: [fkCompanyId: number, role: number]
            jtCartoonsCharacters?: [
                // TODO: problem, possibly too many to send over, might have to use a search feature
                credited: boolean,
                fkStaffId: number,
                fkCharacterId: number,
                fkLanguageId: number,
            ]
            jtCartoonsStaff?: [
                // TODO: problem, possibly too many to send over, might lag
                credited: boolean,
                fkLanguageId: number, // this should probably not be used but sometimes there are more differences than just voices between dubs (music?)
                fkStaffId: number,
                role?: string,
            ]
        }
    }
}

export const actions = {
    default: async ({ request, locals, params }) => {
        if (!locals.user?.id) {
            console.log('Unauthorized attempted edit')
            return fail(401, {
                errors: { general: 'Invalid user, are you signed in?' },
            })
        }

        const { id } = params

        // Validate inputform
        const fkCartoonId = validateCartoonId(id)

        // const formData = await request.formData()
        // console.log(JSON.parse(formData.get('wholething')?.toString()))
        console.log(request.formData())
        return
        const airStart = new Date(formData.get('airStart')?.toString())
        const airEnd = new Date(formData.get('airEnd')?.toString())
        const form: ActionData = {
            editorMessage: formData.get('editorMessage')!.toString(),
            fields: {
                name: formData.get('name')!.toString(),
                description: formData.get('description')!.toString(),
                coverPic: formData.get('coverPic')?.toString() || undefined,
                seasons:
                    parseInt(formData.get('seasons')?.toString()) || undefined,
                episodes:
                    parseInt(formData.get('episodes')?.toString()) || undefined,
                duration:
                    parseInt(formData.get('duration')?.toString()) || undefined,
                status:
                    parseInt(formData.get('status')?.toString()) || undefined,
                airStart:
                    airStart.toString() !== 'Invalid Date'
                        ? airStart
                        : undefined,
                airEnd:
                    airEnd.toString() !== 'Invalid Date' ? airEnd : undefined,
                ageRating: formData.get('ageRating')?.toString() || undefined,
                links: formData.get('links')?.toString() || undefined,
                jts: {
                    jtCartoonsCartoonTypes: formData.getAll('types'),
                    jtCartoonsLanguages:
                        formData.getAll('languages')?.toString() || undefined,
                    jtCartoonsCountries:
                        formData.getAll('countries')?.toString() || undefined,
                    jtCartoonsCompanies:
                        formData.getAll('companies')?.toString() || undefined,
                    jtCartoonsStaff:
                        formData.getAll('staff')?.toString() || undefined,
                    jtCartoonsCharacters:
                        formData.getAll('characters')?.toString() || undefined,
                    jtCartoonsTags:
                        formData.getAll('tags')?.toString() || undefined,
                },
            },
        }
        // console.log({ form: form.fields })
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

            const { jts, ...rest } = form.fields
            const mainTable = { ...rest }
            // console.log('FORM: ', form)
            console.log('jts', { jts })

            const diff = {}
            // get existing entry (if exists)
            if (fkCartoonId) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { id, created, edited, ...rest } =
                    getTableColumns(cartoons)
                const old = (
                    await db
                        .select({
                            ...rest,
                        })
                        .from(cartoons)
                        .where(eq(cartoons.id, fkCartoonId))
                )[0]

                // diff received vs existing entry save only the difference
                for (const k in old) {
                    if (old[k] != form.fields[k]) {
                        diff[k] = form.fields[k]
                        console.log(old[k], form.fields[k])
                    }
                }
                console.log('altered fields', diff)
            }

            let updatedData = diff || mainTable
            console.log('altered fields', updatedData)

            await db
                .update(cartoons)
                .set(updatedData)
                .where(eq(cartoons.id, fkCartoonId))
            // await db
            //     .insert(cartoons)
            //     .values({
            //         id: fkCartoonId,
            //         updatedData,
            //     })
            //     .onConflictDoUpdate({
            //         target: [cartoons.id],
            //         set: updatedData,
            //     })
            return

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
