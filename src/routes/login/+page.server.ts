import { fail, redirect } from '@sveltejs/kit'
import type { Actions, RequestEvent, PageServerLoad } from './$types'
import { db } from '$lib/server/db'
import { eq } from 'drizzle-orm'
import { users } from '$lib/server/db/schema'
import argon2 from 'argon2'
import { SECRET, SESSION_COOKIE_NAME } from '$lib/constants/auth'
import {
    validateSessionToken,
    setSessionTokenCookie,
    deleteSessionTokenCookie,
    generateSessionToken,
    createSession,
} from '$lib/server/auth/session'

export interface ActionData {
    message?: string
    errors?: {
        general?: string
        username?: string
        password?: string
    }
    fields?: {
        username?: string
    }
}

const POST_LOGIN_REDIRECT = '/home'

export const load: PageServerLoad = async ({ cookies }) => {
    if (cookies.get(SESSION_COOKIE_NAME)) {
        console.log(
            `user is already logged in with cookie ${cookies.get(SESSION_COOKIE_NAME)}, redirecting...`
        )
        throw redirect(303, POST_LOGIN_REDIRECT)
    }
}

export const actions = {
    login: async (event: RequestEvent) => {
        const formData = await event.request.formData()
        const username = formData.get('username')?.toString()
        const password = formData.get('password')?.toString()

        if (!username || !password) {
            return fail(400, {
                errors: { general: 'Username and password are required' },
                fields: { username },
            })
        }

        try {
            console.log('Login attempt:', { username, password })
            const user = (
                await db
                    .select()
                    .from(users)
                    .where(eq(users.name, username))
                    .limit(1)
            )[0]

            if (!user) {
                console.log(`User query failed to find user: ${username}`)
                return fail(400, {
                    errors: { username: 'Invalid username' },
                    fields: { username },
                })
            }

            const isPasswordValid = await argon2.verify(user.pwd, password, {
                secret: Buffer.from(SECRET),
            })
            if (!isPasswordValid) {
                console.log('Password verification failed')
                return fail(400, {
                    errors: { password: 'Invalid password' },
                    fields: { username },
                })
            }

            const token = generateSessionToken()
            const { expiresAt } = await createSession(token, user.id)

            // Convert expiresAt to Date if it's a string
            const expiresDate =
                typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt

            // Pass full event to cookie functions
            setSessionTokenCookie(event, token, expiresDate)

            console.log(
                'Session creation result:',
                { token, expiresAt },
                `Login successful for: ${username}`,
                `Password verification passed: ${isPasswordValid}`
            )
        } catch (error) {
            console.error('Login error:', error)
            return fail(500, {
                errors: { general: 'Login failed. Please try again.' },
                fields: { username },
            })
        }

        throw redirect(303, POST_LOGIN_REDIRECT)
    },

    logout: async (event: RequestEvent) => {
        // Pass full event instead of destructuring
        deleteSessionTokenCookie(event)
        throw redirect(303, '/login')
    },
} satisfies Actions
