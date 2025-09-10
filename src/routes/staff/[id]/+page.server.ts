import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { eq, and } from 'drizzle-orm'
import { staff, userStaffFavorites } from '$lib/server/db/schema'
/* TODO add in type gaurd for staffID */

// Fetches user's favorites entry for the staffer
async function getUserFavoriteEntry(userId: number, staffId: number) {
    try {
        return await db.query.userStaffFavorites.findFirst({
            where: and(
                eq(userStaffFavorites.fkUserId, userId),
                eq(userStaffFavorites.fkStaffId, staffId)
            ),
        })
    } catch (err) {
        console.error('Error fetching user favorites entry:', err)
        return null
    }
}

export const load: PageServerLoad = async ({ params, locals }) => {
    const { id } = params

    // Only allow numeric IDs
    if (!/^\d+$/.test(id)) {
        throw error(400, 'Invalid staff ID format')
    }

    const staffID = parseInt(id, 10)

    // Additional safety check
    if (staffID <= 0) {
        throw error(400, 'Invalid staff ID')
    }

    try {
        // Fetch user list entry if user is authenticated
        let userFavoriteEntry = null

        if (locals.user?.id) {
            userFavoriteEntry = await getUserFavoriteEntry(
                locals.user.id,
                staffID
            )
        }

        const tmpStaffer = await db.query.staff.findFirst({
            where: eq(staff.id, staffID),
            with: {
                jtCartoonsStaff: {
                    with: {
                        cartoon: true,
                        // character: true,
                        language: true,
                    },
                },
                jtCartoonsCharacters: {
                    with: {
                        staff: true,
                        character: true,
                        language: true,
                        cartoon: true,
                    },
                },
            },
        })

        if (tmpStaffer == null) {
            throw error(404, 'staff not found')
        }

        let roles: any[] = []
        tmpStaffer?.jtCartoonsStaff.forEach((role) => {
            roles = roles.concat({
                role: role.role,
                // character: {
                id: role.fkCharacterId,
                // name: role.character?.name,
                // coverPic: role.character?.coverPic,
                // },
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

        let voiceRoles: any[] = []
        tmpStaffer?.jtCartoonsCharacters.forEach((voiceRole) => {
            voiceRoles = voiceRoles.concat({
                character: {
                    id: voiceRole.fkCharacterId,
                    name: voiceRole.character?.name,
                    coverPic: voiceRole.character?.coverPic,
                },
                language: {
                    id: voiceRole.fkLanguageId,
                    name: voiceRole.language?.name,
                },
                cartoon: {
                    id: voiceRole.cartoon?.id,
                    name: voiceRole.cartoon?.name,
                    start: voiceRole.cartoon?.airStart,
                    end: voiceRole.cartoon?.airEnd,
                    coverPic: voiceRole.cartoon?.coverPic,
                },
            })
        })

        const staffer = {
            id: tmpStaffer?.id,
            name: tmpStaffer?.name,
            description: tmpStaffer?.description,
            coverPic: tmpStaffer?.coverPic,
            sex: tmpStaffer?.sex,
            birthday: tmpStaffer?.birthday,
            deathday: tmpStaffer?.deathday,
            links: tmpStaffer?.links,
            roles,
            voiceRoles,
            userFavoriteEntry,
        }

        console.log(staffer)

        return {
            staffer,
        }
    } catch (err) {
        console.error('Error fetching staff:', err)
        throw error(500, 'Failed to load staff')
    }
}
