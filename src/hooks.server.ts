import {
    validateSessionToken,
    setSessionTokenCookie,
    deleteSessionTokenCookie,
} from '$lib/server/auth/session'
import { db } from '$lib/server/db'
import { friendRequests, friends } from '$lib/server/db/schema'

import type { Handle } from '@sveltejs/kit'
import { eq, or } from 'drizzle-orm'

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('session') || null
    if (token == null) {
        event.locals.user = null
        event.locals.session = null
        return await resolve(event)
    }

    let fR = null
    let f = null
    const { session, user } = await validateSessionToken(token)
    if (session !== null) {
        setSessionTokenCookie(event, token, session.expiresAt)
        fR = await db.query.friendRequests.findMany({
            where: or(
                eq(friendRequests.fkTargetId, user.id),
                eq(friendRequests.fkSenderId, user.id)
            ),
        })
        // f = await db.query.friends.findMany({
        //     where: eq(friends.fkUser1, user.id),
        // })
    } else {
        deleteSessionTokenCookie(event)
    }

    // TODO: locals likely does not need both of these
    event.locals.session = session
    event.locals.user = user
    event.locals.user.friendRequests = fR
    // event.locals.user.friends = f
    console.log('User session validated:', { id: user?.id, name: user?.name })
    return await resolve(event)
}
