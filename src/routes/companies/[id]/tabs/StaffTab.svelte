<script lang="ts">
    export let company: any;

    // Group staff by name to consolidate roles
    function groupStaffByName(companyStaff: any[]) {
        const grouped = new Map();

        companyStaff.forEach(staff => {
            const name = staff.staff.name;
            if (grouped.has(name)) {
                grouped.get(name).roles.push(staff.role);
            } else {
                grouped.set(name, {
                    name: name,
                    roles: [staff.role]
                });
            }
        });

        return Array.from(grouped.values());
    }

    $: groupedStaff = company.companyStaff && company.companyStaff.length > 0
        ? groupStaffByName(company.companyStaff)
        : [];
</script>

<div class="space-y-4">
    <div class="prose max-w-none">
        {#if groupedStaff.length > 0}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {#each groupedStaff as staff}
                    <div class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <h3 class="font-semibold text-lg text-gray-900 mb-2">{staff.name}</h3>
                        <div class="space-y-1">
                            {#each staff.roles as role}
                                <span class="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full mr-1 mb-1">
                                    {role}
                                </span>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        {:else}
            <div class="bg-gray-50 rounded-lg p-8 text-center">
                <div class="text-gray-400 mb-2">
                    <svg class="mx-auto h-12 w-1    2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <p class="text-gray-600 text-lg">No staff information available.</p>
            </div>
        {/if}
    </div>
</div>
