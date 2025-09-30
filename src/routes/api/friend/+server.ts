import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { friendRequests, friends } from '$lib/server/db/schema'
import { and, eq, or } from 'drizzle-orm'

export const POST: RequestHandler = async ({ request, locals }) => {
    // validate user
    if (!locals?.session) {
        console.log('unauthorized')
        error(401, 'unauthorized')
    }
    const { target } = await request.json()

    const session = locals.session
    console.log('friend request: ', {
        from: session.userId,
        to: target,
    })

    // validate input
    if (isNaN(target) || !session.userId) {
        console.log('incomplete request')
        error(400, 'Incomplete request')
    }

    // cant request yourself TODO: needs postgres constraint
    if (target == session.userId) {
        console.log("can't friend request yourself")
        error(400, 'Incomplete request')
    }

    // check: already friends with target
    if (
        (
            await db
                .select()
                .from(friends)
                .where(
                    or(
                        and(
                            eq(friends.fkUser1, session.userId),
                            eq(friends.fkUser2, target)
                        ),
                        and(
                            eq(friends.fkUser1, target),
                            eq(friends.fkUser2, session.userId)
                        )
                    )
                )
        ).length > 0
    ) {
        console.log('request already sent')
        error(400, 'request already sent')
    }

    // check: already sent request to target
    if (
        (
            await db
                .select()
                .from(friendRequests)
                .where(
                    and(
                        eq(friendRequests.fkSenderId, session.userId),
                        eq(friendRequests.fkTargetId, target)
                    )
                )
        ).length > 0
    ) {
        console.log('request already sent')
        error(400, 'request already sent')
    }

    // query table for existing request where you are the target
    const existing = await db
        .select()
        .from(friendRequests)
        .where(
            and(
                eq(friendRequests.fkSenderId, target),
                eq(friendRequests.fkTargetId, session.userId)
            )
        )
    // if request already exists with you as target then:
    // handshake is complete -> move to friends table
    if (existing.length > 0) {
        await db
            .insert(friends)
            .values([
                {
                    fkUser1: session.userId,
                    fkUser2: target,
                },
                {
                    fkUser2: session.userId,
                    fkUser1: target,
                },
            ])
            .onConflictDoNothing()

        await db
            .delete(friendRequests)
            .where(
                or(
                    and(
                        eq(friendRequests.fkSenderId, session.userId),
                        eq(friendRequests.fkTargetId, target)
                    ),
                    and(
                        eq(friendRequests.fkSenderId, target),
                        eq(friendRequests.fkTargetId, session.userId)
                    )
                )
            )
        return json(
            {
                body: 'friend request accepted',
                ok: true,
            },
            { status: 300 }
        )
    }

    // modify db
    await db
        .insert(friendRequests)
        .values({
            fkSenderId: session.userId,
            fkTargetId: target,
        })
        .onConflictDoNothing()

    return json(
        {
            body: 'friend request sent',
            ok: true,
        },
        { status: 300 }
    )
}

export const DELETE: RequestHandler = async ({ locals, request }) => {
    // validate user
    if (!locals?.session) {
        console.log('unauthorized')
        error(401, 'unauthorized')
    }
    const { target } = await request.json()
    try {
        const session = locals.session
        console.log('friend request: ', {
            from: session.userId,
            to: target,
        })

        // delete from requests table and friends table
        await db
            .delete(friendRequests)
            .where(
                or(
                    and(
                        eq(friendRequests.fkSenderId, session.userId),
                        eq(friendRequests.fkTargetId, target)
                    ),
                    and(
                        eq(friendRequests.fkSenderId, target),
                        eq(friendRequests.fkTargetId, session.userId)
                    )
                )
            )
        await db
            .delete(friends)
            .where(
                or(
                    and(
                        eq(friends.fkUser1, session.userId),
                        eq(friends.fkUser2, target)
                    ),
                    and(
                        eq(friends.fkUser1, target),
                        eq(friends.fkUser2, session.userId)
                    )
                )
            )
        console.log('delete successful')
        return json(
            {
                body: 'delete successful',
                ok: true,
            },
            { status: 300 }
        )
    } catch (err) {
        console.error('Error fetching cartoon:', err)
        throw error(500, 'Failed to delete')
    }
}
