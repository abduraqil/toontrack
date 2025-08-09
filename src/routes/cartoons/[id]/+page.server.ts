import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { and, eq } from 'drizzle-orm';
import { cartoons, userLists } from '$lib/server/db/schema';
import { page } from '$app/state';
import '$lib/server/db/relations';
import { userListsRelations } from '$lib/server/db/relations';

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

    const user = $derived(page.data.user);

    // Additional safety check
    if (cartoonID <= 0) {
        throw error(400, 'Invalid cartoon ID');
    }

    try {

        let userListEntry = null;
        let isFavorited = false;

        if (user) {
            userListEntry = await db.query.userLists.findFirst({
                where: and(
                    eq(userLists.fkUserId, user.id),
                    eq(userLists.fkCartoonId, cartoonID)
                )
            })
        }

        if (userListEntry.favorite) {}

        const tmpCartoon = await db.query.cartoons.findFirst({
            where: eq(cartoons.id, cartoonID),
            with: {
                jtCartoonsCartoonTypes: {
                    with: {
                        cartoonType: true
                    }
                },
                jtCartoonsLanguages: {
                    with: {
                        language: true,
                    }
                },
                jtCartoonsCountries: {
                    with: {
                        country: true
                    }
                },
                jtCartoonsCompanies: {
                    with: {
                        company: true
                    }
                },
                jtCartoonsStaff: {
                    with: {
                        staff: true, // not sure if this includes all cols from staff
                        character: true,
                        language: true
                    }
                },
                jtCartoonsTags: {
                    with: {
                        tag: true,
                    }
                },
                cartoonStats: {
                    with: {
                        cartoon: true,
                    }
                },
                reviews: {
                    with: {
                        user: true,
                    }
                },
                userLists: {
                    with: {
                        user: true,
                        cartoon: true
                    }
                }
            }
        });

        if (!tmpCartoon) {
            throw error(404, 'cartoon not found');
        }

    let cartoonTypes: any[] = []
    tmpCartoon?.jtCartoonsCartoonTypes.forEach(type => {
        cartoonTypes = cartoonTypes.concat({
            id: type.fkCartoonTypeId,
            name: type.cartoonType.name,
            score: type.score,
        })
    })

    let cartoonLanguages: any[] = []
    tmpCartoon?.jtCartoonsLanguages.forEach(tag => {
        cartoonLanguages = cartoonLanguages.concat({
            id: tag.fkLanguageId,
            name: tag.language.name,
            iso639: tag.language.iso639,
            score: tag.score,
        })
    })

    let cartoonCountries: any[] = []
    tmpCartoon?.jtCartoonsCountries.forEach(tag => {
        cartoonCountries = cartoonCountries.concat({
            id: tag.fkCountryId,
            name: tag.country.name,
            iso316613: tag.country.iso316613,
        })
    })

    let cartoonCompanies: any[] = []
    tmpCartoon?.jtCartoonsCompanies.forEach(company => {
        cartoonCompanies = cartoonCompanies.concat({
            role: company.role,
            credited: company.credited,
            id: company.fkCompanyId,
            name: company.company.name,
            coverPic: company.company.coverPic,
        })
    })

    let cartoonStaff : any[] = []
    tmpCartoon?.jtCartoonsStaff.forEach(role => {
        cartoonStaff = cartoonStaff.concat({
            role: role.role,
            credited: role.credited,
            staff: {
                id: role.fkStaffId,
                name: role.staff?.name,
                coverPic: role.staff?.coverPic,
            },
            language: {
                id: role.fkLanguageId,
                name: role.language?.name,
            },
            character: {
                id: role.fkCharacterId,
                name: role.character?.name,
                coverPic: role.character?.coverPic,
            },
        })
    })

    let cartoonTags: any[] = []
    tmpCartoon?.jtCartoonsTags.forEach(tag => {
        cartoonTags = cartoonTags.concat({
            id: tag.fkTagId,
            name: tag.tag.name,
            score: tag.score,
            spoiler: tag.spoiler,
        })
    })

    const cartoon = {
        id: tmpCartoon.id,
        name: tmpCartoon.name,
        description: tmpCartoon.description,
        coverPic: tmpCartoon.coverPic,
        seasons: tmpCartoon.seasons,
        episodes: tmpCartoon.episodes,
        duration: tmpCartoon.duration,
        status: tmpCartoon.status,
        airStart: tmpCartoon.airStart,
        airEnd: tmpCartoon.airEnd,
        source: tmpCartoon.source,
        ageRating: tmpCartoon.ageRating,
        links: tmpCartoon.links,
        types: cartoonTypes,
        languages: cartoonLanguages,
        countries: cartoonCountries,
        companies: cartoonCompanies,
        staff: cartoonStaff,
        tags: cartoonTags,
        reviews: tmpCartoon.reviews,
        stats: tmpCartoon.cartoonStats,
        list: userListEntry, // changed from userLists to userListEntry
        isFavorited: !userListEntry?.favorite, // set based on userListEntry
    };

    console.log( "cartoon", cartoon)
    // console.log( "filter", cartoon.staff.filter(x => x.role == 4))

        return {
            cartoon,
        };
    } catch (err) {
        console.error('Error fetching cartoon:', err);
        throw error(500, 'Failed to load cartoon');
    }

};
