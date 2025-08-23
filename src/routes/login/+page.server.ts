import { fail, redirect } from '@sveltejs/kit';
import type { Actions, RequestEvent, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { users } from '$lib/server/db/schema';
import argon2 from 'argon2';

import {
	validateSessionToken,
	setSessionTokenCookie,
	deleteSessionTokenCookie,
	generateSessionToken,
	createSession
} from "$lib/server/auth/session";

export interface ActionData {
	message?: string;
	errors?: {
		general?: string;
		username?: string;
		password?: string;
	};
	fields?: {
		username?: string;
	};
}

export const actions = {
	login: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const username = formData.get('username')?.toString();
		const password = formData.get('password')?.toString();

		console.log(formData)

		if (!username || !password) {
			return fail(400, {
				errors: { general: 'Username and password are required' },
				fields: { username }
			});
		}

		try {
			console.log('Login attempt:', { username, password });
			const user = await db.query.users.findFirst({
				where: eq(users.name, username),
				//columns: { id: true, name: true, pwd: true }
			});


			if (!user) {
				return fail(400, {
					errors: { username: 'Invalid username' },
					fields: { username }
				});
			}

			const isPasswordValid = await argon2.verify(user.pwd, password,
				{
					secret: Buffer.from('mysecret')
				});
			console.log('Password verification result:', isPasswordValid);
			if (!isPasswordValid) {
				console.log('Invalid password for user:', username);
				return fail(400, {
					errors: { password: 'Invalid password' },
					fields: { username }
				});
			}

			const token = generateSessionToken();
			const { expiresAt } = await createSession(token, user.id);

			// Convert expiresAt to Date if it's a string
			const expiresDate = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;

			// Pass full event to cookie functions
			setSessionTokenCookie(event, token, expiresDate);

			console.log('Session creation result:', { token, expiresAt });
			console.log('User from DB:', user);

			console.log('Login successful:', user);
			throw redirect(303, '/home');
		} catch (error) {
			console.error('Login error:', error);
			return fail(500, {
				errors: { general: 'Login failed. Please try again.' },
				fields: { username }
			});
		}
	},

	logout: async (event: RequestEvent) => {
		// Pass full event instead of destructuring
		deleteSessionTokenCookie(event);
		throw redirect(303, '/login');
	}
} satisfies Actions;
