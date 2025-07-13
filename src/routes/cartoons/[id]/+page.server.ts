import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { cartoons } from '$lib/server/db/schema';
import '$lib/server/db/relations';

/*TODO
add in type gaurd for characterID
*/

export const load: PageServerLoad = async ({ params }) => {
    const { id } = params;

    // Only allow numeric IDs
    if (!/^\d+$/.test(id)) {
        throw error(400, 'Invalid character ID format');
    }

    const characterID = parseInt(id, 10);

    // Additional safety check
    if (characterID <= 0) {
        throw error(400, 'Invalid character ID');
    }

    try {
        const character = await db.query.characters.findFirst({
            where: eq(characters.id, characterID),
            with: {
                jtcartoonsStaff: {
                    with: {
                        staff: true,
                    }
                },
                jtCartoonsCountries: {
                    with: {
                        country: true
                    }
                },
                jtCartoonsCartoonTypes: {
                    with: {
                        cartoonType: true
                    }
                }
            }
        });

        if (!character) {
            throw error(404, 'character not found');
        }

        return {
            cartoon
        };
    } catch (err) {
        console.error('Error fetching character:', err);
        throw error(500, 'Failed to load character');
    }

    
};
