<script lang="ts">
    const { user } = $props()

    let isDropdownOpen = $state(false)
    function toggleDropdown() {
        isDropdownOpen = !isDropdownOpen
    }
    if (typeof window !== 'undefined') {
        document.addEventListener('click', (event: MouseEvent) => {
            const dropdown = document.getElementById('header-friends-dropdown')
            if (dropdown && !dropdown.contains(event.target as Node)) {
                isDropdownOpen = false
            }
        })
    }
</script>

<button
    id="header-friends-dropdown"
    class="btn"
    onclick={toggleDropdown}
    aria-expanded={isDropdownOpen}
    aria-haspopup="true"
>
    {#if user?.friendRequests.length > 0}
        {user.friendRequests.length}
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
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
            />
        </svg>
    {:else}
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
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
        </svg>
    {/if}
</button>
{#if isDropdownOpen}
    <div
        role="menu"
        class="absolute left-0 z-10 mt-2 w-32 origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
    >
        <div role="none" class="py-1">
            {#each user.friendRequests as option, index}
                <button
                    id="menu-item-{index}"
                    role="menuitem"
                    tabindex="-1"
                    onclick={option.value}
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900
                                                                "
                >
                    {option.fkSenderId}
                </button>
            {/each}
        </div>
    </div>
{/if}
