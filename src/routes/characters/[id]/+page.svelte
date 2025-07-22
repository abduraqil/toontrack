<script lang="ts">
	import Favorite from '$lib/components/favorite.svelte';
	import StaffCredits from './tabs/StaffCreditsTab.svelte';

	import type { PageData } from './$types';
	export let data: PageData;

	 $: character = data.character;

	let activeTab = 'overview';

	const tabs = [
		{ id: 'credits', label: 'Credits', component: StaffCredits },
	];

	function setActiveTab(tab: string) {
		activeTab = tab;
	}

	$: currentTabData = tabs.find(tab => tab.id === activeTab) || tabs[0];

</script>

<svelte:head>
	<title>{character.name} - character Database</title>
	<meta name="description" content="{character.description || 'No description available.'}" />
</svelte:head>

<div class="min-h-screen bg-gray-100">
	<!-- Banner Section -->
	<div class="relative">
		<!-- Banner Background -->
		<div class="h-50 bg-gradient-to-r from-blue-900 to-purple-900 relative overflow-hidden">
			<!-- Optional: Add banner image here -->
		</div>

		<!-- White Content Area -->
		<div class="bg-white relative">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div class="flex flex-col lg:flex-row gap-8">
					<!-- Cover Image - positioned to overlap banner and white area -->
					<div class="flex-shrink-0 relative">
						<img
              src={character.coverPic ? character.coverPic : '/nocover.jpg'}
							alt={character.name}
							class="w-56 h-80 object-cover rounded-lg shadow-lg -mt-20 relative z-10"
						/>

						<!-- Action Buttons -->
						<div class="mt-4 space-y-3">
							<!--TODO: Add action buttons like add to watched, dropped, etc -->

							<!-- Favorite Button -->
							<Favorite></Favorite>
						</div>
					</div>

					<!-- character Information -->
					<div class="flex-1 space-y-6">
						<!-- Title and Basic Info -->
						<div class="space-y-4">
							<h1 class="text-4xl font-bold text-gray-900 leading-tight">{character.name}</h1>

							<!-- Tags/Badges -->
							<!-- <div class="flex flex-wrap items-center gap-3"> -->
							<div>
								{#if character.sex!== null}
									<span class="flex items-center gap-1">
										<b>Gender:</b>
										{#if character.sex == false}
											male
										{:else if character.sex == true}
											female
										{/if}
									</span>
								{/if}

								{#if character.birthday!== null}
									<span class="flex items-center gap-1">
										<b>Birthday:</b> {character.birthday.toDateString()}
									</span>
								{/if}
								{#if character.inception!== null}
									<span class="flex items-center gap-1">
										<b>First Appearance:</b> {character.inception.toDateString()}
									</span>
								{/if}

								{#if character.fkOriginalCreator !== null}
									<span class="flex items-center gap-1">
										<b>Creator:</b>
                    <a href="/staff/{character.fkOriginalCreator}">{character.originalCreator}</a>
									</span>
								{/if}
							</div>
						</div>

						<!-- Description -->
						{#if character.description != null}
							<div class="space-y-2">
								<h3 class="text-lg font-semibold text-gray-900">Description</h3>
								<p class="text-gray-700 leading-relaxed">{character.description}</p>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Detailed Information -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
			<!-- Right Content Area -->
			<div class="lg:col-span-4 space-y-6" >
				<!-- Navigation Tabs -->
				 <!-- <div class="bg-white rounded-lg shadow-md"> -->
					<!-- Tab Navigation -->
					<!-- <div class="flex justify-center border-b border-gray-200"> -->
					<!-- 	{#each tabs as tab} -->
					<!-- 		<button -->
					<!-- 			class=" -->
					<!-- 				px-6 py-3 text-sm font-medium border-b-2 transition-colors duration-200 -->
					<!-- 				{activeTab === tab.id ? 'border-purple-600 text-purple-700 bg-blue-50' -->
					<!-- 				 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}" -->
					<!-- 			type="button" -->
					<!-- 			on:click={() => setActiveTab(tab.id)} -->
					<!-- 		> -->
					<!-- 			{tab.label} -->
					<!-- 		</button> -->
					<!-- 	{/each} -->
					<!-- </div> -->
					<!-- </div> -->
				 <!-- Tab Content -->
				<div class="bg-white rounded-lg shadow-md p-6 pt-6 mt-4">
					<svelte:component this={currentTabData.component} {character}/>
				</div>
			</div>
		</div>
	</div>
</div>
