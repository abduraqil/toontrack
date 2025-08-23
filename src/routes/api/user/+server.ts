// src/routes/api/cartoons/+server.ts
import { json } from '@sveltejs/kit'
import type { RequestEvent } from '@sveltejs/kit'
import { db } from '$lib/server/db'
// import { cartoon } from '$lib/server/db/schema';

export function GET (event: RequestEvent) {
  // Authentication check
  if (event.locals.user === null) {
    return new Response(null, {
      status: 401,
      statusText: 'Unauthorized'
    })
  }

  // Successfully authenticated
  return json({
    success: true,
    message: 'Authenticated endpoint working'
  })
}
