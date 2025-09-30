import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { userCartoonHistory } from '$lib/server/db/schema'
import { and, eq } from 'drizzle-orm'

interface uCHEntry {
    fkUserId: number
    fkCartoonId: number
    status: number
    score?: number
    startDate?: string
    finishDate?: string
    rewatches?: number
    episodesWatched?: number
    notes?: string
    favorite?: number
}

interface uCHDelete {
    fkUserId: number
    fkCartoonId: number
}

export const POST: RequestHandler = async ({ request, locals }) => {
    const { itemId, s = 0, sc, sD, fD, r, e, n, f } = await request.json()

    // validate user
    if (!locals?.session) {
        console.log('unauthorized')
        error(401, 'unauthorized')
    }

    const session = locals.session
    console.log('server received list', {
        user: session.fkUserId,
        itemId,
        s,
        sc,
        sD,
        fD,
        r,
        e,
        n,
        f,
    })

    // validate input
    if (isNaN(itemId) || !session.id) {
        console.log('incomplete request')
        error(400, 'Incomplete request')
    }

    const entry: uCHEntry = {
        fkUserId: session.fkUserId,
        fkCartoonId: itemId,
        status: s == undefined || s < 0 || s > 5 ? 0 : s,
        score: sc,
        startDate: sD,
        finishDate: fD,
        rewatches: r,
        episodesWatched: e,
        notes: n,
    }

    // modify db
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { fkUserId, fkCartoonId, ...rest } = entry
    await db
        .insert(userCartoonHistory)
        .values(entry)
        .onConflictDoUpdate({
            target: [
                userCartoonHistory.fkUserId,
                userCartoonHistory.fkCartoonId,
            ],
            set: {
                ...rest,
            },
        })

    return json('ok')
}

export const DELETE: RequestHandler = async ({ locals, url }) => {
    // validate user
    if (!locals?.session) {
        console.log('unauthorized')
        error(401, 'unauthorized')
    }

    const e: uCHDelete = {
        fkUserId: locals.session.fkUserId,
        fkCartoonId: parseInt(url.searchParams.get('itemId')!),
    }
    console.log('server received delete request', e)

    // validate input
    if (isNaN(e.fkCartoonId) || !e.fkUserId) {
        console.log('incomplete request')
        error(400, 'Incomplete request')
    }

    // modify db
    await db
        .delete(userCartoonHistory)
        .where(
            and(
                eq(userCartoonHistory.fkUserId, e.fkUserId),
                eq(userCartoonHistory.fkCartoonId, e.fkCartoonId)
            )
        )
    console.log('delete request successful')

    return json('ok')
}
