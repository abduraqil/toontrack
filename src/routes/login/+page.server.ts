import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
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

export const load: PageServerLoad = async (event) => {
    const token = event.cookies.get("session_token");
    
    if (!token) {
        throw redirect(302, '/login');
    }

    const validationResult = await validateSessionToken(token);
    
    if (!validationResult.session || !validationResult.user) {
        deleteSessionTokenCookie(event);  // Pass full event
        throw redirect(302, '/login');
    }

    setSessionTokenCookie(event, token, validationResult.session.expiresAt);
    
    return {
        user: validationResult.user
    };
};

export const actions: Actions = {
    login: async (event) => {
        const formData = await event.request.formData();
        const username = formData.get('username')?.toString();
        const password = formData.get('password')?.toString();

        if (!username || !password) {
            return fail(400, {
                errors: { general: 'Username and password are required' },
                fields: { username }
            });
        }

        try {
            const user = await db.query.users.findFirst({
                where: eq(users.username, username),
                columns: { id: true, username: true, pwd: true }
            });

            if (!user) {
                return fail(400, {
                    errors: { username: 'Invalid username' },
                    fields: { username }
                });
            }

            const isPasswordValid = await argon2.verify(user.pwd, password);
            if (!isPasswordValid) {
                return fail(400, {
                    errors: { password: 'Invalid password' },
                    fields: { username }
                });
            }

            const token = generateSessionToken();
            const { expiresAt } = await createSession(token, user.id);
            
            // Pass full event to cookie functions
            setSessionTokenCookie(event, token, expiresAt);

            throw redirect(303, '/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            return fail(500, {
                errors: { general: 'Login failed. Please try again.' },
                fields: { username }
            });
        }
    },

    logout: async (event) => {
        // Pass full event instead of destructuring
        deleteSessionTokenCookie(event);
        throw redirect(303, '/login');
    }
} satisfies Actions;