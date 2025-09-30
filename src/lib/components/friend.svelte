<script lang="ts">
    import { goto, invalidateAll } from '$app/navigation'
    import { page } from '$app/state'

    const { session } = $props()

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
    let friendRequests = $derived(
        session.friendRequests.filter((e) => {
            return e.fkSenderId != session.userId
        })
    )
    let yourRequests = $derived(
        session.friendRequests.filter((e) => {
            return e.fkSenderId == session.userId
        })
    )
    async function friendAPI(target: number, method: string, action?: string) {
        try {
            let response = await (
                await fetch('/api/friend', {
                    method: method,
                    body: JSON.stringify({ target: target }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                })
            ).json()
            if (response.ok) {
                switch (method) {
                    case 'POST':
                        if (action == 'request')
                            session.friendRequests.push({
                                fkSenderId: session.userId,
                                fkTargetId: target,
                            })
                        else if (action == 'accept') {
                            session.friendRequests =
                                session.friendRequests.filter(
                                    (e: {
                                        fkSenderId: number
                                        fkTargetId: number
                                    }) => {
                                        return e.fkSenderId != target
                                    }
                                )
                        }
                        break
                    case 'DELETE':
                        session.friendRequests = session.friendRequests.filter(
                            (e: { fkSenderId: number; fkTargetId: number }) => {
                                return (
                                    e.fkSenderId != session.userId &&
                                    e.fkTargetId != target &&
                                    e.fkSenderId != target &&
                                    e.fkTargetId != session.userId
                                )
                            }
                        )
                        break
                }
            }
            // TODO: this only updates the layout but not the page on users it does not update but in
            invalidateAll()
            // goto(page.url.href, { invalidateAll: true })
            goto('/home', { invalidateAll: true })
            // replaceState(page.url, {})
        } catch (error) {
            console.error('e', error)
        }
    }
</script>

<button
    id="header-friends-dropdown"
    class="btn"
    onclick={toggleDropdown}
    aria-expanded={isDropdownOpen}
    aria-haspopup="true"
>
    {#if session?.friendRequests.filter((e) => {
        return e.fkSenderId != session.userId
    }).length > 0}
        {session.friendRequests.filter((e) => {
            return e.fkSenderId != session.userId
        }).length}
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
    <!-- TODO: position this under the button, or somewhere else that looks nice -->
    <div
        role="menu"
        class="relative left-0 z-10 mt-2 w-32 origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-auto"
    >
        <div role="none" class="py-1">
            {#if friendRequests.length > 0}
                Friend requests:
            {/if}
            {#each friendRequests as option, index}
                <div role="none" class="flex w-full justify-between">
                    <a
                        href={`/users/${option.fkSenderId}`}
                        id="menu-item-{index}"
                        role="menuitem"
                        tabindex="-1"
                        onclick={option.value}
                        class="flex w-full justify-between text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        data-sveltekit-reload
                    >
                        {option.name}
                    </a>
                    <div role="none" class="flex">
                        <button
                            aria-label="accept"
                            class="hover:bg-green-300 hover:text-gray-900"
                            onclick={() => {
                                friendAPI(option.fkSenderId, 'POST', 'accept')
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="-3 -3 30 30"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="size-6"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="m4.5 12.75 6 6 9-13.5"
                                />
                            </svg>
                        </button>

                        <button
                            aria-label="deny"
                            class="hover:bg-red-300 hover:text-gray-900"
                            onclick={() => {
                                friendAPI(option.fkSenderId, 'DELETE')
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="-3 -3 30 30"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="size-6"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M6 18 18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            {/each}
            {#if yourRequests.length > 0}
                Your requests:
            {/if}
            {#each yourRequests as option, index}
                <div role="none" class="flex w-full justify-between">
                    <a
                        href={`/users/${option.fkTargetId}`}
                        id="menu-item-{index}"
                        role="menuitem"
                        tabindex="-1"
                        onclick={option.value}
                        class="flex w-full justify-between text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        data-sveltekit-reload
                    >
                        {option.name}
                    </a>
                    <button
                        onclick={() => {
                            friendAPI(option.fkTargetId, 'DELETE')
                        }}
                        aria-label="deny"
                        class="hover:bg-red-300 hover:text-gray-900"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="-3 -3 30 30"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="size-6"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M6 18 18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
            {/each}
            Friends:
            {#each session.friend as option, index}
                <a
                    href={`/users/${option.fkUser2}`}
                    id="menu-item-{index}"
                    role="menuitem"
                    tabindex="-1"
                    onclick={option.value}
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    data-sveltekit-reload
                >
                    {option.name}
                </a>
            {:else}
                <br />
                No friends, add some
            {/each}
        </div>
    </div>
{/if}
