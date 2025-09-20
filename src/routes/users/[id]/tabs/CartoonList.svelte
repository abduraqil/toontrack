<script lang="ts">
    //import { marked } from 'marked'
    //import DOMPurify from 'dompurify'

    let { userPage } = $props<{
        userPage: any
    }>()

    let searchQuery = $state('')
    let selectedStatus = $state('all')
    let sortBy = $state('title')
    //let status

    let viewMode = $state('grid') // 'grid, 'list', 'compact'

    // statusMaps
    const statusMap = {
        0: { name: 'Watching', color: 'bg-success' },
        1: { name: 'Planning', color: 'bg-gray-500' },
        2: { name: 'Completed', color: 'bg-info' },
        3: { name: 'Rewatching', color: 'bg-info' }, // Count as completed?
        4: { name: 'Paused', color: 'bg-warning' },
        5: { name: 'Dropped', color: 'bg-error' },
    }

    const filteredCartoons = $derived(() => {
        let cartoons = userPage?.userCartoonHistory || []

        // filter it out by search query
        if (searchQuery.trim()) {
            cartoons = cartoons.filter((entry: any) =>
                entry.cartoon.name
                    .toLowerCase()
                    .includes(searchQuery.trim().toLowerCase())
            )
        }

        // filter by status
        if (selectedStatus !== 'all') {
            cartoons = cartoons.filter(
                (entry: any) => entry.status == Number(selectedStatus)
            )
        }

        // sort
        cartoons = [...cartoons].sort((a: any, b: any) => {
            switch (sortBy) {
                case 'title':
                    return (a.cartoon?.name || '').localeCompare(
                        b.cartoon?.name || ''
                    )
                case 'score':
                    return (b.score || 0) - (a.score || 0)
            }
        })

        return cartoons
    })

    const groupedCartoons = $derived(() => {
        const groups: { [key: string]: any[] } = {}
        const cartoons = filteredCartoons()

        Object.keys(statusMap).forEach((status) => {
            groups[status] = cartoons.filter(
                (entry: any) => entry.status == Number(status)
            )
        })

        return groups
    })
</script>

