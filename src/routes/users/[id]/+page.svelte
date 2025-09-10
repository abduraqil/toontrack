<script lang="ts">
    import OverviewTab from './tabs/OverviewTab.svelte'
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
        // { id: 'voice actors', label: 'Characters', component: VoiceActorsTab },
        // { id: 'staff', label: 'Staff', component: StaffTab },
        // { id: 'companies', label: 'Companies', component: CompaniesTab },
        // { id: 'reviews', label: 'Reviews', component: ReviewTab },
        // { id: 'stats', label: 'Stats', component: StatsTab },
    ]

    function setActiveTab(tab: string) {
        activeTab = tab
    }

    let currentTabData = $derived(
        tabs.find((tab) => tab.id === activeTab) || tabs[0]
    )
    const Component = $derived(currentTabData.component)

    console.log(userPage)
    // $effect(() => {
    //     console.log({
    //         currentTabData,
    //     })
    // })

    function formatStatus(status: number | null) {
        switch (status) {
            case 0:
                return 'Unknown'
            case 1:
                return 'Planned'
            case 2:
                return 'Ongoing'
            case 3:
                return 'Completed'
            case 4:
                return 'Hiatus'
            case 5:
                return 'Cancelled'
            case 6:
                return 'Unreleased'
            default:
                return 'Unknown'
        }
    }

    // function formatType(type: number | null) {
    //     switch (type) {
    //         case 0:
    //             return 'Unknown'
    //         case 1:
    //             return 'Other'
    //         case 2:
    //             return 'Series'
    //         case 3:
    //             return 'Miniseries'
    //         case 4:
    //             return 'Movie'
    //         case 5:
    //             return 'Short'
    //         case 6:
    //             return 'Anthology'
    //         case 7:
    //             return 'Special'
    //         default:
    //             return 'Unknown'
    //     }
    // }
</script>

<svelte:head>
    <title>{userPage.name} - ToonTrack User</title>
    <meta
        name="description"
        content={userPage.description || 'No description available.'}
    />
</svelte:head>

