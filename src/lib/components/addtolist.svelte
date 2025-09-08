<script lang="ts">
    import { goto } from '$app/navigation'
    import { page } from '$app/state'
    import { slide } from 'svelte/transition'

    // props
    const {
        itemId,
        itemType = 'unknown',
        isFavorited = false,
        onFavorite = () => {},
        cartoon,
    } = $props<{
        itemId: string | number
        itemType?: 'cartoon' | 'character' | 'staff' | 'unknown'
        isFavorite?: boolean
        cartoon: any
        onFavorite?: (event: {
            success: boolean
            isFavorited?: boolean
            error?: string
            itemId: string | number
            itemType: string
        }) => void
    }>()

    let localFavorited = $state(isFavorited)
    let isSubmitting = $state(false)

    $effect(() => {
        localFavorited = isFavorited
    })

    const detectedType =
        itemType !== 'unknown' ? itemType : detectType(page.url.pathname)
    function detectType(pathname: string | null): string {
        if (!pathname) return 'unknown'
        if (pathname.includes('/cartoon/')) return 'cartoon'
        if (pathname.includes('/character/')) return 'character'
        if (pathname.includes('/staff/')) return 'staff'

        return 'unknown'
    }

    // async function selectStatus(option: { k: string; v: number }) {
    //     status = option
    async function selectStatus() {
        isDropdownOpen = false
        // TODO: use api to update status

        const response = await fetch('/api/addtolist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                itemId: itemId,
                t: detectedType,
                s: status.v,
            }),
        })

        console.log('got status', response.status)
        if (response.status == 401) {
            goto(
                '/login?reference='.concat(
                    encodeURIComponent(page.url.pathname)
                )
            )
            console.log('redirection')
        }
    }

    async function postList() {
        // if (isSubmitting) return // Prevent multiple submissions

        //const previousState = localFavorited
        //localFavorited = !localFavorited
        isSubmitting = true

        const response = await fetch('/api/addtolist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                itemId: itemId,
                t: detectedType,
                s: 2,
                // s: status.v, TODO: this should be modified to work here too
                sc: score,
                sD: new Date(startDate),
                fD: new Date(finishDate),
                r: rewatches,
                e: episodesWatched,
                n: notes,
                // f: favorite: ,
            }),
        })

        console.log('got status', response.status)
        if (response.status == 401) {
            goto(
                '/login?reference='.concat(
                    encodeURIComponent(page.url.pathname)
                )
            )
            console.log('redirection')
        }
    }
    let isDropdownOpen = $state(false)

    /*
status:
0. Watching
1. Plan to watch
2. Complete
3. Rewatching
4. Paused
5. Dropped
 */
    const statusOptions = [
        { k: 'Completed', v: 2 },
        { k: 'Watching', v: 0 },
        { k: 'Rewatching', v: 3 },
        { k: 'Planning', v: 1 },
        { k: 'Paused', v: 4 },
        { k: 'Dropped', v: 5 },
    ]

    let status = $state({ k: 'Add to list', v: -1 })

    if (cartoon.userListEntry) {
        status = statusOptions.filter((e) => {
            if (e.v === cartoon.userListEntry.status) return e
        })[0]
    }

    function toggleDropdown() {
        isDropdownOpen = !isDropdownOpen
    }

    // list variables
    let score = $derived(
        cartoon.userListEntry?.score ? cartoon.userListEntry.score : 0
    )
    let startDate = $derived(
        cartoon.userListEntry?.startDate
            ? new Date(cartoon.userListEntry.startDate)
            : ''
    )
    let finishDate = $derived(
        cartoon.userListEntry?.finishDate
            ? new Date(cartoon.userListEntry.finishDate)
            : ''
    )
    let rewatches = $derived(
        cartoon.userListEntry?.rewatches ? cartoon.userListEntry.rewatches : 0
    )
    let episodesWatched = $derived(
        cartoon.userListEntry?.episodesWatched
            ? cartoon.userListEntry.episodesWatched
            : 0
    )
    let notes = $derived(
        cartoon.userListEntry?.notes ? cartoon.userListEntry.notes : ''
    )

    // list editor menu
    let listEditorVisible = $state(false)
    let noteBoxLength = $derived(notes.length)
    const MINNOTELEN = 0
    const MAXNOTELEN = 100
    function toggleListEditor() {
        if (isDropdownOpen) isDropdownOpen = !isDropdownOpen
        listEditorVisible = !listEditorVisible
    }
    console.log({
        sd: cartoon.userListEntry?.startDate,
        fd: cartoon.userListEntry?.finishDate,
    })
    $effect(() => {
        console.log({
            score,
            dt: typeof startDate,
            startDate,
            finishDate,
            rewatches,
            episodesWatched,
            notes,
        })
    })
</script>

