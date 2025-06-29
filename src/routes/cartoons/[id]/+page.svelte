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

    <div class="my-8 mx-30 rounded-md bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="flex flex-col lg:flex-row gap-8">
                <!-- Cover Image -->
                <div class="flex-shrink-0">
                    <img 
                        src={'/src/assets/nocover.jpg'} 
                        alt={cartoon.name}
                        class="w-64 h-96 object-cover rounded-lg shadow-2xl border-4 border-white/20"
                    />
                    
                    <!-- Action Buttons-->
                    <div class="mt-4">
                         <div class="space-y-3">
                        <!--TODO
                        do the action button that will be like add to watched, dropped, etc*/
                         -->
                         </div>

                         <!-- Favorite Button -->
                         <Favorite></Favorite>
                          
                    </div>
                    
                </div>
                <!-- Cartoon Main Information -->
                <div class="flex-1 space-y-4">
                    <div class="space-y-2">
                        <h1 class="text-4xl font-bold leading-tight">{cartoon.name}</h1>
                        <div class="flex flex-wrap items-center gap-4 text-lg">
                            {#if cartoon.of_type !== null}
                                <span class="px-3 py-1 rounded-full text-sm font-medium bg-stone-500">
                                    {formatType(cartoon.of_type)}
                                </span>
                            {/if}
                            {#if cartoon.status !== null}
                                <span class="px-3 py-1 rounded-full text-sm font-medium {formatStatusColor(cartoon.status)}">
                                    {formatStatus(cartoon.status)}
                                </span>
                            {/if}
                            {#if cartoon.age_rating !== null}
                                <span class="px-3 py-1 rounded-full text-sm font-medium bg-stone-500">
                                    {cartoon.age_rating}
                                </span>
                            {/if}
                            {#if cartoon.air_start && cartoon.air_end}
                                <span>
                                    {new Date(cartoon.air_start).getFullYear()}-{new Date(cartoon.air_end).getFullYear()}
                                </span>
                            {/if}
                            {#if cartoon.duration !== null}
                                {cartoon.duration}min
                            {/if}
                        </div>
                    </div>
                    {#if cartoon.description != null}
                        <p class="text-lg text-gray-200 leading-relaxed max-w-3xl">{cartoon.description}</p>
                    {/if}


                    <!-- Quick Stats-->
                </div>
            </div>
        </div>

    </div>

    <!-- Detailed Information -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Side Bar-->
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
                        <p>test</p>
                    </dl>
                 </div>                 
            </div>
        </div>
    </div>
</div>