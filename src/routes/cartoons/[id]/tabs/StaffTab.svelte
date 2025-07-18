<script lang="ts">
    export let cartoon: any;

    /* TODO
    Update href link to link to staff profile page
    */

    // Group staff by name to consolidate roles
    function groupStaffByName(cartoonStaff: any[]) {
        const grouped = new Map();

        cartoonStaff.forEach(staffRelation => {
            // Access the staff data through the relation
            const staff = staffRelation.staff;
            const role = staffRelation.role;
            const id = staffRelation.fkStaffId;

            if (!staff) return; // Skip if staff data is missing

            const name = staff.name;
            if (grouped.has(name)) {
                grouped.get(name).roles.push(role);
            } else {
                grouped.set(name, { // include the staff properties you need
                    name: name,
                    birthday: staff.birthday || 'Unknown',
                    coverPic: staff.coverPic || null,
                    roles: [role],
                    id: id
                });
            }
        });
        console.log(Array.from(grouped.values()));
        return Array.from(grouped.values());
    }

    function convertRole(role: string | null ) {
        switch (role) {
            case '0': return 'Unknown';
            case '1': return 'Creator';
            case '2': return 'Director';
            case '3': return 'Cast Member';
            case '4': return 'Voice Actor';
            case '5': return 'Composer';
            case '6': return 'Producer';
            case '7': return 'Audio';
            default: return 'Other';
        }
    }

    // Use the correct property name from your relations
    $: groupedStaff = cartoon.jtCartoonsStaff && cartoon.jtCartoonsStaff.length > 0
        ? groupStaffByName(cartoon.jtCartoonsStaff)
        : [];
</script>

<div class="space-y-4">
    <div class="prose max-w-none">
        {#if groupedStaff.length > 0}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {#each groupedStaff as staff}
                    <a href="/staff/{staff.id}">
                        <div class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex overflow-hidden h-24">
                            <div class="flex-1 p-4 flex flex-col justify-center">
                                <h3 class="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">{staff.name}</h3>
                                <div class="flex flex-wrap gap-1">
                                    {#each staff.roles as role}
                                        <span class="inline-block bg-purple-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                                            {convertRole(role)}
                                        </span>
                                    {/each}
                                </div>
                            </div>
                            <div class="w-24 h-24">
                                {#if staff.coverPic}
                                <img
                                    src={staff.coverPic}
                                    alt={staff.name}
                                    class="w-full h-full object-cover"
                                />
                                {/if}
                            </div>
                        </div>
                    </a>
                {/each}
            </div>
        {:else}
            <div class="bg-gray-50 rounded-lg p-8 text-center">
                <div class="text-gray-400 mb-2">
                    <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <p class="text-gray-600 text-lg">No staff information available.</p>
            </div>
        {/if}
    </div>
</div>
