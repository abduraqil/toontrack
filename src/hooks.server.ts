import {
    validateSessionToken,
    setSessionTokenCookie,
    deleteSessionTokenCookie,
} from '$lib/server/auth/session'
import { db } from '$lib/server/db'
import { friendRequests } from '$lib/server/db/schema'

import type { Handle } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('session') || null
    if (token == null) {
        event.locals.user = null
        event.locals.session = null
        return await resolve(event)
    }

    let fR = null
    const { session, user } = await validateSessionToken(token)
    if (session !== null) {
        setSessionTokenCookie(event, token, session.expiresAt)
        console.log({ fR })
        fR = await db.query.friendRequests.findMany({
            where:
                eq(friendRequests.fkTargetId, user.id),
        })
    } else {
        deleteSessionTokenCookie(event)
    }


    event.locals.session = session
    event.locals.user = user
    event.locals.user.friendRequests = fR
    console.log('User session validated:', { id: user?.id, name: user?.name })
    return await resolve(event)
}
