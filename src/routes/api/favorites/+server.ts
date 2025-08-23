import { json } from '@sveltejs/kit'
import type { RequestHandler } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { userLists } from '$lib/server/db/schema'
import { eq, and } from 'drizzle-orm'

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 })
  }

  /* TODO
	At the current moment, this only favorites cartoons,
	So we'll have to add checks to favorite other types of content
	like characters, staff members, companies, etc.
	*/

  const { cartoonId, favorite } = await request.json()
  const userId = locals.user.id

  try {
    const currentEntry = await db.query.userLists.findFirst({
      where: and(
        eq(userLists.fkUserId, userId),
        eq(userLists.fkCartoonId, cartoonId)
      )
    })

    console.log('API Recieved: ', { favorite, userId: locals.user.id })
    if (currentEntry != null) {
      await db.update(userLists)
        .set({
          favorite: favorite ? 1 : 0,
          edited: new Date()
        })
    } else {
      await db.insert(userLists).values({
        fkUserId: userId,
        fkCartoonId: cartoonId,
        status: 0,
        favorite: favorite ? 1 : 0,
        created: new Date(),
        edited: new Date()
      })
    }

    return json({ success: true })
  } catch (error) {
    console.error('Favorite toggle error:', error)
    return json({ error: 'Failed to toggle favorite' }, { status: 500 })
  }
}
