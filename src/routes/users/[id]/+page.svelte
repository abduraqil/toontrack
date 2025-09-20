<script lang="ts">
    import Friend from '$lib/components/friend.svelte'
    import OverviewTab from './tabs/OverviewTab.svelte'
    import cartoonList from './tabs/CartoonList.svelte'
    import Favorites from './tabs/Favorites.svelte'
    import Reviews from './tabs/Reviews.svelte'
    // import VoiceActorsTab from './tabs/VoiceActorsTab.svelte'
    // import StaffTab from './tabs/StaffTab.svelte'
    // import CompaniesTab from './tabs/CompaniesTab.svelte'
    // import ReviewTab from './tabs/ReviewTab.svelte'
    // import StatsTab from './tabs/StatsTab.svelte'

    let { data } = $props()
    const { userPage } = data

    let activeTab = $state('overview')

    const tabs = [
        { id: 'overview', label: 'Overview', component: OverviewTab },
        { id: 'cartoons', label: 'Cartoons', component: cartoonList },
        { id: 'favorites', label: 'Favorites', component: Favorites },
        { id: 'reviews', label: 'Reviews', component: Reviews },
        // { id: 'voice actors', label: 'Characters', component: VoiceActorsTab },
        // { id: 'staff', label: 'Staff', component: StaffTab },
        // { id: 'companies', label: 'Companies', component: CompaniesTab },
        // { id: 'reviews', label: 'Reviews', component: ReviewTab },
        // { id: 'stats', label: 'Stats', component: StatsTab },
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
                                <Friend />
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
                            class="px-6 py-3 text-sm font-medium border-b-2 transition-colors duration-200
                        <button
                            class="px-6 py-3 text-sm font-medium border-b-2 transition-colors duration-200
                                    {activeTab === tab.id
                                ? 'border-secondary text-secondary bg-secondary/10'
                                : 'border-transparent text-base-content hover:text-secondary hover:border-secondary/50'}"
                            type="button"
                            onclick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    {/each}
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
