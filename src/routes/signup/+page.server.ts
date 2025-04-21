import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { user } from '$lib/server/db/schema';



export const actions: Actions = {
    default: async ({ request, cookies, locals }) => {
        // parse the form data
        const formData = await request.formData();
        const username = formData.get('username')?.toString().trim();
        const password = formData.get('password')?.toString();

        // validae inputs
        if (!username || !password) {
            return fail(400, { message: 'Username and password are required' });
        }

        if (!password || password.length <8) {
            return fail(400, {
                error: {password: "{password} must be at least 8 characters long"},
                fields: {password: password},
            });
        }

        // check if the user already exists
        try {
            const existingUser = await db.query.user.findFirst({
                where: eq(user.username, username)
            }); 

            if (existingUser) {
                return fail(400, {message: 'Username already exists'});
            }

        } catch (error) {
            console.error('Error checking for existing user:', error);
            return fail(500, { message: 'Internal server error' });
        }


        // hash password (will do this late wth bcrypt)

        // create the user
        try {
            await db.insert(user).values({
                username: username,
                password: password
            });
        } catch (error) {
            console.error('Error creating user:', error);
            return fail(500, { message: 'Internal server error' });
        }

        // set the session cookie (will do this later with JWT)

        // redirect to the login page
        throw redirect(303, '/login');

        // return success response
        return {sucess: true};
    }
} satisfies Actions;