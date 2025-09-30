import {
    validateSessionToken,
    setSessionTokenCookie,
    deleteSessionTokenCookie,
} from '$lib/server/auth/session'
import { db } from '$lib/server/db'
import { friendRequests, friends, users } from '$lib/server/db/schema'
import '$lib/server/db/relations'

import type { Handle } from '@sveltejs/kit'
import { eq, or } from 'drizzle-orm'

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('session') || null
    if (token == null) {
        event.locals.session = null
        return await resolve(event)
    }

    let fR = null
    let f = null
    const { session } = await validateSessionToken(token)
    if (session !== null) {
        setSessionTokenCookie(event, token, session.expiresAt)
        fR = await db
            .select({
                fkTargetId: friendRequests.fkTargetId,
                fkSenderId: friendRequests.fkSenderId,
                name: users.name,
            })
            .from(friendRequests)
            .innerJoin(users, eq(friendRequests.fkTargetId, users.id))
            .where(or(eq(friendRequests.fkSenderId, session.userId)))
        fR = fR.concat(
            await db
                .select({
                    fkTargetId: friendRequests.fkTargetId,
                    fkSenderId: friendRequests.fkSenderId,
                    name: users.name,
                })
                .from(friendRequests)
                .innerJoin(users, eq(friendRequests.fkSenderId, users.id))
                .where(or(eq(friendRequests.fkTargetId, session.userId)))
        )

        console.log({ fR })
        // f = await db.query.friends.findMany({
        //     where: eq(friends.fkUser1, session.userId),
        // })
        f = await db
            .select({
                fkUser2: friends.fkUser2,
                name: users.name,
            })
            .from(friends)
            .innerJoin(users, eq(friends.fkUser2, users.id))
            .where(or(eq(friends.fkUser1, session.userId)))
    } else {
        deleteSessionTokenCookie(event)
    }

    event.locals.session = session
    if (session) {
        event.locals.session.friendRequests = fR
        event.locals.session.friend = f
    }
    console.log('User session validated:', {
        id: session?.userId,
        name: session?.name,
    })
    return await resolve(event)
}
