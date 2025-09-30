<script lang="ts">
    import Friend from '$lib/components/friend.svelte'
    import OverviewTab from './tabs/OverviewTab.svelte'
    import cartoonList from './tabs/CartoonList.svelte'
    import Favorites from './tabs/Favorites.svelte'
    import Reviews from './tabs/Reviews.svelte'
    import { page } from '$app/state'
    import { goto, invalidateAll } from '$app/navigation'

    let { data } = $props()
    const { userPage } = data
    const user = $state(page.data.user)
    let userFriends = $state(data.userFriends)

    let activeTab = $state('overview')

    const tabs = [
        { id: 'overview', label: 'Overview', component: OverviewTab },
        { id: 'cartoons', label: 'Cartoons', component: cartoonList },
        { id: 'favorites', label: 'Favorites', component: Favorites },
        { id: 'reviews', label: 'Reviews', component: Reviews },
    ]

    function setActiveTab(tab: string) {
        activeTab = tab
    }

    function hours() {
        let tot = 0
        userPage.userCartoonHistory.filter((e) => {
            tot +=
                (1 + (e.rewatches || 0)) *
                (e.episodesWatched || 1) *
                (e.cartoon.duration || 0)
        })
        return Math.round((tot / 60) * 100) / 100
    }

    let currentTabData = $derived(
        tabs.find((tab) => tab.id === activeTab) || tabs[0]
    )
    const Component = $derived(currentTabData.component)

    // $effect(() => {
    //     console.log({
    //         currentTabData,
    //     })
    // })

    /* friend section */
    let isDropdownOpen = $state(false)
    function toggleDropdown() {
        isDropdownOpen = !isDropdownOpen
    }
    if (typeof window !== 'undefined') {
        document.addEventListener('click', (event: MouseEvent) => {
            const dropdown = document.getElementById('user-page-dropdown')
            if (dropdown && !dropdown.contains(event.target as Node)) {
                isDropdownOpen = false
            }
        })
    }
    function getSortOptions() {
        if (
            user?.friendRequests.filter(
                (e: { fkTargetId: any; fkSenderId: number }) => {
                    return (
                        e.fkTargetId == user.id && e.fkSenderId == userPage.id
                    )
                }
            ).length > 0
        ) {
            // sent to you && not friends
            return [
                { label: 'Accept request', value: acceptFriend },
                { label: 'Deny request', value: deleteFriend },
            ]
        } else if (
            user?.friendRequests.filter(
                (e: { fkSenderId: any; fkTargetId: number }) => {
                    return (
                        e.fkSenderId == user.id && e.fkTargetId == userPage.id
                    )
                }
            ).length > 0
        ) {
            // sent by you && not friends
            return [
                { label: 'Request already sent', value: null },
                { label: 'Delete request', value: deleteFriend },
            ]
        } else if (userFriends == true) {
            // friends
            return [{ label: 'Delete friend', value: deleteFriend }]
        } else {
            // no request && not friends
            return [{ label: 'Send request', value: requestFriend }]
        }
    }
    let sortOptions = $derived(getSortOptions())

    // console.log(e
    //     user?.friendRequests.filter((e) => {
    //         return e.fkSenderId == user.id && e.fkTargetId == userPage.id
    //     })
    //    // .length > 0
    // )

    async function friendAPI(method: string, action?: string) {
        try {
            let response = await (
                await fetch('/api/friend', {
                    method: method,
                    body: JSON.stringify({ target: userPage?.id }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                })
            ).json()
            if (response.ok) {
                switch (method) {
                    case 'POST':
                        if (action == 'request')
                            user.friendRequests.push({
                                fkSenderId: user.id,
                                fkTargetId: userPage.id,
                            })
                        else if (action == 'accept') {
                            user.friendRequests = user.friendRequests.filter(
                                (e: {
                                    fkSenderId: number
                                    fkTargetId: number
                                }) => {
                                    return e.fkSenderId != userPage.id
                                }
                            )
                            userFriends = true
                        }
                        break
                    case 'DELETE':
                        user.friendRequests = user.friendRequests.filter(
                            (e: { fkSenderId: number; fkTargetId: number }) => {
                                return (
                                    e.fkSenderId != user.id &&
                                    e.fkTargetId != userPage.id &&
                                    e.fkSenderId != userPage.id &&
                                    e.fkTargetId != user.id
                                )
                            }
                        )
                        userFriends = false
                        break
                }
            }
            invalidateAll()
            isDropdownOpen = false
        } catch (error) {
            console.error('e', error)
        }
    }
    async function acceptFriend() {
        friendAPI('POST', 'accept')
    }
    async function requestFriend() {
        friendAPI('POST', 'request')
    }
    async function deleteFriend() {
        friendAPI('DELETE')
    }
</script>

<svelte:head>
    <title>{userPage.name}'s Profile</title>
    <meta
        name="description"
        content={userPage.description || 'No description available.'}
    />
</svelte:head>

<div class="min-h-screen bg-base-200">
    <!-- Header Banner -->
    <div class="relative bg-gradient-to-r from-primary to-secondary h-48"></div>

    <!-- Profile Section -->
    <div class="relative -mt-24 pb-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <!-- Profile -->
            <div class="bg-base-100 rounded-lg shadow-lg p-8 mb-8">
                <div class="flex flex-col md:flex-row gap-8">
                    <!-- Avatar -->
                    <div class="flex-shrink-0">
                        <div
                            class="w-32 h-32 rounded-full overflow-hidden border-4 border-accent shadow-lg bg-neutral-content"
                        >
                            <img
                                src={userPage.coverPic || '/nocover.jpg'}
                                alt={userPage.name}
                                class="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>

                <!-- Profile Information -->
                <div class="flex-1 space-y-6">
                    <!-- Profile Information -->
                    <div class="flex-1 space-y-6">
                        <!-- Name and Actions(?)-->
                        <div
                            class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                        >
                            <div>
                                <h1
                                    class="text-3xl font-bold text-base-content mb-1"
                                >
                                    {userPage.name}
                                </h1>
                                <p class="text-base-content text-sm">
                                    Member since {userPage.created
                                        ?.toLocaleString()
                                        .split(',')[0] || 'Unknown'}
                                </p>
                            </div>
                            <div>
                                {#if user?.id != userPage.id && user?.id}
                                    <div
                                        class="relative inline-block text-left"
                                        id="user-page-dropdown"
                                    >
                                        <div>
                                            <button
                                                class="px-4 py-2 btn btn-success
                                                text-base-100 rounded-md hover:bg-success-focus
                                                transition-colors text-sm font-medium
                                                inline-flex items-center justify-center gap-x-1.5
                                                bg-white hover:bg-purple-50"
                                                id="sort-button"
                                                type="button"
                                                onclick={toggleDropdown}
                                                aria-expanded={isDropdownOpen}
                                                aria-haspopup="true"
                                                aria-label="Sort reviews by"
                                            >
                                                Friend
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
                                        </div>

                                        {#if isDropdownOpen}
                                            <div
                                                role="menu"
                                                class="absolute left-0 z-10 mt-2 w-32 origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                            >
                                                <div role="none" class="py-1">
                                                    {#each sortOptions as option, index}
                                                        <button
                                                            id="menu-item-{index}"
                                                            role="menuitem"
                                                            tabindex="-1"
                                                            onclick={option.value}
                                                            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900
                                                                "
                                                        >
                                                            <!-- {currentSort === option.label ? 'bg-gray-50 text-gray-900' : ''} -->
                                                            {option.label}
                                                        </button>
                                                    {/each}
                                                </div>
                                            </div>
                                        {/if}
                                    </div>
                                {/if}
                            </div>
                        </div>

                        <!-- Stats Row -->
                        <div class="flex flex-wrap gap-8 text-sm">
                            <div class="flex flex-col items-center">
                                <span class="text-2xl font-bold text-gray-900">
                                    {userPage.userCartoonHistory?.length ?? 0}
                                </span>
                                <span class="text-gray-600">Cartoons</span>
                            </div>
                            <div class="flex flex-col items-center">
                                <span class="text-2xl font-bold text-gray-900">
                                    {userPage.reviews?.length ?? 0}
                                </span>
                                <span class="text-gray-600">Reviews</span>
                            </div>
                            <div class="flex flex-col items-center">
                                <span class="text-2xl font-bold text-gray-900">
                                    0
                                </span>
                                <span class="text-gray-600">Collections</span>
                            </div>
                            <div class="flex flex-col items-center">
                                <span class="text-2xl font-bold text-gray-900"
                                    >0</span
                                >
                                <span class="text-gray-600">Friends</span>
                            </div>
                            <div class="flex flex-col items-center">
                                <span class="text-2xl font-bold text-gray-900">
                                    {hours()}
                                </span>
                                <span class="text-gray-600">Hours Watched</span>
                            </div>
                        </div>

                        <!-- Description -->
                        {#if userPage.description}
                            <div class="prose prose-sm max-w-none">
                                <p class="text-base-content/70 leading-relaxed">
                                    {userPage.description}
                                </p>
                            </div>
                        {/if}
                    </div>
                </div>
            </div>

            <!-- Tabs -->
            <div class="mb-8">
                <nav
                    class="flex space-x-0 bg-base-100 rounded-lg shadow-sm overflow-hidden justify-center"
                >
                    {#each tabs as tab}
                        <button
                            class="px-6 py-3 text-sm font-medium border-b-2 transition-colors duration-200 {activeTab ===
                            tab.id
                                ? 'border-secondary text-secondary bg-secondary/10'
                                : 'border-transparent text-base-content hover:text-secondary hover:border-secondary/50'}"
                            type="button"
                            onclick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    {/each}
                </nav>
            </div>

            <!-- Tab Content -->
            <div class="bg-base-100 rounded-lg shadow-sm">
                <div class="p-8">
                    <Component {userPage} />
                </div>
            </div>
        </div>
    </div>
</div>
