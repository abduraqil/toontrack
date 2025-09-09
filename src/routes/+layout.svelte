<script lang="ts">
    import '../app.css'
    import { enhance } from '$app/forms'
    import { page } from '$app/state'
    let { children } = $props()

    const user = $derived(page.data.user)

    let theme = $state(
        typeof window !== 'undefined' &&
            window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
    )

    $effect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-theme', theme)
            localStorage.setItem('theme', theme)
        }
    })

    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('theme')
        if (saved) theme = saved
    }
</script>

<!--
TODO
- Update href links
-->

<div class="h-screen flex flex-col">
    <nav class="bg-base-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div class="flex items-center">
                <!-- Left: Logo -->
                <div class="mr-4">
                    <a
                        href="/"
                        class="font-semibold text-lg"
                        aria-current={page.url.pathname === '/'}>ToonTrack</a
                    >
                </div>

                <!-- Center: Search (centers within the same page container) -->
                <div class="flex-1 flex justify-center">
                    <a
                        class="btn btn-primary hover:btn-info"
                        href="/search/cartoons"
                        aria-label="Search"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-6 h-6 mr-2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                            />
                        </svg>
                        Search
                    </a>
                </div>

                <!-- Right: Auth + toggle -->
                <div class="flex items-center space-x-2 ml-4">
                    {#if user?.id}
                        <a href="/users/{user.id}" class="btn">
                            {user.name}
                        </a>
                        <form
                            method="POST"
                            action="/login?/logout"
                            use:enhance
                            class="inline"
                        >
                            <button class="btn btn-error">Sign Out</button>
                        </form>
                    {:else}
                        <a
                            href="/signup"
                            class="btn btn-secondary"
                            data-sveltekit-replacestate
                            aria-current={page.url.pathname === '/signup'}
                            >Sign Up</a
                        >
                        <a
                            href="/login"
                            class="btn btn-primary"
                            data-sveltekit-replacestate
                            aria-current={page.url.pathname === '/login'}
                            >Log in</a
                        >
                    {/if}

                    <!-- toggle -->
                    <label
                        class="swap swap-rotate text-base-content p-1 rounded cursor-pointer {theme ===
                        'dark'
                            ? 'swap-active'
                            : ''}"
                    >
                        <!-- Light icon -->
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="swap-off size-6"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                            />
                        </svg>

                        <!-- Dark icon -->
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="swap-on size-6"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                            />
                        </svg>

                        <input
                            type="checkbox"
                            onchange={(e) =>
                                (theme = e.currentTarget.checked
                                    ? 'dark'
                                    : 'light')}
                            checked={theme === 'dark'}
                        />
                    </label>
                </div>
            </div>
        </div>
    </nav>

    <main class="flex-1">
        {@render children()}
    </main>

    <footer class="bg-base-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <footer class="footer sm:footer-horizontal p-10">
                <nav>
                    <h6 class="footer-title">Search</h6>
                    <a href="/search/cartoons" class="link link-hover"
                        >Cartoons</a
                    >
                    <a href="/search/staff" class="link link-hover">Staff</a>
                    <a href="/search/companies" class="link link-hover"
                        >Companies</a
                    >
                    <a href="/search/characters" class="link link-hover"
                        >Characters</a
                    >
                </nav>
                <nav>
                    <h6 class="footer-title">Company</h6>
                    <a href="/search/cartoons" class="link link-hover"
                        >About Us</a
                    >
                    <a href="/search/cartoons" class="link link-hover"
                        >Contact</a
                    >
                </nav>
                <nav>
                    <h6 class="footer-title">Legal</h6>
                    <a href="/search/cartoons" class="link link-hover"
                        >Terms of Use</a
                    >
                    <a href="/search/cartoons" class="link link-hover"
                        >Privacy Policy</a
                    >
                    <a href="/search/cartoons" class="link link-hover"
                        >Cookie Policy</a
                    >
                </nav>
            </footer>
            <div
                class="
                    footer sm:footer-horizontal footer-center
                    bg-base-300 text-base-content p-4"
            >
                <aside>
                    <p>
                        Presentation of any work on this site is not an
                        endorsement of its content
                    </p>
                    <p>
                        Copyright © {new Date().getFullYear()} - All right reserved
                        by ToonTrack
                    </p>
                </aside>
            </div>
        </div>
    </footer>
</div>