<div class="space-y-4">
    <div class="prose max-w-none">
        <div class="flex gap-2">
            <!-- Filter Side -->
            <div class="w-64 space-y-4">
                <!-- Search Bar -->
                <div class="form-control w-50 mb-4 ml-4">
                    <input
                        type="text"
                        placeholder="Search Cartoons Here..."
                        class="input input-bordered input-sm w-full"
                        bind:value={searchQuery}
                    />
                </div>

                <!-- Status Filters -->
                <div class="w-64 flex-shrink-0 mt-4">
                    <div class="card bg-base-100 rounded-lg overflow-hidden">
                        <div class="card-body p-6 space-y-4">
                            <!-- Lists Filter -->
                            <div>
                                <h3
                                    class="font-semibold text-lg text-base-content mb-4"
                                >
                                    Lists
                                </h3>
                                <div class="space-y-3">
                                    <label
                                        class="flex items-center gap-3 cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name="status"
                                            class="radio radio-sm radio-primary"
                                            bind:group={selectedStatus}
                                            value="all"
                                        />
                                        <span class="text-base">All</span>
                                    </label>
                                    {#each Object.entries(statusMap) as [statusId, status]}
                                        <label
                                            class="flex items-center gap-3 cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name="status"
                                                class="radio radio-sm radio-primary"
                                                bind:group={selectedStatus}
                                                value={statusId}
                                            />
                                            <span class="text-base"
                                                >{status.name}</span
                                            >
                                        </label>
                                    {/each}
                                </div>
                            </div>

                            <!-- Sort -->
                            <div class="divider my-4"></div>
                            <div>
                                <h3
                                    class="font-semibold text-lg text-base-content mb-4"
                                >
                                    Sort
                                </h3>
                                <div class="form-control">
                                    <select
                                        class="select select-sm select-bordered w-full"
                                        bind:value={sortBy}
                                    >
                                        <option value="title">Title</option>
                                        <option value="score">Score</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- View Type -->
                <div class="btn-group ml-6">
                    <button
                        class="btn btn-sm {viewMode === 'grid'
                            ? 'btn-active'
                            : ''}"
                        aria-label="Grid View"
                        onclick={() => (viewMode = 'grid')}
                    >
                        <svg
                            class="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                            />
                        </svg>
                    </button>
                    <button
                        class="btn btn-sm {viewMode === 'list'
                            ? 'btn-active'
                            : ''}"
                        aria-label="List View"
                        onclick={() => (viewMode = 'list')}
                    >
                        <svg
                            class="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            <!-- Display Side -->
            <div class="flex-1 justify items-left ml-4">
                {#if selectedStatus === 'all'}
                    <!-- Group by Status -->
                    {#each Object.entries(statusMap) as [statusId, status]}
                        {#if groupedCartoons()[statusId]?.length > 0}
                            <div class="mb-8">
                                <h2
                                    class="text-xl font-semibold text-base-content mb-4"
                                >
                                    {status.name}
                                </h2>

                                <!-- Grid View -->
                                {#if viewMode === 'grid'}
                                    <div
                                        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
                                    >
                                        {#each groupedCartoons()[statusId] as entry}
                                            <div
                                                class="card card-compact bg-base-100 shadow-lg hover:shadow-xl transition-shadow"
                                            >
                                                <figure class="relative">
                                                    <img
                                                        src={entry.cartoon
                                                            ?.coverPic ||
                                                            '/nocover.jpg'}
                                                        alt={entry.cartoon
                                                            ?.name}
                                                        class="w-full h-48 object-contain"
                                                    />
                                                    {#if entry.episodesWatched && entry.cartoon?.totalEpisodes}
                                                        <div
                                                            class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-1 text-center"
                                                        >
                                                            {entry.episodesWatched}/{entry
                                                                .cartoon
                                                                .totalEpisodes}
                                                        </div>
                                                    {/if}
                                                </figure>
                                                <div class="card-body p-2">
                                                    <a
                                                        href={`/cartoons/${entry.fkCartoonId}`}
                                                        class="card-title text-sm text-center hover:text-primary transition-colors block font-semibold text-base-content hover:bg-primary/10 rounded-lg py-2 px-3"
                                                    >
                                                        <h3
                                                            class="text-sm font-medium line-clamp-2"
                                                            title={entry.cartoon
                                                                ?.name}
                                                        >
                                                            {entry.cartoon
                                                                ?.name ||
                                                                'Unknown'}
                                                        </h3>
                                                    </a>
                                                    {#if entry.score}
                                                        <div
                                                            class="text-xs text-primary font-medium"
                                                        >
                                                            {entry.score}
                                                        </div>
                                                    {/if}
                                                </div>
                                            </div>
                                        {/each}
                                    </div>
                                {:else if viewMode === 'list'}
                                    <!-- List View -->
                                    <div class="space-y-2">
                                        {#each groupedCartoons()[statusId] as entry}
                                            <div
                                                class="card bg-base-100 shadow-sm"
                                            >
                                                <div class="card-body p-4">
                                                    <div
                                                        class="flex items-center gap-4"
                                                    >
                                                        <div class="avatar">
                                                            <div
                                                                class="w-16 h-20 rounded"
                                                            >
                                                                <img
                                                                    src={entry
                                                                        .cartoon
                                                                        ?.coverPic ||
                                                                        '/nocover.jpg'}
                                                                    alt={entry
                                                                        .cartoon
                                                                        ?.name}
                                                                    class="object-contain"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div class="flex-1">
                                                            <a
                                                              href={`/cartoons/${entry.fkCartoonId}`}
                                                              class="block hover:text-primary transition-colors"
                                                            >
                                                              <h3 class="font-semibold">
                                                                {entry.cartoon?.name || 'Unknown'}
                                                              </h3>
                                                            </a>
                                                            <div
                                                                class="flex items-center gap-4 mt-1 text-sm text-base-content/70"
                                                            >
                                                                {#if entry.score}
                                                                    <span
                                                                        >Score: {entry.score}</span
                                                                    >
                                                                {/if}
                                                                {#if entry.episodesWatched}
                                                                    <span
                                                                        >Episodes:
                                                                        {entry.episodesWatched}</span
                                                                    >
                                                                {/if}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        {/each}
                                    </div>
                                {/if}
                            </div>
                        {/if}
                    {/each}
                {:else}
                    <!-- Single Status View -->
                    <div class="mb-4">
                        <h2
                            class="text-xl font-semibold text-base-content mb-4"
                        >
                            {statusMap[
                                Number(selectedStatus) as keyof typeof statusMap
                            ]?.name || 'Unkown Status'}
                            <span class="text-base-content/70"
                                >({filteredCartoons().length})</span
                            >
                        </h2>
                    </div>
                    {#if viewMode === 'grid'}
                        <div
                            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
                        >
                            {#each filteredCartoons() as entry}
                                <div
                                    class="card card-compact bg-base-100 shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    <figure class="relative">
                                        <img
                                            src={entry.cartoon?.coverPic ||
                                                '/nocover.jpg'}
                                            alt={entry.cartoon?.name}
                                            class="w-full h-48 object-contain"
                                        />
                                        {#if entry.episodesWatched && entry.cartoon?.totalEpisodes}
                                            <div
                                                class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-1 text-center"
                                            >
                                                {entry.episodesWatched}/{entry
                                                    .cartoon.totalEpisodes}
                                            </div>
                                        {/if}
                                    </figure>
                                    <div class="card-body p-2">
                                        <a
                                            href={`/cartoons/${entry.fkCartoonId}`}
                                            class="card-title text-sm text-center hover:text-primary transition-colors block font-semibold text-base-content hover:bg-primary/10 rounded-lg py-2 px-3"
                                        >
                                            <h3
                                                class="text-sm font-medium line-clamp-2"
                                                title={entry.cartoon?.name}
                                            >
                                                {entry.cartoon?.name ||
                                                    'Unknown'}
                                            </h3>
                                        </a>
                                        {#if entry.score}
                                            <div
                                                class="text-xs text-primary font-medium"
                                            >
                                                {entry.score}
                                            </div>
                                        {/if}
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {:else if viewMode === 'list'}
                        <div class="space-y-2">
                            {#each filteredCartoons() as entry}
                                <div class="card bg-base-100 shadow-sm">
                                    <div class="card-body p-4">
                                        <div class="flex items-center gap-4">
                                            <div class="avatar">
                                                <div class="w-16 h-20 rounded">
                                                    <img
                                                        src={entry.cartoon
                                                            ?.coverPic ||
                                                            '/nocover.jpg'}
                                                        alt={entry.cartoon
                                                            ?.name}
                                                        class="object-contain"
                                                    />
                                                </div>
                                            </div>
                                            <div class="flex-1">
                                              <a
                                                              href={`/cartoons/${entry.fkCartoonId}`}
                                                              class="block hover:text-primary transition-colors"
                                                            >
                                                <h3 class="font-semibold">
                                                    {entry.cartoon?.name ||
                                                        'Unknown'}
                                                </h3>
                                                </a>
                                                <div
                                                    class="flex items-center gap-4 mt-1 text-sm text-base-content/70"
                                                >
                                                    {#if entry.score}
                                                        <span
                                                            >Score: {entry.score}</span
                                                        >
                                                    {/if}
                                                    {#if entry.episodesWatched}
                                                        <span
                                                            >Episodes:
                                                            {entry.episodesWatched}</span
                                                        >
                                                    {/if}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {/if}
                {/if}
            </div>
        </div>
    </div>
</div>
