<script lang="ts">
	import '../app.css';
	import { enhance } from "$app/forms";
	import { page } from '$app/state';
  import Search from '$lib/components/search.svelte';
	let { children } = $props();

	const user = $derived(page.data.user);
</script>

<!--
TODO
- Change the icon to use props in svelte
- add svgs, maybe it should be a dropdown for multiple themes
-->

<nav class="navbar justify-between bg-base-300 px-46 py-3">
	<!-- Logo -->
	<a href="/" aria-current={page.url.pathname === '/'}>
		Home
	</a>
	
	<!-- Menu for Mobile -->

	<!-- Menu for Desktop -->
	 <ul class="hidden menu sm:menu-horizontal gap-2">


		<!-- Middle -->
		<li class="flex-1 flex justify-center">
			<a
				class="btn btn-primary hover:btn-info"
				href="/search/cartoons"
    			aria-label="Search"
			>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
				</svg>
				Search
			</a>
		</li>


		<!-- If Logged In -->
		{#if user}
			<form method="POST" action="/login?/logout" use:enhance  class="inline">
				<button class="btn btn-error">Sign Out</button>
			</form>
		{:else}
		<a 
			href="/signup" 
			class="btn btn-secondary"
			aria-current={page.url.pathname === '/signup'}>
			Sign Up
		</a>
		<a
			href="\login"
			class="btn btn-primary"
			aria-current={page.url.pathname === '/login'}>
			Log in
		</a>
		{/if}
	 </ul>
	<!-- <input
		type="checkbox"
		class="toggle"
		onchange="{(e) => {
			const target = e.target as HTMLInputElement | null;
			document.documentElement.setAttribute(
				'data-theme',
				target && target.checked ? 'dark' : 'light'
			);
		}}"
		checked={document.documentElement.getAttribute('data-theme') === 'dark'}
		aria-label="Toggle dark mode"
	/> -->
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
