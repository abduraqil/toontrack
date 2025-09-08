import { error, json, } from '@sveltejs/kit'
import type { RequestHandler } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { userCartoonHistory } from '$lib/server/db/schema'
// import { eq, and } from 'drizzle-orm'
// import { SESSION_COOKIE_NAME } from '$lib/constants/auth'
// import { validateSessionToken } from '$lib/server/auth/session'

interface uCHEntry {
    fkUserId: number
    fkCartoonId: number
    status: number
    score?: number
    startDate?: Date
    finishDate?: Date
    rewatches?: number
    episodesWatched?: number
    notes?: string
    favorite?: number
}

export const POST: RequestHandler = async ({ request, cookies, locals }) => {
    const { itemId, t, s, sc, sD, fD, r, e, n, f } = await request.json()
    // const session = cookies.get(SESSION_COOKIE_NAME);

    // validate user
    if (!locals?.session) {
        console.log('unauthorized')
        error(401, 'unauthorized')
    }

    const session = locals.session
    console.log('server received list', {
        user: session.id,
        itemId,
        t,
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
    if (isNaN(itemId) || !t || !s || !session.id || s < 0 || s > 5) {
        console.log('incomplete request')
        error(400, 'Incomplete request')
    }

    const entry: uCHEntry = {
        fkUserId: session.fkUserId,
        fkCartoonId: itemId,
        status: s,
        score: sc,
        startDate: new Date(sD),
        finishDate: new Date(fD),
        rewatches: r,
        episodesWatched: e,
        notes: n,
        // favorite: (f) ? f : null,
    }
    // console.log(typeof(fD))
    console.log({ entry })

    // modify db
    // TODO: this should be an update if it already exists
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
