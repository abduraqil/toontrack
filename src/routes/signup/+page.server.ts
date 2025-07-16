import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { users } from '$lib/server/db/schema';
import argon2 from 'argon2';
import { PASSWORD, USERNAME } from '$lib/constants/auth';

/* TODO:
JWT session cookie
users are case sensitive? fix or dont?
*/

export interface ActionData {
    message?: string;
    errors?: Record<string, string>;
    fields?: { username?: string };
}

export const actions: Actions = {
    default: async ({ request, cookies, locals }) => {
        // parse the form data
        const formData = await request.formData();
        const username = formData.get('username')?.toString().trim();
        // const email = formData.get('email')?.toString();
        const password = formData.get('password')?.toString();
        const password2 = formData.get('password2')?.toString();
        console.log(username);
        // console.log(email);
        console.log(password);
        console.log(password2);

        // validate inputs
        if (!username || !password) {
            return fail(400, { message: 'Username, password, and E-mail are required' });
        }

        //validate username
        if (username.length < USERNAME.MIN_LENGTH || 
            username.length > USERNAME.MAX_LENGTH) {
            return fail(400, {
                error: `Username must be between ${USERNAME.MIN_LENGTH}-${USERNAME.MAX_LENGTH} characters`,
            });
        }

        // validate password
        if (password.length < PASSWORD.MIN_LENGTH || 
            password.length > PASSWORD.MAX_LENGTH) {
            return fail(400, {
                error: `Password must be between ${PASSWORD.MIN_LENGTH}-${PASSWORD.MAX_LENGTH} characters`,
            });
        }

        // password match
        if (password != password2) {
            return fail(400, {
                error: {password: "passwords do not match"},
                fields: {password: password, password2: password2},
            });
        }

        // check if the user already exists
        try {
            const existingUser = await db.query.users.findFirst({
                where: eq(users.name, username)
            }); 

            if (existingUser) {
                return fail(400, {message: 'Username already exists'});
            }

        } catch (error) {
            console.error('Error checking for existing user:', error);
            return fail(500, { message: 'Internal server error' });
        }

        // hash password
        const hashedPassword = await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 2 ** 18,
            timeCost: 12,
            hashLength: 149,
            secret: Buffer.from('mysecret'),
        });
        
        // create the user
        try {
            let a = await db.insert(users).values({
                name: username,
                // email: email,
                pwd: hashedPassword,
                //need to also add "created" timestamp
            }).returning({ insertedId: users.id });;
            console.error(a);
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
