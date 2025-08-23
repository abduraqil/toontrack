<script lang="ts">
	import '../app.css';
	import { enhance } from "$app/forms";
	import { page } from '$app/state';
  import Search from '$lib/components/search.svelte';
	let { children } = $props();

	const user = $derived(page.data.user);
</script>

<nav id="page_top_nav" class="text-white" style="background-color: oklch(37.2% 0.044 257.287);">
	<div class="container mx-auto px-4 py-2">
		<div class="flex items-center justify-between h-16">
			<!-- Left Side - Logo/Home Page? -->

			<a href="/" aria-current={page.url.pathname === '/'}>
				Home
			</a>
      <Search></Search>
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

<nav id="page_bot_nav" class="text-white  bottom-0 flex justify-between px-4 py-2 bg-gray-200" style="background-color: oklch(37.2% 0.044 257.287);">
	<div class="container mx-auto px-4 py-2">
		<div class="flex items-center justify-between h-16">
			<!-- Left Side - Logo/Home Page? -->

			<a href="/" aria-current={page.url.pathname === '/'}>
      ToonTrack
			</a>

      <ul class="grid grid-cols-2 gap-y-0 gap-x-4">
      <li><b>Search:</b></li>
      <!-- <li></li> -->
      <li><a href="/search/cartoons">Cartoons</a></li>
      <li><a href="/search/staff">Staff</a></li>
      <li><a href="/search/characters">Characters</a></li>
      <li><a href="/search/companies">Companies</a></li>
      <li><a href="/search/users">Users</a></li>
      </ul>
			{#if user}
				<!-- If user is logged in, show username -->
				<form method="POST" action="/login?/logout" use:enhance  class="inline">
					<button type="submit" class="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
						Sign Out
					</button>
				</form>
			{:else}

			<!-- Right Side, Login/signup? -->
			<!--  <div class="space-x-4"> -->
			<!-- 	<a href="/login" aria-current={page.url.pathname === '/login'}> -->
			<!-- 		Login -->
			<!-- 	</a> -->
			<!-- 	<a class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded" href="/signup" aria-current={page.url.pathname === '/signup'}> -->
			<!-- 		Sign Up -->
			<!-- 	</a> -->
			<!-- </div> -->
			{/if}
		</div>
	</div>
</nav>
