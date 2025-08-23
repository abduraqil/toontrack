// // src/routes/api/cartoons/+server.ts
// import { json } from '@sveltejs/kit';
// import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
// import { db } from '$lib/server/db';
// // import { cartoon } from '$lib/server/db/schema';
//
// // export function GET: RequestHandler = ({ url }) => {
// export function GET(event: RequestEvent) {
//     url = event.url;
//     let tmp_c: number = parseInt(url.searchParams.get("count"));
//     let tmp_p: number = parseInt(url.searchParams.get("page"));
//     let tmp_t: number = parseInt(url.searchParams.get("tags")).split(seperator);
//
//     // pull from database
//     const name = url.searchParams.get("name");
//     if (name == '' || name == undefined || name == null)
//         url.searchParams.delete("name");
//
//     const seperator = ',';
//     // const seperator = '%2C';
//     // const seperator = '%3B';
//
//     // count that number of queries per page to 100
//     const numResults: number = tmp_l < 101 && tmp_l > 0 ? tmp_l : 10
//     const currentPage: number = tmp_p >= 1 ? tmp_p : 1
//
//     if (currentPage == 1 || currentPage == undefined || currentPage == null)
//         url.searchParams.delete("page");
//
//     if (numResults == 10 || numResults == undefined || numResults == null)
//         url.searchParams.delete("count");
//
//     const query = await db.select().from(tbl).where(ilike(tbl.name, "%" + name + "%")).limit(numResults).offset(numResults * (currentPage - 1));
//     const totalResults: number = (await db.select({ count: count() }).from(tbl).where(ilike(tbl.name, "%" + name + "%")))[0].count;
//     const totalPages: number = Math.ceil(totalResults / numResults);
//
//     // if (event.locals.user === null) {
//     //     return new Response(null, {
//     //         status: 401,
//     //         statusText: 'Unauthorized'
//     //     });
//     // }
//
//     // return { url, searchQuery };
//     return json({
//         name: name,
//         count: numResults,
//         page: currentPage,
//         query: query,
//     });
// }
