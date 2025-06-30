<script lang="ts">
    import Favorite from '../../../assets/components/favorite.svelte';
    import type { PageData } from './$types';
    export let data: PageData;
    
     $: cartoon = data.cartoon;

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

     function formatStatusColor(status: number | null) {
        switch (status) {
            case 0: return 'bg-gray-500';
            case 1: return 'bg-yellow-500';
            case 2: return 'bg-green-500';
            case 3: return 'bg-blue-500';
            case 4: return 'bg-orange-500';
            case 5: return 'bg-red-500';
            case 6: return 'bg-purple-500';
            default: return 'bg-gray-500';
        }
     }

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
    <title>{cartoon.name} - Cartoon Database</title>
    <meta name="description" content="{cartoon.description || 'No description available.'}" />
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
                            alt={cartoon.name}
                            class="w-56 h-80 object-cover rounded-lg shadow-lg -mt-20 relative z-10"
                        />
                        
                        <!-- Action Buttons -->
                        <div class="mt-4 space-y-3">
                            <!--TODO: Add action buttons like add to watched, dropped, etc -->
                            
                            <!-- Favorite Button -->
                            <Favorite></Favorite>
                        </div>
                    </div>
                    
                    <!-- Cartoon Information -->
                    <div class="flex-1 space-y-6">
                        <!-- Title and Basic Info -->
                        <div class="space-y-4">
                            <h1 class="text-4xl font-bold text-gray-900 leading-tight">{cartoon.name}</h1>
                            
                            <!-- Tags/Badges -->
                            <div class="flex flex-wrap items-center gap-3">
                                {#if cartoon.of_type !== null}
                                    <span class="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                        {formatType(cartoon.of_type)}
                                    </span>
                                {/if}
                                {#if cartoon.status !== null}
                                    <span class="px-3 py-1 rounded-full text-sm font-medium text-white {formatStatusColor(cartoon.status)}">
                                        {formatStatus(cartoon.status)}
                                    </span>
                                {/if}
                                {#if cartoon.age_rating !== null}
                                    <span class="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                        {cartoon.age_rating}
                                    </span>
                                {/if}
                                {#if cartoon.air_start && cartoon.air_end}
                                    <span class="flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
                                        </svg>

                                        {new Date(cartoon.air_start).getFullYear()}-{new Date(cartoon.air_end).getFullYear()}
                                    </span>
                                {/if}
                                {#if cartoon.episodes !== null}
                                    <span class="flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
                                    </svg>

                                        {cartoon.episodes} episodes
                                    </span>
                                {/if}
                                {#if cartoon.duration !== null}
                                    <span class="flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>

                                        {cartoon.duration} min
                                    </span>
                                {/if}
                            </div>
                        </div>
                        
                        <!-- Description -->
                        {#if cartoon.description != null}
                            <div class="space-y-2">
                                <h3 class="text-lg font-semibold text-gray-900">Description</h3>
                                <p class="text-gray-700 leading-relaxed">{cartoon.description}</p>
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Detailed Information -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Side Bar -->
            <div class="space-y-6">
                <!-- Details -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-2xl font-semibold mb-4">Details</h2>
                    <dl class="space-y-3">
                        {#each [
                            cartoon.of_type !== null ? { label: 'Format', value: formatType(cartoon.of_type) } : null,
                            cartoon.episodes !== null ? { label: 'Episodes', value: cartoon.episodes } : null,
                            cartoon.duration !== null ? { label: 'Duration', value: `${cartoon.duration} min` } : null,
                            cartoon.status !== null ? { label: 'Status', value: formatStatus(cartoon.status) } : null,
                            cartoon.age_rating !== null ? { label: 'Age Rating', value: cartoon.age_rating } : null,
                            cartoon.air_start !== null ? { label: "Start Date", value: new Date(cartoon.air_start).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' }) } : null,
                            cartoon.air_end !== null ? { label: "End Date", value: new Date(cartoon.air_end).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' }) } : null,
                            cartoon.country !== null ? { label: 'Country', value: cartoon.country } : null,
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
                            cartoon.created !== null ? { label: 'Created', value: new Date(cartoon.created).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' }) } : null,
                            cartoon.edited !== null ? { label: 'Updated', value: new Date(cartoon.edited).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' }) } : null,
                        ].filter(detail => detail !== null) as detail}
                            <div>
                                <dt class="text-sm font-medium text-gray-700">{detail.label}</dt>
                                <dd class="mt-1 text-gray-900">{detail.value}</dd>
                            </div>
                        {/each}
                    </dl>
                </div>                 
            </div>
        </div>
    </div>
</div>