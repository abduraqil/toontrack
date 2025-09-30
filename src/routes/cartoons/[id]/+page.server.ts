import type { Actions } from './$types'
import { redirect } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { and, eq } from 'drizzle-orm'
import { reviews } from '$lib/server/db/schema'
import '$lib/server/db/relations'
import { fail } from '@sveltejs/kit'

export interface ActionData {
    message?: string
    errors?: {
        general?: string
        review?: string
        score?: string
    }
    fields?: {
        review?: string
        score?: string
        fkCartoonId?: number
        token?: string //unhashed
    }
}
export const actions = {
    postReview: async ({ request, locals }) => {
        const formData = await request.formData()
        const review = formData.get('review')?.toString()
        const score = parseInt(formData.get('score')?.toString()!)
        const fkCartoonId = parseInt(formData.get('fkCartoonId')?.toString()!)
        console.log('Review post attempt:', {
            review,
            score,
            fkCartoonId,
        })
        if (!score || !review) {
            console.log('fail')
            return fail(400, {
                errors: { review: 'review and score required' },
                fields: { review, score },
            })
        }
        if (!fkCartoonId) {
            console.log('fail')
            return fail(400, {
                errors: { review: 'invalid cartoon id' },
                fields: { review, score },
            })
        }
        if (typeof score !== 'number' && score >= 0 && score <= 10) {
            console.log('fail')
            return fail(400, {
                errors: { score: 'score must be a number between 0 and 10' },
                fields: { review, score },
            })
        }
        if (review.length < 1000 || review.length > 5000) {
            // if (review.length < 10 || review.length > 5000) {// TODO: this line is for testing only
            console.log('fail')
            return fail(400, {
                errors: {
                    review: 'review must be between 1000 & 5000 characters',
                },
                fields: { review, score },
            })
        }

        try {
            console.log('Review post attempt:', { fkCartoonId, score, review })

            if (!locals.session?.fkUserId) {
                console.log('Unauthorized user attempted posting review')
                return fail(401, {
                    errors: { general: 'Invalid user, are you signed in?' },
                })
            }
            const fkUserId = locals.session.fkUserId

            // insert review if user passes authentication
            console.log('Review post attempt:', { fkUserId })
            await db
                .insert(reviews)
                .values({
                    review: review,
                    score: score,
                    fkUserId: fkUserId,
                    fkCartoonId: fkCartoonId,
                })
                .onConflictDoUpdate({
                    target: [reviews.fkUserId, reviews.fkCartoonId],
                    set: {
                        review: review,
                        score: score,
                    },
                })

            console.log('Review post successful:', { fkUserId, score })
        } catch (error) {
            console.error('Review post error:', error)
            return fail(500, {
                errors: { general: 'Error. Please try again.' },
                fields: { review, score },
            })
        }
        redirect(303, '/cartoons/'.concat(fkCartoonId.toString()))
    },

    deleteReview: async ({ request, locals }) => {
        const formData = await request.formData()
        const fkCartoonId = parseInt(formData.get('fkCartoonId')?.toString()!)
        if (!locals.session?.fkUserId) {
            console.log('Unauthorized user attempted deleting review')
            return fail(401, {
                errors: { general: 'Invalid user, are you signed in?' },
            })
        }
        const fkUserId = locals.session.fkUserId
        try {
            console.log('Review deletion attempt:', { fkUserId })
            await db
                .delete(reviews)
                .where(
                    and(
                        eq(reviews.fkUserId, fkUserId),
                        eq(reviews.fkCartoonId, fkCartoonId)
                    )
                )
            console.log('Review deletion successful:', {
                fkUserId,
                fkCartoonId,
            })
            return
            // redirect(303, '/cartoons/'.concat(fkCartoonId.toString()))
        } catch (error) {
            console.error('Review post error:', error)
            return fail(500, {
                errors: { general: 'Error. Please try again.' },
            })
        }
    },
} satisfies Actions