<div id="sort-dropdown" class="relative">
    <button
        type="button"
        onclick={toggleListEditor}
        aria-label={localFavorited ? 'Unfavorite' : 'Favorite'}
        class="relative btn btn-primary hover:btn-info inline-block text-left hover:accent-blue-100 text-sm font-semibold"
    >
        {status.k}
    </button>
    {#if !listEditorVisible}
        <button
            id="sort-button"
            type="button"
            onclick={toggleDropdown}
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
            aria-label="Sort reviews by"
            class="text-sm font-semibold btn btn-primary hover:btn-info"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-4 transition-transform duration-200 {isDropdownOpen
                    ? 'rotate-180'
                    : ''}"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
            </svg>
        </button>
    {/if}

    {#if isDropdownOpen && !listEditorVisible}
        <div
            role="menu"
            class="absolute left-0 z-10 mt-2 w-32 origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
            <div role="none" class="py-1">
                {#each statusOptions as option, index}
                    <button
                        id="menu-item-{index}"
                        role="menuitem"
                        tabindex="-1"
                        onclick={() => selectStatus()}
                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900
                                            {status.k === option.k
                            ? 'bg-gray-50 text-gray-900'
                            : ''}"
                    >
                        {option.k}
                    </button>
                {/each}
            </div>
        </div>
    {/if}
</div>

{#if listEditorVisible}
    <!-- <form -->
    <!--     method="POST" -->
    <!--     action="" -->
    <!--     id="review_box" -->
    <!--     transition:slide -->
    <!--     class="text-sm font-medium text-gray-700 bg-white border rounded-md focus:outline-none focus:ring-gray-300 focus:ring focus:bg-gray-50 border-purple-500 shadow-sm mb-8 p-0.5" -->
    <!-- > -->
    <div
        class="text-sm font-medium text-gray-700 bg-white border rounded-md focus:outline-none focus:ring-gray-300 focus:ring focus:bg-gray-50 border-purple-500 shadow-sm mb-8 p-0.5"
    >
        <label for="status">Status</label>
        <div class="container relative py-5 flex items-center">
            <select
                id="status"
                name="status"
                onclick={toggleDropdown}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                aria-label="Show watching status"
            >
                {#each statusOptions as o}
                    <option value={o.v}> {o.k} </option>
                {/each}
            </select>
        </div>
        <label for="progress">Score</label>
        <div class="container relative py-5 flex items-center">
            <input
                type="number"
                id="progress"
                name="progress"
                min="0"
                max="10"
                bind:value={score}
            />
        </div>
        {#if cartoon.episodes}
            <label for="episodes_watched">Episodes watched</label>
            <div class="container relative py-5 flex items-center">
                <input
                    type="number"
                    id="episodes_watched"
                    name="episodes_watched"
                    min="0"
                    max={cartoon.episodes}
                    bind:value={episodesWatched}
                    onchange={() => {
                        episodesWatched =
                            episodesWatched <= cartoon.episodes
                                ? episodesWatched
                                : cartoon.episodes
                    }}
                />
            </div>
        {/if}
        <label for="rewatches">Rewatches</label>
        <div class="container relative py-5 flex items-center">
            <input
                type="number"
                id="rewatches"
                name="rewatches"
                min="0"
                max="10"
                bind:value={rewatches}
            />
        </div>
        <label for="start_date">Date Started</label>
        <div class="container relative py-5 flex items-center">
            <input
                type="date"
                id="start_date"
                name="start_date"
                min="0"
                max="10"
                bind:value={startDate}
            />
        </div>
        <label for="finish_date">Date Finished</label>
        <div class="container relative py-5 flex items-center">
            <input
                type="date"
                id="finish_date"
                name="finish_date"
                min="0"
                max="10"
                bind:value={finishDate}
            />
        </div>
        <div
            class="w-full field-sizing-content text-sm font-medium text-gray-700 bg-white rounded-md focus:outline-none focus:ring-gray-300 focus:ring shadow-sm transition-colors duration-200"
        >
            <textarea
                id="review-input-box"
                name="review"
                placeholder="Notes section"
                minlength={MINNOTELEN}
                maxlength={MAXNOTELEN}
                rows="1"
                bind:value={notes}
                class="w-full px-4 py-3 field-sizing-content text-sm font-medium text-gray-700 bg-white rounded-md focus:outline-none focus:ring-gray-300 transition-colors duration-200"
            ></textarea>
            <div class="relative p-2 text-grey-700">
                {noteBoxLength}/{MAXNOTELEN}
                <button
                    class="absolute bottom-0 right-0 rounded-md bg-purple-50 text-sm font-semibold text-gray-900 hover:bg-purple-100 p-2 px-4"
                    onclick={postList}
                >
                    Post
                </button>
            </div>
        </div>
        <!-- </form> -->
    </div>
{/if}
