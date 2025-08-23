import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { characters } from '$lib/server/db/schema';
import '$lib/server/db/relations';

/*TODO
add in type guard for characterID
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
    const tmpCharacter = await db.query.characters.findFirst({
        where: eq(characters.id, characterID),
        with: {
                staff: true,
                jtCartoonsCharacters: {
                    with: {
                        cartoon: true,
                        staff: true,
                        language: true
                    }
                }
        },
    });

    if (!tmpCharacter) {
        throw error(404, 'character not found');
    }

    let roles: any[] = []
    tmpCharacter?.jtCartoonsCharacters.forEach(role => {
        roles = roles.concat({
            staff: {
                id: role.fkStaffId,
                name: role.staff?.name,
                coverPic: role.staff?.coverPic,
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
        })
    })


    let character = {
        id: tmpCharacter.id,
        name: tmpCharacter.name,
        description: tmpCharacter.description,
        coverPic: tmpCharacter.coverPic,
        fkOriginalCreator: tmpCharacter.fkOriginalCreator,
        originalCreator: tmpCharacter.staff?.name,
        sex: tmpCharacter.sex,
        birthday: tmpCharacter.birthday,
        inception: tmpCharacter.inception,
        roles: roles,
    }
    console.log(character.roles)

        return {
            character
        };
    } catch (err) {
        console.error('Error fetching character:', err);
        throw error(500, 'Failed to load character');
    }
};
