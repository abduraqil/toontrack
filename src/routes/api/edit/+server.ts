import type { RequestHandler } from '@sveltejs/kit'
import { error, fail, json, redirect } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { and, eq, getTableColumns } from 'drizzle-orm'
import {
    cartoons,
    jtCartoonsLanguages,
    jtCartoonsCartoonTypes,
    companies,
    jtCartoonsTags,
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

export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user?.id) {
        console.log('Unauthorized attempted posting of review')
        error(401, 'Invalid user, are you signed in?')
    }

    try {
        const form: ActionData = await request.json()

        const fkCartoonId = validateCartoonId(form.fields.id.toString())

        console.log('Edit attempt - Cartoon page:', fkCartoonId)
        if (!form.fields.description || !form.fields.name) {
            console.log('error')
            error(400, 'review and score required')
        }
        if (!fkCartoonId) {
            console.log('error')
            error(400, 'invalid cartoon id')
        }

        if (form.fields.airEnd) {
            form.fields.airEnd = new Date(form.fields.airEnd)
        }
        if (form.fields.airStart) {
            form.fields.airStart = new Date(form.fields.airStart)
        }

        const diff = {}
        if (fkCartoonId) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, created, edited, ...rest } = getTableColumns(cartoons)
            const old = await getOld(fkCartoonId)
            // diff received vs existing tblaes entry save only the difference
            for (const k in old) {
                if (JSON.stringify(form.fields[k]) != JSON.stringify(old[k])) {
                    diff[k] = form.fields[k]
                    /*
                    if (/^jt/.test(k)) {
                        for (const l in form.fields[k]) { // loop through forms jt arrays
                            let fk = findFK(k)
                            console.log("junction table", fk)
                            for (const m in old[k]) { // loop through jts in old to find if id in fields is in old
                                // compare jt ids and save them if not equal (ie user modified that field)
                                // compare params
                                // if same then pop, otherwise save in diff
                                // pop the compared column

                                // console.log("digg", form.fields[k][l].id, old[k][m][fk])
                                if (form.fields[k][l][fk] == old[k][m][fk]) {
                                    console.log("existing", form.fields[k][l], old[k][m])
                                    if (JSON.stringify(form.fields[k][l]) == JSON.stringify(old[k][m])) {
                                        console.log("same")
                                        // diff[k][l].pop()
                                        // form.fields[k][l].pop()
                                        break
                                    } else {
                                        console.log("modification")
                                        diff[k].push(form.fields[k][l])
                                        // diff[k][l].pop()
                                        // form.fields[k][l].pop()
                                        break
                                    }
                                }
                            }
                        }
                    }
                    */
                }
            }
        }

        console.log('altered fields', diff)
        // jtCartoonsCartoonTypes
        // jtCartoonsLanguages
        // jtCartoonsCountries
        // jtCartoonsTags
        // jtCartoonsCompanies
        // jtCartoonsCharacters
        // jtCartoonsStaff

        // await db
        //     .update(cartoons)
        //     .set(updatedData)
        //     .where(eq(cartoons.id, fkCartoonId))
        // await db
        //     .insert(cartoons)
        //     .values({
        //         id: fkCartoonId,
        //         name: form.fields.name,
        //         description: form.fields.description,
        //         coverPic: form.fields.coverPic,
        //         seasons: form.fields.seasons,
        //         episodes: form.fields.episodes,
        //         duration: form.fields.duration,
        //         status: form.fields.status,
        //         airStart: form.fields.airStart,
        //         airEnd: form.fields.airEnd,
        //         ageRating: form.fields.ageRating,
        //         links: form.fields.links,
        //     })
        //     .onConflictDoUpdate({
        //         target: [cartoons.id],
        //         set: diff,
        //     })
        await db
            .insert(cartoons)
            .values({
                id: fkCartoonId,
                diff,
            })
            .onConflictDoUpdate({
                target: [cartoons.id],
                set: diff,
            })

        // if (form.fields.jts.jtCartoonsTags) {
        //     console.log('editing tags', form.fields.jts.jtCartoonsTags)
        //     console.log(await db
        //         .select()
        //         .from(jtCartoonsTags)
        //         .where(eq(jtCartoonsTags.fkCartoonId, fkCartoonId)))
        //     // await db
        //     //     .insert(jtCartoonsTags)
        //     //     .values(jts.jtCartoonsTags)
        //     //     .onConflictDoUpdate({
        //     //         target: [fkCartoonId],
        //     //         set: jts.jtCartoonsTags,
        //     //     })
        // }

        // console.log('Cartoon edit successful:', { fkCartoonId })
        return json('ok')
    } catch (error) {
        console.error('Review post error:', error)
        return json({ error: 'Failed to toggle favorite' }, { status: 500 })
    }
    // redirect(303, '/cartoons/'.concat(fkCartoonId.toString()))
}

function diff(k: any) {
}

function findFK(k: string) {
    switch (k) {
        case 'jtCartoonsCartoonTypes':
            return 'fkCartoonTypeId'
        case 'jtCartoonsLanguages':
            return 'fkLanguageId'
        case 'jtCartoonsCountries':
            return 'fkCountryId'
        case 'jtCartoonsTags':
            return 'fkTagId'
        case 'jtCartoonsCompanies':
            return 'fkCompanyId'
        case 'jtCartoonsCharacters':
            return 'fkCharacterId'
        case 'jtCartoonsStaff':
            return 'fkStaffId'
    }
}

async function getOld(id: number) {
    return await db.query.cartoons.findFirst({
        where: eq(cartoons.id, id),
        columns: {
            created: false,
            edited: false,
        },
        with: {
            jtCartoonsCartoonTypes: {
                columns: {
                    fkCartoonId: false, created: false,
                    edited: false,
                }
            },
            jtCartoonsLanguages: {
                columns: {
                    fkCartoonId: false, created: false,
                    edited: false,
                }
            },
            jtCartoonsCountries: {
                columns: {
                    fkCartoonId: false, created: false,
                    edited: false,
                }
            },
            jtCartoonsCompanies: {
                columns: {
                    fkCartoonId: false, created: false,
                    edited: false,
                }
            },
            jtCartoonsStaff: {
                columns: {
                    fkCartoonId: false, created: false,
                    edited: false,
                }
            },
            jtCartoonsCharacters: {
                columns: {
                    fkCartoonId: false, created: false,
                    edited: false,
                }
            },
            jtCartoonsTags: {
                columns: {
                    fkCartoonId: false, created: false,
                    edited: false,
                }
            },
        },
    })
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
        id: number
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
        // jts: {
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
    // }
}
