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
        const tmpStaffer = await db.query.staff.findFirst({
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

        if (!tmpStaffer) {
            throw error(404, 'staff not found');
        }

        let roles: any[] = []
        tmpStaffer?.jtCartoonsStaff.forEach(role => {
            roles = roles.concat(
                {
                    role: role.role,
                    character: {
                        id: role.fkCharacterId,
                        name: role.character?.name,
                        coverPic: role.character?.coverPic,
                    },
                    language: {
                        id: role.fkLanguageId,
                        name: role.language?.name,
                    },
                    cartoon: {
                        id: role.cartoon?.id,
                        name: role.cartoon?.name,
                        start: role.cartoon?.airStart,
                        end: role.cartoon?.airEnd,
                        coverPic: role.cartoon?.coverPic,
                    },
                }
            )
        })

        let staffer = {
            id: tmpStaffer?.id,
            name: tmpStaffer?.name,
            description: tmpStaffer?.description,
            coverPic: tmpStaffer?.coverPic,
            sex: tmpStaffer?.sex,
            birthday: tmpStaffer?.birthday,
            deathday: tmpStaffer?.deathday,
            links: tmpStaffer?.links,
            roles: roles
        }

        console.log(staffer)

        return {
            staffer
        };
    } catch (err) {
        console.error('Error fetching staff:', err);
        throw error(500, 'Failed to load staff');
    }
};
