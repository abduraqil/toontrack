import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { characters } from '$lib/server/db/schema';

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
                characterStaff: {
                    with: {staff: true}
                }
            }
        });

        if (!character) {
            throw error(404, 'character not found');
        }

        return {
            character,
        };
    } catch (err) {
        console.error('Error fetching character:', err);
        throw error(500, 'Failed to load character');
    }
};
