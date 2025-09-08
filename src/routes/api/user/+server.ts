import { json } from '@sveltejs/kit'
import type { RequestEvent } from '@sveltejs/kit'

export function GET(event: RequestEvent) {
    // Authentication check
    if (event.locals.user === null) {
        return new Response(null, {
            status: 401,
            statusText: 'Unauthorized',
        })
    }

    // Successfully authenticated
    return json({
        success: true,
        message: 'Authenticated endpoint working',
    })
}