<div class="min-h-screen bg-base-200">
    <!-- Banner Section -->
    <div class="relative">
        <!-- Banner Background -->
        <div
            class="h-35 bg-gradient-to-r from-primary to-secondary relative overflow-hidden"
        >
            <!-- Optional: Add banner image here -->
        </div>

        <!-- White Content Area -->
        <div class="bg-base-100 relative">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="flex flex-col lg:flex-row gap-8">
                    <!-- Cover Image - positioned to overlap banner and white area -->
                    <div class="flex-shrink-0 relative">
                        <div
                            class="w-70 h-80 flex items-center justify-center relative -mt-20 z-10 rounded-lg"
                        >
                            <img
                                src={userPage.coverPic
                                    ? userPage.coverPic
                                    : '/nocover.jpg'}
                                alt={userPage.name}
                                class="object-contain rounded-lg shadow-lg"
                            />
                        </div>
                    </div>

                    <!-- User Information -->
                    <div class="flex-1 space-y-6">
                        <!-- Title and Basic Info -->
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <h1
                                    class="text-4xl font-bold text-base-content leading-tight"
                                >
                                    {userPage.name}
                                </h1>
                                <!-- <Addtolist -->
                                <!--     itemId={Number(userPage.id)} -->
                                <!--     maxEpisodes={userPage.episodes || undefined} -->
                                <!--     userListEntry={userPage.userListEntry} -->
                                <!-- /> -->
                                <!-- <Favorite -->
                                <!--     itemId={Number(userPage.id)} -->
                                <!--     itemType="cartoons" -->
                                <!--     userFavoriteEntry={userPage.userFavoriteEntry} -->
                                <!-- /> -->
                                <!--     onFavorite={handleFavoriteResult} -->
                                <!-- /> -->
                            </div>

                            <!-- Tags/Badges -->
                            <div
                                class="flex flex-wrap items-center gap-3 text-sm"
                            >
                                <!-- {#if userPage.ageRating !== null} -->
                                <!--     <span class="flex items-center gap-1"> -->
                                <!--         <svg -->
                                <!--             xmlns="http://www.w3.org/2000/svg" -->
                                <!--             fill="none" -->
                                <!--             viewBox="0 0 24 24" -->
                                <!--             stroke-width="1.5" -->
                                <!--             stroke="currentColor" -->
                                <!--             class="size-6" -->
                                <!--         > -->
                                <!--             <path -->
                                <!--                 stroke-linecap="round" -->
                                <!--                 stroke-linejoin="round" -->
                                <!--                 d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" -->
                                <!--             /> -->
                                <!--         </svg> -->
                                <!---->
                                <!--         {userPage.ageRating} -->
                                <!--     </span> -->
                                <!-- {/if} -->
                                <span class="flex items-center gap-1">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor"
                                        class="size-6"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z"
                                        />
                                    </svg>
                                    Joined:
                                    {userPage.created
                                        ?.toLocaleString()
                                        .split(',')[0]}
                                </span>
                            </div>
                        </div>

                        <!-- Description -->
                        {#if userPage.description != null}
                            <div class="space-y-2">
                                <h3 class="text-lg font-semibold text-gray-900">
                                    Description
                                </h3>
                                <p class="text-gray-700 leading-relaxed">
                                    {userPage.description}
                                </p>
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Detailed Information -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <!-- Left Side-Bar -->
            <div class="lg:col-span-1 space-y-6">
                <!-- Details -->
                <div class="bg-base-100 rounded-lg shadow-md p-6">
                    <h2 class="text-2xl font-semibold mb-4">Details</h2>
                    <dl class="space-y-3">
                        <!-- {#each [userPage.types && userPage.types.length > 0 ? { label: 'Type', value: userPage.types -->
                        <!--                   .map((ct) => ct.name) -->
                        <!--                   .join(', ') } : null, userPage.seasons !== null ? { label: 'Seasons', value: userPage.seasons } : null, userPage.episodes !== null ? { label: 'Episodes', value: userPage.episodes } : null, userPage.duration !== null ? { label: 'Duration', value: `${userPage.duration} min` } : null, userPage.status !== null ? { label: 'Status', value: formatStatus(Number(userPage.status)) } : null, userPage.ageRating !== null ? { label: 'Age Rating', value: userPage.ageRating } : null, userPage.airStart !== null ? { label: 'Start Date', value: userPage.airStart.toLocaleDateString( undefined, { month: 'short', day: '2-digit', year: 'numeric' } ) } : null, userPage.airEnd !== null ? { label: 'End Date', value: userPage.airEnd.toLocaleDateString( undefined, { month: 'short', day: '2-digit', year: 'numeric' } ) } : null, userPage.countries && userPage.countries.length > 0 ? { label: 'Countries', value: userPage.countries -->
                        <!--                   .map((c) => c.name) -->
                        <!--                   .join(', ') } : null].filter((detail) => detail !== null) as detail} -->
                        <!--     <div> -->
                        <!--         <dt -->
                        <!--             class="text-sm font-medium text-base-content" -->
                        <!--         > -->
                        <!--             {detail.label} -->
                        <!--         </dt> -->
                        <!--         <dd class="mt-1 text-base-content"> -->
                        <!--             {detail.value} -->
                        <!--         </dd> -->
                        <!--     </div> -->
                        <!-- {/each} -->
                    </dl>
                </div>
                <div class="bg-base-100 rounded-lg shadow-md p-6">
                    <h2 class="text-2xl font-semibold mb-4">Tags</h2>
                    <dl class="space-y-3">
                        <!-- {#each [cartoonTags && cartoonTags.length > 0 ? -->
                        <!-- { value: cartoonTags.map(ct => ct.name) } : null, -->
                        <!-- ].filter(detail => detail !== null) as detail} -->
                        <!--     <div> -->
                        <!--         <dd class="mt-1 text-gray-900">{detail.value}</dd> -->
                        <!--     </div> -->
                        <!-- {/each} -->
                        <!-- {#each userPage.tags as tag} -->
                        <!--     <!-- TODO: clicking these takes you to the search page -->
                        -->
                        <!--     <dd class="mt-1 text-base-content">{tag.name}</dd> -->
                        <!-- {/each} -->
                    </dl>
                </div>
            </div>
            <!-- Right Content Area -->
            <div class="lg:col-span-3 space-y-6">
                <!-- Navigation Tabs -->
                <div class="bg-base-100 rounded-lg shadow-md">
                    <!-- Tab Navigation -->
                    <div class="flex justify-center border-b border-gray-200">
                        {#each tabs as tab}
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
                    </div>
                </div>
                <!-- Tab Content -->
                <div class="bg-base-100 rounded-lg shadow-md p-6 pt-6 mt-4">
                    <Component {userPage} />
                </div>
            </div>
        </div>
    </div>
</div>
