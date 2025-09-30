import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import { eq, asc, sql, and } from 'drizzle-orm'
import { db } from '$lib/server/db'
import {
    friends,
    userCartoonFavorites,
    userCartoonHistory,
    userCharacterFavorites,
    userCompanyFavorites,
    users,
    userStaffFavorites,
} from '$lib/server/db/schema'

// Validate user ID parameter
// TODO: export this function for use in other pages
function validateId(id: string): number {
    if (!/^\d+$/.test(id)) {
        throw error(400, 'Invalid user ID format')
    }

    const vid = parseInt(id, 10)

    if (vid <= 0) {
        throw error(400, 'Invalid user ID')
    }

    return vid
}

// TODO: Fetches user's friend entry for this user page
// async function getUserFriendEntry(userId: number, cartoonId: number) {
//     try {
//         return await db.query.userCartoonFavorites.findFirst({
//             where: and(
//                 eq(userCartoonFavorites.fkUserId, userId),
//                 eq(userCartoonFavorites.fkCartoonId, cartoonId)
//             ),
//         })
//     } catch (err) {
//         console.error('Error fetching user favorites entry:', err)
//         return nullel
//     }
// }

// Main load function
export const load: PageServerLoad = async ({ params, locals }) => {
    const { id } = params

    // Validate inputform
    const userID = validateId(id)

    try {
        // Fetch user list entry if user is authenticated
        let userFriends = false

        if (locals.user?.id) {
            // userFriendEntry = await getUserFriendEntry(locals.user.id, userID) // TODO
            if (locals.user?.id == userID) {
                console.log(
                    `user ${locals.user.name} (${userID}) is looking at his own page`
                )
            }
            userFriends =
                (
                    await db
                        .select()
                        .from(friends)
                        .where(
                            and(
                                eq(friends.fkUser1, locals.user?.id),
                                eq(friends.fkUser2, userID)
                            )
                        )
                ).length > 0
        }

        // Fetch cartoon data
        const userPageQuery = db.query.users
            .findFirst({
                // where: eq(users.id, userID),
                where: eq(users.id, sql.placeholder('id')),
                columns: {
                    edited: false,
                    pwd: false,
                },
                with: {
                    userCartoonHistory: {
                        columns: {
                            created: false,
                            // edited: false,
                            fkUserId: false,
                            notes: false,
                        },
                        orderBy: [asc(userCartoonHistory.startDate)],
                        with: {
                            cartoon: {
                                columns: {
                                    created: false,
                                    edited: false,
                                    id: false,
                                    description: false,
                                    // duration: false,
                                    seasons: false,
                                    links: false,
                                },
                            },
                        },
                    },
                    userCartoonFavorites: {
                        columns: {
                            created: false,
                            edited: false,
                            fkUserId: false,
                        },
                        orderBy: [asc(userCartoonFavorites.favorite)],
                        with: {
                            cartoon: {
                                columns: {
                                    name: true,
                                    coverPic: true,
                                },
                            },
                        },
                    },
                    userStaffFavorites: {
                        columns: {
                            created: false,
                            edited: false,
                            fkUserId: false,
                        },
                        orderBy: [asc(userStaffFavorites.favorite)],
                        with: {
                            staff: {
                                columns: {
                                    name: true,
                                    coverPic: true,
                                },
                            },
                        },
                    },
                    userCharacterFavorites: {
                        columns: {
                            created: false,
                            edited: false,
                            fkUserId: false,
                        },
                        orderBy: [asc(userCharacterFavorites.favorite)],
                        with: {
                            character: {
                                columns: {
                                    name: true,
                                    coverPic: true,
                                },
                            },
                        },
                    },
                    userCompanyFavorites: {
                        columns: {
                            created: false,
                            edited: false,
                            fkUserId: false,
                        },
                        orderBy: [asc(userCompanyFavorites.favorite)],
                        with: {
                            company: {
                                columns: {
                                    name: true,
                                    coverPic: true,
                                },
                            },
                        },
                    },
                    reviews: {
                        columns: {
                            created: false,
                            edited: false,
                            fkUserId: false,
                        },
                    },
                },
            })
            .prepare('user_page')

        const userPage = await userPageQuery.execute({ id: userID })

        if (userPage == null) {
            throw error(404, 'User not found')
        }

        return { userPage, userFriends }
    } catch (err) {
        // Re-throw SvelteKit errors
        if (err && typeof err === 'object' && 'status' in err) {
            throw err
        }

        console.error('Error fetching user:', err)
        throw error(500, 'Failed to load user')
    }
}
