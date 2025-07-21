<script lang="ts">
    export let company: any;

    /* TODO
    Update href link to link to company profile page
    */

    function convertCompany(role: number | null ) {
        switch (role) {
            case 0: return 'Unknown';
            case 1: return 'Producer';
            case 2: return 'Licensor';
            case 3: return 'Studio';
            case 4: return 'Distributor';
            case 5: return 'Original Broadcaster';
            case 6: return 'Broadcaster';
            default: return 'Other';
        }
    }

    // Use the correct property name from your relations
    let cartoons = company.cartoons
    $: cartoons
</script>

<div class="space-y-4">
    <div class="prose max-w-none">
        {#if cartoons.length > 0}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {#each cartoons as cartoon}
                    <!-- <a href="/cartoons/{cartoon.cartoon.id}"> -->
                        <div class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex overflow-hidden h-24">
                            <div class="flex-1 p-4 flex flex-col justify-center">
                                    <a href="/cartoons/{cartoon.id}" class="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">{cartoon.name}</a>
                                <div class="flex flex-wrap gap-1">
                                        <span class="inline-block bg-purple-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                                            {convertCompany(cartoon.role)}
                                        </span>
                                </div>
                            </div>
                            <div class="w-24 h-24">
                                <img
                                    src={cartoon.coverPic ? cartoon.coverPic : '/src/assets/nocover.jpg'}
                                    alt={cartoon.name}
                                    class="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    <!-- </a> -->
                {/each}
            </div>
        {:else}
            <div class="bg-gray-50 rounded-lg p-8 text-center">
                <div class="text-gray-400 mb-2">
                    <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
                    </svg>

                </div>
                <p class="text-gray-600 text-lg">No cartoon information available.</p>
            </div>
        {/if}
    </div>
</div>
