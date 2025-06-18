<script lang="ts">
	import '../app.css';
	import { enhance } from "$app/forms";
	import { page } from '$app/state';
	let { children } = $props();

	const user = $derived(page.data.user);
</script>

<nav class="bg-gray-900 text-white">
	<div class="container mx-auto px-4 py-2">
		<div class="flex items-center justify-between h-16">
			<!-- Left Side - Logo/Home Page? -->
			 
			<a href="/" aria-current={page.url.pathname === '/'}>
				Home
			</a>
			{#if user}
				<!-- If user is logged in, show username -->
				<form method="POST" action="/login?/logout" use:enhance  class="inline">
					<button type="submit" class="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
						Sign Out
					</button>
				</form>
			{:else}

			<!-- Right Side, Login/signup? -->
			 <div class="space-x-4">
				<a href="/login" aria-current={page.url.pathname === '/login'}>
					Login
				</a>
				<a class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded" href="/signup" aria-current={page.url.pathname === '/signup'}>
					Sign Up
				</a>
			</div>
			{/if}
		</div>
	</div>
</nav>


{@render children()}