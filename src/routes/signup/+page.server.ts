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
        

        // store in the database



    }
}