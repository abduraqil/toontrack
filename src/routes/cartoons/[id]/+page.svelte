<script lang="ts">
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

</script>

<svelte:head>
    <title>{cartoon.name} - Cartoon Database</title>
    <meta name="description" content="{cartoon.description || 'No description available.'}" />
</svelte:head>

<div class="min-h-screen bg-gray-100">

    <div class="bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="flex flex-col lg:flex-row gap-8">
                <!-- Cover Image -->
                <div class="flex-shrink-0">
                    <img 
                        src={cartoon.cover_pic || '/src/assets/nocover.jpg'} 
                        alt={cartoon.name}
                        class="w-64 h-96 object-cover rounded-lg shadow-2xl border-4 border-white/20"
                    />
                </div>
                <!-- Cartoon Main Information -->
                <div class="flex-1 space-y-4">
                    <div class="space-y-2">
                        <h1 class="text-4xl font-bold leading-tight">{cartoon.name}</h1>
                        <div class="flex flex-wrap items-center gap-4 text-lg">
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
                            {#if cartoon.duration !== null}
                                {cartoon.duration} min
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
</div>