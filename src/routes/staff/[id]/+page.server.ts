import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { staff } from '$lib/server/db/schema';
import '$lib/server/db/schema';

/*TODO
add in type gaurd for staffID
*/

export const load: PageServerLoad = async ({ params }) => {
    const { id } = params;

    // Only allow numeric IDs
    if (!/^\d+$/.test(id)) {
        throw error(400, 'Invalid staff ID format');
    }

    const staffID = parseInt(id, 10);

    // Additional safety check
    if (staffID <= 0) {
        throw error(400, 'Invalid staff ID');
    }

    try {
        const staffMember = await db.query.staff.findFirst({
            where: eq(staff.id, staffID),
            with: {
                jtCartoonsStaff: {
                    with: {
                        cartoon: true,
                        character: true,
                        language: true
                    }
                }
            }
        });
    staffMember?.jtCartoonsStaff.forEach(role => {
     role: role.role
     character: {
         id: role.fkCharacterId
         name: role.character?.name
     }
     language: {
         id: role.fkLanguageId
         name: role.language?.name
     }
     cartoon: {
         id: role.cartoon?.id
         name: role.cartoon?.name
         start: role.cartoon?.airStart
         end: role.cartoon?.airEnd
     }
    })
    console.log(staffMember?.jtCartoonsStaff[0].cartoon)

        if (!staffMember) {
            throw error(404, 'staff not found');
        }

        return {
            staffMember,
        };
    } catch (err) {
        console.error('Error fetching staff:', err);
        throw error(500, 'Failed to load staff');
    }
};
