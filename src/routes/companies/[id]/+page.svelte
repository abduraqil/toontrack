<script lang="ts">
    import Favorite from '../../../assets/components/favorite.svelte';
    import StaffTab from './tabs/StaffTab.svelte';
    import OverviewTab from './tabs/OverviewTab.svelte';

    import type { PageData } from './$types';
    export let data: PageData;

     $: company = data.company;

    let activeTab = 'overview';

    const tabs = [
        { id: 'overview', label: 'Overview', component: OverviewTab },
        { id: 'staff', label: 'Staff', component: StaffTab },
    ];

    function setActiveTab(tab: string) {
        activeTab = tab;
    }

    $: currentTabData = tabs.find(tab => tab.id === activeTab) || tabs[0];

     function formatStatus(status: number | null) {
        switch (status) {
            case 0: return 'Unknown';
            case 1: return 'Planned';
            case 2: return 'Ongoing';
            case 3: return 'Completed';
            case 4: return 'Hiatus';
            case 5: return 'Cancelled';
            case 6: return 'Unreleased';
            default: return 'Unknown';
        }
     }

    //  function formatStatusColor(status: number | null) {
    //     switch (status) {
    //         case 0: return 'bg-gray-500';
    //         case 1: return 'bg-yellow-500';
    //         case 2: return 'bg-green-500';
    //         case 3: return 'bg-blue-500';
    //         case 4: return 'bg-orange-500';
    //         case 5: return 'bg-red-500';
    //         case 6: return 'bg-purple-500';
    //         default: return 'bg-gray-500';
    //     }
    //  }

     function formatType(type: number | null) {
        switch (type) {
            case 0: return 'Unknown';
            case 1: return 'Other';
            case 2: return 'Series';
            case 3: return 'Miniseries';
            case 4: return 'Movie';
            case 5: return 'Short';
            case 6: return 'Anthology';
            case 7: return 'Special';
            default: return 'Unknown';
        }
     }

</script>

<svelte:head>
    <title>{company.name} - company Database</title>
    <meta name="description" content="{company.description || 'No description available.'}" />
</svelte:head>

<div class="min-h-screen bg-gray-100">
    <!-- Banner Section -->
    <div class="relative">
        <!-- Banner Background -->
        <div class="h-50 bg-gradient-to-r from-blue-900 to-purple-900 relative overflow-hidden">
            <!-- Optional: Add banner image here -->
        </div>

        <!-- White Content Area -->
        <div class="bg-white relative">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="flex flex-col lg:flex-row gap-8">
                    <!-- Cover Image - positioned to overlap banner and white area -->
                    <div class="flex-shrink-0 relative">
                        <img
                            src={'/src/assets/nocover.jpg'}
                            alt={company.name}
                            class="w-56 h-80 object-cover rounded-lg shadow-lg -mt-20 relative z-10"
                        />

                        <!-- Action Buttons -->
                        <div class="mt-4 space-y-3">
                            <!--TODO: Add action buttons like add to watched, dropped, etc -->

                            <!-- Favorite Button -->
                            <Favorite></Favorite>
                        </div>
                    </div>

                    <!-- company Information -->
                    <div class="flex-1 space-y-6">
                        <!-- Title and Basic Info -->
                        <div class="space-y-4">
                            <h1 class="text-4xl font-bold text-gray-900 leading-tight">{company.name}</h1>

                            <!-- Tags/Badges -->
                            <div class="flex flex-wrap items-center gap-3">
                                {#if company.of_type !== null}
                                    <span class="flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z" />
                                    </svg>
                                    {formatType(company.of_type)}
                                    </span>
                                {/if}
                                {#if company.age_rating !== null}
                                    <span class="flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                    </svg>

                                    {company.age_rating}
                                    </span>
                                {/if}
                                {#if company.air_start && company.air_end}
                                    <span class="flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
                                        </svg>

                                        {new Date(company.air_start).getFullYear()}-{new Date(company.air_end).getFullYear()}
                                    </span>
                                {/if}
                                {#if company.episodes !== null}
                                    <span class="flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
                                    </svg>

                                        {company.episodes} episodes
                                    </span>
                                {/if}
                                {#if company.duration !== null}
                                    <span class="flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>

                                        {company.duration} min
                                    </span>
                                {/if}
                            </div>
                        </div>

                        <!-- Description -->
                        {#if company.description != null}
                            <div class="space-y-2">
                                <h3 class="text-lg font-semibold text-gray-900">Description</h3>
                                <p class="text-gray-700 leading-relaxed">{company.description}</p>
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
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-2xl font-semibold mb-4">Details</h2>
                    <dl class="space-y-3">
                        {#each [
                            company.of_type !== null ? { label: 'Format', value: formatType(company.of_type) } : null,
                            company.episodes !== null ? { label: 'Episodes', value: company.episodes } : null,
                            company.duration !== null ? { label: 'Duration', value: `${company.duration} min` } : null,
                            company.status !== null ? { label: 'Status', value: formatStatus(company.status) } : null,
                            company.age_rating !== null ? { label: 'Age Rating', value: company.age_rating } : null,
                            company.air_start !== null ? { label: "Start Date", value: new Date(company.air_start).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' }) } : null,
                            company.air_end !== null ? { label: "End Date", value: new Date(company.air_end).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' }) } : null,
                            company.country !== null ? { label: 'Country', value: company.country } : null,
                        ].filter(detail => detail !== null) as detail}
                            <div>
                                <dt class="text-sm font-medium text-gray-700">{detail.label}</dt>
                                <dd class="mt-1 text-gray-900">{detail.value}</dd>
                            </div>
                        {/each}
                    </dl>
                </div>

                <!-- Meta Info -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-2xl font-semibold mb-4">Meta Information</h2>
                    <dl class="space-y-3">
                        {#each [
                            company.created !== null ? { label: 'Created', value: new Date(company.created).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' }) } : null,
                            company.edited !== null ? { label: 'Updated', value: new Date(company.edited).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' }) } : null,
                        ].filter(detail => detail !== null) as detail}
                            <div>
                                <dt class="text-sm font-medium text-gray-700">{detail.label}</dt>
                                <dd class="mt-1 text-gray-900">{detail.value}</dd>
                            </div>
                        {/each}
                    </dl>
                </div>
            </div>
            <!-- Right Content Area -->
            <div class="lg:col-span-3 space-y-6" >
                <!-- Navigation Tabs -->
                 <div class="bg-white rounded-lg shadow-md">
                    <!-- Tab Navigation -->
                    <div class="flex justify-center border-b border-gray-200">
                        {#each tabs as tab}
                            <button
                                class="
                                    px-6 py-3 text-sm font-medium border-b-2 transition-colors duration-200
                                    {activeTab === tab.id ? 'border-purple-600 text-purple-700 bg-blue-50'
                                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
                                type="button"
                                on:click={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        {/each}
                    </div>
                 </div>
                 <!-- Tab Content -->
                <div class="bg-white rounded-lg shadow-md p-6 pt-6 mt-4">
                    <svelte:component this={currentTabData.component} {company}/>
                </div>
            </div>
        </div>
    </div>
</div>
