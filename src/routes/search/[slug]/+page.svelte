<script lang="ts">
    /* TODO search
visible options:
	Genres - SM
	Min/Max Years
	Language
	Type
	Status
	Sort

advanced / hidden:
	Min Rating
	Min/Max Episodes
	Min/Max Duration
	Min/Max Seasons
	Advanced Tags:
	  Minimum Percent
  */
    import type { PageData, ActionData } from './$types'
    import { replaceState } from '$app/navigation'

    const CURRENTYEAR = new Date().getFullYear()
    const MAXSEASONS = 100
    const MAXEPISODES = 1000
    const MAXDURATION = 300 // minutes
    let { data, form } = $props()
    // let { data, form }: { data: PageData, form: ActionData } = $props();
    // console.log(form, "form");
    // console.log(data, "data");
    let {
        query,
        name,
        slug,
        totalPages: pages,
        url: ur,
        currentPage,
        numResults: count,
        ascending,
        sort,
        year,
        yearMax,
        language,
        format,
        status,
        formatsOrOccupations: TYPES,
        allLangauges: LANGUAGES,
    } = data
    let url = new URL(ur)

    /* tmp */
    // let status = 0,
    //	 language = 0,
    //	 type = 0,
    let episode1 = 0,
        episode2 = 0,
        duration1 = 0,
        duration2 = 0,
        seasons1 = 0,
        seasons2 = 0
    let answer = $state('')
    // let answer2 = $state(0);

    let year1 = $state(year)
    year1 = year == null ? 0 : year
    let year2 = $state(yearMax)
    year2 = yearMax == null ? CURRENTYEAR : yearMax

    let form_language = $state(language)
    form_language = language == null ? 0 : language

    let form_type = $state(format)
    form_type = format == null ? 0 : format

    let form_status = $state(status)
    form_status = status == null ? 0 : status

    let arrow = $state(ascending)
    let form_sort = $state()
    form_sort = sort || null

    /*advanced*/
    let form_episode1 = $state(episode1)
    form_episode1 = episode1 == null ? 0 : episode1

    let form_episode2 = $state(episode2)
    form_episode2 = episode2 == null ? MAXEPISODES : episode2

    let form_duration1 = $state(duration1)
    form_duration1 = duration1 == null ? 0 : duration1

    let form_duration2 = $state(duration2)
    form_duration2 = duration2 == null ? MAXDURATION : duration2

    let form_seasons1 = $state(seasons1)
    form_seasons1 = seasons1 == null ? 0 : seasons1

    let form_seasons2 = $state(seasons2)
    form_seasons2 = seasons2 == null ? MAXSEASONS : seasons2

    let tmp_sortopts = [
        { id: null, text: 'Sort ▼' },
        { id: 'name', text: 'Name' },
    ]
    if (slug == 'cartoons')
        tmp_sortopts.push({ id: 'release', text: 'Release' })
    tmp_sortopts = tmp_sortopts.concat(
        { id: 'score', text: 'Score' },
        { id: 'favorites', text: 'Favorites' }
    )
    if (slug == 'users' || slug == 'cartoons') {
        tmp_sortopts.push({
            id: 'date_added',
            text: slug == 'users' ? 'Joined' : 'Added',
        })
    }

    let sortOptions = $state(tmp_sortopts)

    let debugInfo = {
        // call count
        cc: {
            updateURL: 0,
            generateLinks: 0,
        },
    }

    /* updates url */
    async function updateURL(event: any) {
        let val = event.target.value

        switch (event.target.name) {
            case 'name':
                val = val.toString().trim().replace(/\s+/g, ' ')
                // val.length <= 0
                val.length <= 2 // TODO: this line should be uncommented
                    ? url.searchParams.delete('name')
                    : url.searchParams.set('name', val)
                break
            case 'sort':
                val
                    ? url.searchParams.set('sort', val)
                    : url.searchParams.delete('sort')
                break
            case 'ascending':
                if (!ascending) {
                    ascending = true
                    url.searchParams.delete('ascending')
                    //arrow = "▲";
                } else {
                    ascending = false
                    url.searchParams.set('ascending', ascending.toString())
                    //arrow = "▼";
                }
                break
            case 'year1':
                if (val == 0) url.searchParams.delete('year1')
                else url.searchParams.set('year1', val)
                break
            case 'year2':
                if (val == CURRENTYEAR) url.searchParams.delete('year2')
                else url.searchParams.set('year2', val)
                break
            case 'language':
                if (val == 0) url.searchParams.delete('language')
                else url.searchParams.set('language', val)
                break
            case 'type':
                if (val == 0) url.searchParams.delete('type')
                else url.searchParams.set('type', val)
                break
            case 'status':
                if (val == 0) url.searchParams.delete('status')
                else url.searchParams.set('status', val)
                break
        }
        // TODO: this should update the following variables
        // console.log({ ascending, sort, year, yearMax, language, format, status,});

        url.searchParams.delete('page')
        if (count != 10) url.searchParams.set('count', count.toString())

        debugInfo.cc.updateURL++ // call count

        replaceState(url, data)
        // goto(url, { replaceState: true });
        // throw invalidate(url)
        console.log(event.target.name, val)
    }

    /* returns the link that takes to the page indicated by i */
    function pageLinks(i: number) {
        let tmp = url.searchParams.get('page')
        url.searchParams.set('page', i.toString())
        let link = url.searchParams.toString()
        if (tmp != null) url.searchParams.set('page', tmp)
        return link
    }

    /* Generate page links for page navigation bar id="page_nav_bar" */
    function generateLinks() {
        let links: string[][] = []
        let prev = 0
        if (currentPage > 1) links.push(['Back', pageLinks(currentPage - 1)])

        for (let i = 1; i <= data.totalPages; i++) {
            if (
                i <= 7 || // Limit to 7 links at the start
                i > data.totalPages - 7 || // Limit to 7 links at the end
                (i <= currentPage + 3 && i >= currentPage - 3) // 3 links at each side of current page
            ) {
                if (i > prev + 1) links.push(['...', '']) // place elipses where it skips

                if (i == currentPage)
                    links.push([i.toString(), '']) // avoid creating a link for the current page
                else links.push([i.toString(), pageLinks(i)])

                prev = i
                debugInfo.cc.generateLinks++
            }
        }
        if (currentPage < pages)
            links.push(['Next', pageLinks(currentPage + 1)])

        return links
    }
