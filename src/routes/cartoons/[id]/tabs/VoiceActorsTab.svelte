<script lang="ts">
    export let cartoon: any

    /* TODO
    Update href link to link to role profile page
    */

    // Use the correct property name from your relations
    let characters = cartoon.characters
    $: characters
</script>

<div class="space-y-4">
    <div class="prose max-w-none">
        {#if characters.length > 0}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {#each characters as role}
                    <!-- <a href="/cartoons/{role.cartoon.id}"> -->
                    <div
                        class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex overflow-hidden h-24"
                    >
                        <div class="w-24 h-24">
                            <img
                                src={role.character.coverPic
                                    ? role.character.coverPic
                                    : '/nocover.jpg'}
                                alt={role.character.name}
                                class="w-full h-full object-cover"
                            />
                        </div>
                        <div class="flex-1 p-4 flex flex-col justify-center">
                            <a
                                href="/characters/{role.character.id}"
                                class="font-semibold text-sm text-gray-900 mb-1 line-clamp-1"
                                >{role.character.name}</a
                            >
                            <a
                                style="display: flex; justify-content: flex-end"
                                href="/staff/{role.staff.id}"
                                class="font-semibold text-sm text-gray-900 mb-1 line-clamp-1"
                                >{role.staff.name}</a
                            >
                            {#if role.language.id}
                                <div class="flex flex-wrap gap-1">
                                    <!-- <span class="inline-block bg-purple-100 text-gray-800 text-xs px-2 py-1 rounded-full"> -->
                                    <!--     {convertRole(role.role)} -->
                                    <!-- </span> -->
                                    <span
                                        class="inline-block bg-purple-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                                    >
                                        {role.language.name}
                                    </span>
                                </div>
                            {/if}
                        </div>
                        {#if role.staff.id}
                            <div class="w-24 h-24">
                                <img
                                    src={role.staff.coverPic
                                        ? role.staff.coverPic
                                        : '/nocover.jpg'}
                                    alt={role.staff.name}
                                    class="w-full h-full object-cover"
                                />
                            </div>
                        {/if}
                    </div>
                    <!-- </a> -->
                {/each}
            </div>
        {:else}
            <div class="bg-gray-50 rounded-lg p-8 text-center">
                <div class="text-gray-400 mb-2">
                    <svg
                        class="mx-auto h-12 w-12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                </div>
                <p class="text-gray-600 text-lg">
                    No voice actors information available.
                </p>
            </div>
        {/if}
    </div>
</div>
