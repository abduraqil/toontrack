import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
            where: eq(companies.id, cartoonID),
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { companies } from '$lib/server/db/schema';

/*TODO
add in type gaurd for cartoonID
*/

export const load: PageServerLoad = async ({ params }) => {
    const { id } = params;

    // Only allow numeric IDs
    if (!/^\d+$/.test(id)) {
        throw error(400, 'Invalid cartoon ID format');
    }

    const cartoonID = parseInt(id, 10);

    // Additional safety check
    if (cartoonID <= 0) {
        throw error(400, 'Invalid cartoon ID');
    }

    try {
        const cartoon = await db.query.companies.findFirst({
            with: {
                companiestaff: {
                    with: {staff: true}
                }
            }
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