</script>

<svelte:head>
    <title>Search {slug} - {name}</title>
</svelte:head>

<svelte:body />
<div class="min-h-screen bg-gray-100 relative">
    <form
        data-sveltekit-keepfocus
        data-sveltekit-replacestate
        method="POST"
        action=""
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
        <!-- SEARCH BAR -->
        <div id="query_elements" class="mb-6">
            <div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
                id="search_input"
            >
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Search {slug}"
                    oninput={updateURL}
                    class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
                    value={name || ''}
                />
                <!-- TAGS & GENRES: Select Mulitple -->
                <!-- END TAGS -->
                <!-- YEARS -->
                {#if slug == 'cartoons'}
                    <div id="years">
                        Year released
                        <div id="years_boxes">
                            <select
                                name="year1"
                                id="years"
                                bind:value={year1}
                                onchange={updateURL}
                            >
                                <!-- TODO THIS SHOULD NOT SHOW THE DEFAUALT DROPDOWN ARROW -->
                                <option value={0}> min ▼ </option>
                                {#each { length: CURRENTYEAR - 1908 }, o}
                                    <option value={o + 1908}>
                                        {o + 1908}
                                    </option>
                                {/each}
                            </select>
                            -
                            <select
                                name="year2"
                                id="years"
                                bind:value={year2}
                                onchange={updateURL}
                            >
                                <option selected value={CURRENTYEAR}>
                                    max ▼
                                </option>
                                {#each { length: CURRENTYEAR - 1908 }, o}
                                    <option value={CURRENTYEAR - o}>
                                        {CURRENTYEAR - o}
                                    </option>
                                {/each}
                            </select>
                        </div>
                    </div>
                {/if}
                <!-- END YEARS -->
                <!-- LANGUAGE -->
                {#if slug == 'cartoons' || slug == 'staff'}
                    <div id="language">
                        Language
                        <div id="language_select">
                            <select
                                name="language"
                                id="language"
                                bind:value={form_language}
                                onchange={updateURL}
                            >
                                <!-- TODO: select multiple options from languages -->
                                <option value={0}> any ▼ </option>
                                {#each LANGUAGES as o}
                                    <option value={o.id}>
                                        {o.name}
                                    </option>
                                {/each}
                            </select>
                        </div>
                    </div>
                {/if}
                <!-- END LANGUAGE-->
                <!-- TYPE -->
                {#if slug != 'characters' && slug != 'users'}
                    <div id="type">
                        {slug == 'staff' ? 'Occupation' : 'Type'}
                        <div id="type_select">
                            <select
                                name="type"
                                id="type"
                                bind:value={form_type}
                                onchange={updateURL}
                            >
                                <!-- TODO: select multiple options from countries -->
                                <option value={0}> any ▼ </option>
                                {#each TYPES! as o}
                                    <option value={o.id}>
                                        {o.name}
                                    </option>
                                {/each}
                            </select>
                        </div>
                    </div>
                {/if}
                <!-- END TYPE-->
                <!-- STATUS -->
                {#if slug === 'cartoons'}
                    <div id="status">
                        Status
                        <div id="status_select">
                            <select
                                name="status"
                                id="status"
                                bind:value={form_status}
                                onchange={updateURL}
                            >
                                <option value={0}> any ▼ </option>
                                <option value={1}>Planned</option>
                                <option value={2}>In Progress</option>
                                <option value={3}>Completed</option>
                                <option value={4}>Halted</option>
                                <option value={5}>Canceled</option>
                                <option value={6}>Unreleased</option>
                            </select>
                        </div>
                    </div>
                {/if}
                <!-- END STATUS-->
                <!-- SORT -->
                <div id="sorting">
                    <select
                        name="sort"
                        id="sort"
                        bind:value={form_sort}
                        onchange={() => {
                            answer = ''
                        }}
                        oninput={updateURL}
                    >
                        {#each sortOptions as o}
                            <!-- {#if slug == "cartoons" || !(o.id == "release" || o.id == "score")} -->
                            <option value={o.id}> {o.text} </option>
                            <!-- {/if} -->
                        {/each}
                    </select>
                    <!-- TODO THIS DOESNT WORK WITHOUT JS -->
                    <label
                        class="p-2 bg-white border border-gray-300 rounded-md w-full text-center hover:bg-gray-50"
                    >
                        <input
                            name="ascending"
                            bind:checked={arrow}
                            type="checkbox"
                            value=""
                            class="hidden peer"
                            onclick={updateURL}
                        />
                        {arrow ? '▲' : '▼'}
                    </label>
                </div>
                <!-- END SORT -->
                <!-- ADVANCED OPTIONS -->
                <!--  TODO:
						The following are hidden and should be changed to look more appealing.
						the min max boxes should be displayed as "min - max"
						it should be made obvious that the dash is not a minus.
			FOR SOME REASON adding this section breaks the form
						-->
                <!-- <div id="advanced-options" > -->
                <!-- <label>Advanced Options:</label> -->
                <!-- EPISODES -->
                <!--	 Max episodes -->
                <!--	 <div id="episodes_select"> -->
                <!--		 <input -->
                <!--			 type="number" -->
                <!--			 id="episodes" -->
                <!--			 name="episodes_min" -->
                <!--			 min="0" -->
                <!--			 max={MAXEPISODES} -->
                <!--			 bind:value={form_episode1} -->
                <!--			 onchange={updateURL} -->
                <!--		 /> -->
                <!--		 - -->
                <!--		 <input -->
                <!--			 type="number" -->
                <!--			 id="episodes" -->
                <!--			 name="episodes_max" -->
                <!--			 min="0" -->
                <!--			 max={MAXEPISODES} -->
                <!--			 bind:value={form_episode2} -->
                <!--			 onchange={updateURL} -->
                <!--		 /> -->
                <!--	 </div> -->
                <!-- END EPISODES -->
                <!-- DURATION -->
                <!--	 Max duration -->
                <!--	 <div id="duration_select"> -->
                <!--		 <input -->
                <!--			 type="number" -->
                <!--			 id="duration" -->
                <!--			 name="duration_min" -->
                <!--			 min="0" -->
                <!--			 max={MAXDURATION} -->
                <!--			 bind:value={form_duration1} -->
                <!--			 onchange={updateURL} -->
                <!--		 /> -->
                <!--		 - -->
                <!--		 <input -->
                <!--			 type="number" -->
                <!--			 id="duration" -->
                <!--			 name="duration_max" -->
                <!--			 min="0" -->
                <!--			 max={MAXDURATION} -->
                <!--			 bind:value={form_duration2} -->
                <!--			 onchange={updateURL} -->
                <!--		 /> -->
                <!--	 </div> -->
                <!-- END DURATION -->
                <!-- SEASONS -->
                <!--	 Seasons -->
                <!--	 <div id="seasons_select"> -->
                <!--		 <input -->
                <!--			 type="number" -->
                <!--			 id="seasons" -->
                <!--			 name="seasons_min" -->
                <!--			 min="0" -->
                <!--			 max={MAXSEASONS} -->
                <!--			 bind:value={form_seasons1} -->
                <!--			 onchange={updateURL} -->
                <!--		 /> -->
                <!--		 - -->
                <!--		 <input -->
                <!--			 type="number" -->
                <!--			 id="seasons" -->
                <!--			 name="seasons_max" -->
                <!--			 min="0" -->
                <!--			 max={MAXSEASONS} -->
                <!--			 bind:value={form_seasons2} -->
                <!--			 onchange={updateURL} -->
                <!--		 /> -->
                <!--	 </div> -->
                <!-- END SEASONS -->
                <!-- </div> -->
                <!-- END ADVANCED -->
            </div>
        </div>

        <!-- Display Search Results -->
        <div class="flex flex-col lg:flex-row gap-8">
            {#if query.length > 0}
                <div
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
                >
                    {#each query as q}
                        <div id="result_obj">
                            <a
                                href="/{slug}/{q.id}"
                                data-sveltekit-reload
                                class="font-semibold text-sm text-gray-900 mb-1 line-clamp-1"
                            >
                                <img
                                    src={q.coverPic
                                        ? q.coverPic
                                        : '/nocover.jpg'}
                                    alt={q.name}
                                    class="w-56 h-80 object-cover rounded-lg shadow-lg"
                                />
                                <p>{q.name}</p>
                            </a>
                        </div>
                    {/each}
                </div>
            {:else}
                <!-- No Results -->
                {#if url.searchParams.get('name') != undefined && form?.success == true}
                    <div class="bg-gray-50 rounded-lg p-8 text-center">
                        <div class="text-gray-400 mb-2">
                            <svg
                                class="mx-auto h-12 w-12"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                stroke-width="1.5"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                                />
                            </svg>
                        </div>
                        <p class="text-gray-600 text-lg">No results found.</p>
                    </div>
                {/if}
                <!-- End No Results -->
            {/if}
        </div>

        <div class="flex justify-center items-center" id="page_nav_bar">
            <!-- page navigation bar -->
            {#if pages > 1}
                <!-- PAGE BUTTONS -->
                {#each generateLinks() as link}
                    {#if link[1] != ''}
                        <a
                            type="submit"
                            data-sveltekit-replacestate
                            href="?{link[1]}"
                            class="p-2 bg-white border border-gray-300 rounded-md w-full text-center"
                        >
                            {link[0]}
                        </a>
                    {:else}
                        <p class="p-2 bg-white rounded-md w-full text-center">
                            {link[0]}
                        </p>
                    {/if}
                {/each}
            {/if}
        </div>
    </form>
</div>
