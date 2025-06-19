import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { cartoons } from '$lib/server/db/schema';
import { parse } from 'path';

/*TODO
add in type gaurd for cartoonID
*/

export const load: PageServerLoad = async ({ params }) => {
    const { id } = params;

    const cartoonID = parseInt(id, 10); 

    try {
        const cartoon = await db.query.cartoons.findFirst({
            where: eq(cartoons.id, cartoonID)
        });

        if (!cartoon) {
            throw error(404, 'Cartoon not found');
        }

        return {
            cartoon,
        };
    } catch (err) {
        console.error('Error fetching cartoon:', err);
        throw error(500, 'Failed to load cartoon');
    }
};