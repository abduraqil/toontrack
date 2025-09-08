<script lang="ts">
    import { enhance } from '$app/forms'
    import { PASSWORD, USERNAME } from '$lib/constants/auth'
    import { page } from '$app/state'

    // Define the ActionData interface correctly here for use in this component
    interface ActionData {
        message?: string
        errors?: {
            general?: string
            username?: string
            password?: string
        }
        fields?: {
            username?: string
            reference?: string
        }
    }

    export let form: ActionData | undefined
    let reference = page.url.searchParams.get('reference')
    $: reference
</script>

<svelte:head>
    <title>ToonTrack - Login</title>
</svelte:head>

<div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
    <main
        class="bg-base-300 white shadow-lg rounded-lg w-full max-w-md overflow-hidden"
    >
        <h2 class="text-base-content text-2xl font-semibold text-center mt-6">
            Log in to Cartoon Chronicles
        </h2>

        <form method="POST" action="?/login" use:enhance class="p-6 space-y-6">
            <input
                type="text"
                id="reference"
                name="reference"
                value={reference}
                hidden
            />
            <!-- Username -->
            <div>
                <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Username"
                    maxLength={USERNAME.MAX_LENGTH}
                    minLength={USERNAME.MIN_LENGTH}
                    required
                    class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm
				 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
                    value={form?.fields?.username || ''}
                />
                {#if form?.errors?.username}
                    <p class="mt-1 text-sm text-red-600">
                        {form.errors.username}
                    </p>
                {/if}
            </div>

            <!-- Password -->
            <div>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    maxLength={PASSWORD.MAX_LENGTH}
                    minLength={PASSWORD.MIN_LENGTH}
                    required
                    class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm
				 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
                />
                {#if form?.errors?.password}
                    <p class="mt-1 text-sm text-red-600">
                        {form.errors.password}
                    </p>
                {/if}
            </div>

            {#if form?.errors?.general}
                <p class="mt-1 text-sm text-red-600">{form.errors.general}</p>
            {/if}

            <!-- Submit Button -->
            <div class="pt-2">
                <button
                    type="submit"
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm
				 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700
				 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Log In
                </button>
            </div>

            <!-- Signup Link -->
            <div class="text-center text-sm text-gray-600 pt-2">
                Don't have an account?
                <a
                    href="/signup"
                    class="font-medium text-blue-600 hover:text-blue-500"
                >
                    Sign up
                </a>
            </div>
        </form>
    </main>
</div>
