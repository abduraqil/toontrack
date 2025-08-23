import type { Actions, PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { eq, ilike, asc, desc, and, lte, gte, getTableColumns } from 'drizzle-orm'
import {
  users,
  cartoons, jtCartoonsLanguages, jtCartoonsCartoonTypes,
  companies, jtCompaniesCompanyTags, companyTags,
  characters,
  staff, jtLanguagesStaff, jtOccupationsStaff, occupations,
  languages,
  cartoonTypes
} from '$lib/server/db/schema'
import '$lib/server/db/relations'
import { goto, replaceState } from '$app/navigation'
// import type { URL } from 'url';
// import '$lib/';

/* TODO
add in type gaurd for cartoonID
    */

/*
   name: search query
   slug: table to look through
   numResults: results per page
   currentPage: offset results
   */
const CURRENTDATE = new Date()
const CURRENTYEAR = CURRENTDATE.getFullYear()

interface queryParameters {
  slug: string
  name?: string | null
  year?: number
  yearMax?: number
  language?: string
  format?: string // "type" in the form
  status?: number // 0 | 1 | 2 | 3 | 4 | 5;
  sort?: string | null // | "name" | "release" | "date_added" | "score" | "favorites";
  ascending?: boolean

  episodes1?: number
  episodes2?: number
  duration1?: number
  duration2?: number
  seasons1?: number
  seasons2?: number

  tags?: string[]
  count?: number // number per page numResults
  page?: number // currentPage

  totalPages?: number
  totalResults?: number
}
// count, page, slug, name, sort, ascending, year, yearMax)

async function resolveQuery (
  numResults: number, currentPage: number, slug: string, name?: string | null,
  sort?: string | null, // | "name" | "release" | "date_added" | "score" | "favorites",
  ascending?: boolean, year?: number, yearMax?: number,
  format?: number, status?: number, language?: number
) {
  /* variables used and their default values */
  let query
  let q
  let tbl // main search table
  let ljtbl // languages junction table
  let tjtbl
  let ttbl // type/occupation junction table & origin table
  let formatsOrOccupations
  let allLangauges = null
  let q_y1; let q_y2; let q_s; let q_l; let q_t; let q_n // query parameters

  ttbl = cartoonTypes
  /* get table */
  switch (slug) {
    case 'cartoons':
      /* year */
      q = db.query.cartoons
      tbl = cartoons
      ljtbl = jtCartoonsLanguages
      tjtbl = jtCartoonsCartoonTypes
      ttbl = cartoonTypes
      q_y1 = (year && year > 1908) ? gte(tbl.airStart, new Date(year, 0, 1)) : undefined
      q_y2 = (yearMax && yearMax < CURRENTYEAR) ? lte(tbl.airStart, new Date(yearMax + 1, 0, 0)) : undefined // last day of the year

      /* status */
      q_s = (status === 0 || status === null || status === undefined) ? undefined : eq(tbl.status, status)
      break
    case 'staff':
      // TODO: ignore language if type is not VOICE ACTOR & remove that part from the query url
      tbl = staff
      ljtbl = jtLanguagesStaff
      ttbl = occupations
      tjtbl = jtOccupationsStaff
      q = db.query.staff
      break
    case 'companies':
      tbl = companies
      ttbl = companyTags
      tjtbl = jtCompaniesCompanyTags
      q = db.query.companies; break
    case 'users':
      tbl = users
      q = db.query.users; break
    case 'characters':
      tbl = characters
      q = db.query.characters; break
    case '':
      tbl = cartoons
      q = db.query.cartoons; break
    default: throw error(400, 'no slug')
  }

  /* BUILDING SQL QUERY FROM URL PARAMETERS
      * NOTE: q_X must be undefined if that query parameter is unused, this is accepted by and() */

  /* row to sort by */
  let tmp
  switch (sort) {
    case 'name': tmp = tbl.name; break
    case 'date_added': tmp = tbl.created; break
    case 'release':
      if (tbl === cartoons) {
        tmp = tbl.airStart
        break
      } else { sort = null }
    case 'score': sort = null // TODO
    case 'favorites': sort = null // TODO
    default: sort = null
    case null: tmp = tbl.id
  }

  /* descending or ascending */
  const order = (!ascending) ? desc(tmp) : asc(tmp)

  if (tbl === cartoons || tbl === companies || tbl === staff) {
    // get all possible cartoon_types, company_type, or occupations (staff)
    formatsOrOccupations = await db.select({ id: ttbl.id, name: ttbl.name }).from(ttbl).orderBy(ttbl.name)

    /* types */
    q_t = (format === null || format === undefined) ? undefined : eq(ttbl.id, format)

    if (tbl === cartoons || tbl === staff) {
      /* langauge */
      q_l = (language === null || language === undefined) ? undefined : eq(languages.id, language)
      // get all languages
      allLangauges = await db.select({ id: languages.id, name: languages.name }).from(languages).orderBy(languages.name)
    }
  }

  /* name */
  q_n = (name === null || name === undefined) ? undefined : ilike(tbl.name, '%' + name + '%')
  /* END: BUILDING SQL QUERY FROM URL PARAMETERS */

  const { edited, links, airEnd, ...rest } = getTableColumns(tbl) // exclude the specified columns

  query = db.selectDistinct({ ...rest })
    .from(tbl)

  if (tbl === cartoons) {
    /* types for cartoons */
    query.leftJoin(jtCartoonsCartoonTypes, eq(jtCartoonsCartoonTypes.fkCartoonId, tbl.id))
      .leftJoin(cartoonTypes, eq(jtCartoonsCartoonTypes.fkCartoonTypeId, cartoonTypes.id))
    /* languages for cartoons */
      .leftJoin(jtCartoonsLanguages, eq(jtCartoonsLanguages.fkCartoonId, tbl.id))
      .leftJoin(languages, eq(jtCartoonsLanguages.fkLanguageId, languages.id))
  }
  if (tbl === companies) {
    /* types for companies */
    query.leftJoin(jtCompaniesCompanyTags, eq(jtCompaniesCompanyTags.fkCompanyId, tbl.id))
      .leftJoin(companyTags, eq(jtCompaniesCompanyTags.fkCompanyTagId, companyTags.id))
  }
  if (tbl === staff) {
    /* occupations for staff */
    query.leftJoin(jtOccupationsStaff, eq(jtOccupationsStaff.fkStaffId, tbl.id))
      .leftJoin(occupations, eq(jtOccupationsStaff.fkOccupationId, occupations.id))
    /* languages for voice actors */
      .leftJoin(jtLanguagesStaff, eq(jtLanguagesStaff.fkStaffId, tbl.id))
      .leftJoin(languages, eq(jtLanguagesStaff.fkLanguageId, languages.id))
  }
  query.where(and(q_n, q_y1, q_y2, q_s, q_l, q_t))
    .orderBy(order) // TODO: check where nulls go, should they be last?
    .limit(numResults)
    .offset(numResults * (currentPage - 1))

  query = await query

  const totalResults: number = query.length
  const totalPages: number = Math.ceil(totalResults / numResults)

  console.log('query', { name, numResults, currentPage, sort, ascending, slug, year, yearMax, format, status, language, totalResults, totalPages, languages: allLangauges?.length, querylen: query.length })
  return { query, totalResults, totalPages, formatsOrOccupations, allLangauges }
}

function parseURL (url: URL) {
  const name = url.searchParams.get('name')
  if (name === '' || name === undefined || name === null) { url.searchParams.delete('name') }

  let tmp

  // count that number of queries per page to 100
  tmp = parseInt(url.searchParams.get('count')!)
  const numResults: number = tmp < 101 && tmp > 10 ? tmp : 10
  tmp = parseInt(url.searchParams.get('page')!)
  const currentPage: number = tmp >= 1 ? tmp : 1

  if (currentPage === 1 || currentPage === undefined || currentPage === null) { url.searchParams.delete('page') }

  if (numResults === 10 || numResults === undefined || numResults === null) { url.searchParams.delete('count') }

  tmp = (url.searchParams.get('sort')!)
  const sort = tmp

  tmp = url.searchParams.get('ascending')
  const ascending = !!((tmp != 'false' || tmp === null))

  tmp = parseInt(url.searchParams.get('year1')!)
  const year = isNaN(tmp) ? 0 : tmp

  tmp = parseInt(url.searchParams.get('year2')!)
  const yearMax = isNaN(tmp) ? (new Date()).getFullYear() : tmp

  tmp = parseInt(url.searchParams.get('type')!)
  const format = isNaN(tmp) ? undefined : tmp

  tmp = parseInt(url.searchParams.get('status')!)
  const status = (isNaN(tmp) || !(tmp <= 6 && tmp >= 0)) ? 0 : tmp

  tmp = parseInt(url.searchParams.get('language')!)
  const language = isNaN(tmp) ? undefined : tmp

  // console.log("parseURL", { url, name, numResults, currentPage, sort, ascending, year, yearMax, format, status, language })
  return { url, name, numResults, currentPage, sort, ascending, year, yearMax, format, status, language }
}

export const load: PageServerLoad = async ({ url, params }) => {
  const { slug } = params

  const { url: u, name, numResults, currentPage, sort, ascending, year, yearMax, format, status, language } = parseURL(url)
  const ur = u.toString()

  try {
    const { query, totalResults, totalPages, formatsOrOccupations, allLangauges } = await resolveQuery(numResults, currentPage, slug, name, sort, ascending, year, yearMax, format, status, language)

    if (!query) {
      throw error(404, 'item not found')
    }

    // console.log("load", { query, name, slug, totalPages, url: ur, currentPage, numResults, ascending, sort, year, yearMax, format, status, language, alllang: allLangauges.length })
    return {
      query, name, slug, totalPages, url: ur, currentPage, numResults, ascending, sort, year, yearMax, format, status, language, formatsOrOccupations, allLangauges
    }
  } catch (err) {
    console.error('Error fetching ' + slug + ':', err)
    throw error(500, 'Failed to load ' + slug)
  }
}

export const actions = {
  default: async (event) => {
    // const { url, request, params } = event;
    // let slug = params.slug;
    //
    // /* Form */
    // const formData = await request.formData();
    // // let form = {
    // let page = parseInt(formData.get('page')?.toString()!);
    // let tags = formData.get('tags')?.toString().split(';');
    // let count = parseInt(formData.get('count')?.toString()!);
    //
    // let name = formData.get('name')?.toString().trim().replace(/\s+/g, ' ');
    // let year = parseInt(formData.get('year1')?.toString()!);
    // let yearMax = parseInt(formData.get('year2')?.toString()!);
    // if (isNaN(year))
    // year = 0;
    // if (isNaN(yearMax))
    // yearMax = (new Date()).getFullYear();
    // let language = formData.get('language')?.toString()
    // let format = formData.get('type')?.toString()
    // let status = formData.get('status')?.toString()
    // let sort = formData.get('sort')?.toString();
    // let ascending = formData.get('ascending') === "on";
    // // }
    // let ur = url.toString();
    //
    // let searchQuery: queryParameters;
    // searchQuery = {
    // slug: params.slug,
    // page: parseInt(formData.get('page')?.toString()!),
    // tags: formData.get('tags')?.toString().split(';'),
    // count: parseInt(formData.get('count')?.toString()!),
    //
    // name: formData.get('name')?.toString().trim().replace(/\s+/g, ' '),
    // year: year,
    // yearMax: yearMax,
    // language: formData.get('language')?.toString(),
    // format: formData.get('type')?.toString(),
    // status: parseInt(formData.get('status')?.toString()!),
    // sort: formData.get('sort')?.toString(),
    // ascending: formData.get('ascending') === "on",
    // }
    //
    // try {
    // url.searchParams.set('name', name!)
    // url.searchParams.delete('page')
    //
    // // throw replaceState(url, {name})
    // // throw goto(url)
    // console.log("formInput", { name, count, page, sort, ascending, slug, year, yearMax, language, format, status })
    // // let { query, totalResults, totalPages } = await resolveQuery(count, page, slug, name, sort, ascending, year, yearMax)
    // let { query, totalResults, totalPages } = await resolveQuery(count, page, slug, name, sort, ascending, year, yearMax)
    // return {
    // success: true,
    //
    // query,
    // name,
    // slug,
    // totalPages,
    // url: ur,
    // currentPage: page, //TODO NaN maybe keep like this since it should go to page 1 always
    // numResults: count, //TODO NaN
    // ascending,
    // sort,
    // year,
    // yearMax,
    // // tags,
    // }
    // } catch (error) {
    // return fail(500, {});
    // }
  }
} satisfies Actions
