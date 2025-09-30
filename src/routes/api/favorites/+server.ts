import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import {
    userCartoonFavorites,
    userStaffFavorites,
    userCompanyFavorites,
    userCharacterFavorites,
} from '$lib/server/db/schema'
import { eq, and } from 'drizzle-orm'

async function getTable(itemType: string | undefined, itemId: number) {
    let tbl
    let tblCol
    let entry = {}
    switch (itemType) {
        case 'cartoons':
            tbl = userCartoonFavorites
            tblCol = tbl.fkCartoonId
            entry = { fkCartoonId: itemId }
            break
        case 'staff':
            tbl = userStaffFavorites
            tblCol = tbl.fkStaffId
            entry = { fkStaffId: itemId }
            break
        case 'companies':
            tbl = userCompanyFavorites
            tblCol = tbl.fkCompanyId
            entry = { fkCompanyId: itemId }
            break
        // case 'users':
        //     tbl = userUserFavorites
        //     tblItem = tbl.fkUserId
        //     entry = {fkUserId: itemId}
        //     break
        case 'characters':
            tbl = userCharacterFavorites
            tblCol = tbl.fkCharacterId
            entry = { fkCharacterId: itemId }
            break
        default:
            return json(
                { error: 'Favoriting: must give type' },
                { status: 400 }
            )
    }
    return { tbl, tblCol, entry }
}

export const POST: RequestHandler = async ({ request, locals }) => {
    // take session id if it exists then user is logged in
    if (!locals.user) {
        return json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { itemId, itemType, favorite } = await request.json()

    // TODO: create other tables to allow favoriting of companies, staff, characters
    // if (itemType != 'cartoons')
    //     return json({ error: 'Favoriting is for cartoons only at this time' }, { status: 501 })

    const userId = locals.user.id

    try {
        console.log('Favorites API Recieved: ', {
            favorite,
            userId: locals.user.id,
        })

        const { tbl, tblCol, entry } = await getTable(itemType, itemId)

        entry.fkUserId = userId
        entry.favorite = favorite

        console.log({ tbl, tblCol, entry })

        // modify db
        await db
            .insert(tbl)
            .values(entry)
            .onConflictDoUpdate({
                target: [tbl.fkUserId, tblCol],
                set: {
                    favorite: favorite,
                },
            })

        return json({ success: true })
    } catch (error) {
        console.error('Favorite toggle error:', error)
        return json({ error: 'Failed to toggle favorite' }, { status: 500 })
    }
}

export const DELETE: RequestHandler = async ({ locals, url }) => {
    // validate user
    if (!locals?.session) {
        console.log('unauthorized')
        error(401, 'unauthorized')
    }

    interface uCFDelete {
        fkUserId: number
        itemId: number
        itemType?: string
    }

    const e: uCFDelete = {
        fkUserId: locals.session.fkUserId,
        itemId: parseInt(url.searchParams.get('itemId')!),
        itemType: url.searchParams.get('itemType')?.toString(),
    }
    console.log('server received delete request', e)

    // validate input
    if (isNaN(e.itemId) || !e.fkUserId || !e.itemType) {
        console.log('incomplete request')
        error(400, 'Incomplete request')
    }

    const { tbl, tblCol } = await getTable(e.itemType, e.itemId)

    // modify db
    await db
        .delete(tbl)
        .where(and(eq(tbl.fkUserId, e.fkUserId), eq(tblCol, e.itemId)))
    console.log(`user ${e.fkUserId}: favorite delete request successful`)

    return json('ok')
}
