import { db } from '$lib/server/db';
import { users, sessionTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import type { Session, User } from '$lib/server/db/schema'; // Import from your schema file


export function generateSessionToken(): string {
    const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;

}

export async function createSession(token: string, userID: number): Promise<Session> {
	const sessionID = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: Session = {
		id: sessionID,
		userID,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
	};
	await db.insert(sessionTable).values(session);
	return session
}

/*
Sessions are validated in two steps:
1. Does the session exist in your database?
2. Is it still within expiration?
*/

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
	const sessionID = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const result = await db
		.select({user: users, session: sessionTable})
		.from(sessionTable)
		.innerJoin(users, eq(sessionTable.userID, users.id))
		.where(eq(sessionTable.id, sessionID));
	if (result.length < 1) {
		return { session: null, user: null };
	}

	const {user, session} = result[0];

	if (Date.now() > session.expiresAt.getTime()) {
		await db.delete(sessionTable).where(eq(sessionTable.id, session.id));
		return {session: null, user: null};
	} 

	if (Date.now() > session.expiresAt.getTime() - 100 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		await db
			.update(sessionTable)
			.set({
				expiresAt: session.expiresAt
			})
			.where(eq(sessionTable.id, session.id));
	}

	return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

export async function invalidateAllSessions(userID: number): Promise<void> {
	await db.delete(sessionTable).where(eq(sessionTable.userID, userID));
}

export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };

