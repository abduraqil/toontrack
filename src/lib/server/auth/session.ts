import { db } from '$lib/server/db'
import { users, sessions } from '$lib/server/db/schema'
import { eq } from 'drizzle-orm'
import {
    encodeBase32LowerCaseNoPadding,
    encodeHexLowerCase,
} from '@oslojs/encoding'
import { sha256 } from '@oslojs/crypto/sha2'
import type { Session, User } from '$lib/server/db/schema' // Import from your schema file
import type { RequestEvent } from '@sveltejs/kit'

export function generateSessionToken(): string {
    const bytes = new Uint8Array(20)
    crypto.getRandomValues(bytes)
    const token = encodeBase32LowerCaseNoPadding(bytes)
    return token
}

export async function createSession(
    token: string,
    userID: number
): Promise<Session> {
    const sessionToken = encodeHexLowerCase(
        sha256(new TextEncoder().encode(token))
    )
    const sessionData = {
        token: sessionToken, // Store the hashed token
        fkUserId: userID,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    }
    const [insertedSession] = await db
        .insert(sessions)
        .values(sessionData)
        .returning()
    return insertedSession
}

/*
Sessions are validated in two steps:
1. Does the session exist in your database?
2. Is it still within expiration?
*/

export async function validateSessionToken(
    token: string
): Promise<SessionValidationResult> {
    const sessionToken = encodeHexLowerCase(
        sha256(new TextEncoder().encode(token))
    )
    const result = await db
        .select({ user: users, session: sessions })
        .from(sessions)
        .innerJoin(users, eq(sessions.fkUserId, users.id))
        .where(eq(sessions.token, sessionToken)) // Use token column

    if (result.length < 1) {
        return { session: null, user: null }
    }

    const { user, session } = result[0]

    if (Date.now() > session.expiresAt.getTime()) {
        await db.delete(sessions).where(eq(sessions.id, session.id))
        return { session: null, user: null }
    }

    // Refresh session if it's halfway to expiration (15 days left)
    if (Date.now() > session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
        session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
        await db
            .update(sessions)
            .set({
                expiresAt: session.expiresAt,
            })
            .where(eq(sessions.id, session.id))
    }

    return { session, user }
}

export async function invalidateSession(sessionId: string): Promise<void> {
    // If sessionId is numeric, use the id column, otherwise use token column
    if (/^\d+$/.test(sessionId)) {
        await db.delete(sessions).where(eq(sessions.id, Number(sessionId)))
    } else {
        await db.delete(sessions).where(eq(sessions.token, sessionId))
    }
}

export async function invalidateAllSessions(userID: number): Promise<void> {
    await db.delete(sessions).where(eq(sessions.fkUserId, userID))
}

export function setSessionTokenCookie(
    event: RequestEvent,
    token: string,
    expiresAt: Date
): void {
    event.cookies.set('session', token, {
        httpOnly: true,
        sameSite: 'lax',
        expires: expiresAt,
        path: '/',
    })
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
    event.cookies.set('session', '', {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
    })
}

export type SessionValidationResult =
    | { session: Session; user: User }
    | { session: null; user: null }
