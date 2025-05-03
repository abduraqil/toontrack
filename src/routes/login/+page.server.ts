import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { users } from '$lib/server/db/schema';
import argon2, { argon2id } from 'argon2';

export interface ActionData {
    message?: string;
    errors?: Record<string, string>;
    fields?: { username?: string };
}

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData();
        const username = formData.get('username')?.toString();
        const password = formData.get('password')?.toString();

        if (!username || !password) {
            return fail(400, { message: 'Username and password are required' });

        }

        try {
            const user = await db.query.users.findFirst({
                where: eq(users.username, username),
            });

        if (!user) {
            return fail(400, { message: 'Invalid username or password' });
        }


        const isPasswordValid = await argon2.verify(user.pwd, password);
        if (!isPasswordValid) {
            return fail(400, { message: 'Invalid username or password' });
        }


        } catch (error) {
            return fail(500, { message: 'Login failed. Please try again.' });
        }
    }

} satisfies Actions; 
