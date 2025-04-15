import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';



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

        // create the user
        const userID = generateID


    }
}