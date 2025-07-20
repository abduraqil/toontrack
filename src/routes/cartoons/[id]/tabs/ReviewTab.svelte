<script lang="ts">
	export let cartoon: any;
	
	let isDropdownOpen = false;
	let currentSort = 'Date';
	let isAscending = false; // false = descending (newest first), true = ascending (oldest first)
	
	const sortOptions = [
		{ label: 'Date', value: 'date' },
		{ label: 'Score', value: 'score' },
		{ label: 'Name', value: 'name' }
	];
	
	function toggleDropdown() {
		isDropdownOpen = !isDropdownOpen;
	}
	
	function selectSort(option: typeof sortOptions[0]) {
		currentSort = option.label;
		isDropdownOpen = false;
	}

	
	function toggleSortOrder() {
		isAscending = !isAscending;
	}
	
	function handleClickOutside(event: MouseEvent) {
		const dropdown = document.getElementById('sort-dropdown');
		if (dropdown && !dropdown.contains(event.target as Node)) {
			isDropdownOpen = false;
		}
	}
	
	// Close dropdown when clicking outside
	if (typeof window !== 'undefined') {
		document.addEventListener('click', handleClickOutside);
	}

	$: sortedReviews = [...cartoon.reviews].sort((a, b) => {
		if (currentSort === 'Date') {
			const aDate = new Date(a.createdAt).getTime();
			const bDate = new Date(b.createdAt).getTime();
			return isAscending ? aDate - bDate : bDate - aDate;
		}
		if (currentSort === 'Score') {
			return isAscending ? a.score - b.score : b.score - a.score;
		}
		if (currentSort === 'Name') {
			const aName = a.user.name.toLowerCase();
			const bName = b.user.name.toLowerCase();
			if (aName < bName) return isAscending ? -1 : 1;
			if (aName > bName) return isAscending ? 1 : -1;
			return 0;
		}
		return 0;
	});

</script>

<div class="space-y-4">
	<div class="prose max-w-none">
		<div class="flex items-center gap-2">
			<div>
				<span class="text-sm font-medium text-gray-700">Sort by</span>
				<!-- Sort By Dropdown -->
				<div class="relative inline-block text-left" id="sort-dropdown">
					<div>
						<button 
							id="sort-button" 
							type="button" 
							on:click={toggleDropdown}
							aria-expanded={isDropdownOpen} 
							aria-haspopup="true" 
							aria-label="Sort reviews by"
							class="inline-flex items-center justify-center gap-x-1.5 rounded-md bg-white 
							px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
						>
							{currentSort}
							<svg 
								xmlns="http://www.w3.org/2000/svg" 
								fill="none" 
								viewBox="0 0 24 24" 
								stroke-width="1.5" 
								stroke="currentColor" 
								class="size-4 transition-transform duration-200 {isDropdownOpen ? 'rotate-180' : ''}"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
							</svg>
						</button>
					</div>
					
					{#if isDropdownOpen}
						<div 
							role="menu" 
							class="absolute left-0 z-10 mt-2 w-32 origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
						>
							<div role="none" class="py-1">
								{#each sortOptions as option, index}
									<button
										id="menu-item-{index}"
										role="menuitem"
										tabindex="-1"
										on:click={() => selectSort(option)}
										class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 
										{currentSort === option.label ? 'bg-gray-50 text-gray-900' : ''}"
									>
										{option.label}
									</button>
								{/each}
							</div>
						</div>
					{/if}
				</div>
				
				<!-- Sort Order Toggle Button -->
				<button 
					type="button" 
					on:click={toggleSortOrder}
					aria-label="Toggle sort order"
					title="{isAscending ? 'Ascending' : 'Descending'} order"
					class="inline-flex items-center justify-center rounded-md bg-white 
					px-2 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
				>
					{#if isAscending}
						<!-- Up Arrow (Ascending) -->
						<svg 
							xmlns="http://www.w3.org/2000/svg" fill="none" 
							viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
							class="size-6">
							<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
						</svg>
					{:else}
						<!-- Down Arrow (Descending) -->
						<svg 
							xmlns="http://www.w3.org/2000/svg" 
							fill="none" viewBox="0 0 24 24" stroke-width="1.5" 
							stroke="currentColor" class="size-6">
							<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
						</svg>

					{/if}
				</button>
			</div>
		</div>
		
		{#if cartoon.reviews}
			{#each sortedReviews as review}
				<div class="space-y-2 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
					<div class="flex items-center space-x-3">
						<h3 class="text-lg font-bold text-gray-800">{review.user.name}</h3>
						<span class="text-yellow-500 flex items-center">
							<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
							</svg>
							<span class="ml-1 font-semibold">{review.score}/10</span>
						</span>
					</div>
					<div class="rounded-md bg-gray-50 px-4 py-3 border border-gray-100 shadow-inner">
						<p class="text-gray-700 italic">{review.review}</p>
					</div>
					<div class="flex justify-between items-center text-sm text-gray-500">
						<p>Reviewed on: {new Date(review.created).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })}</p>
					</div>
				</div>
			{/each}
		{:else}
			<p>No reviews available for this cartoon.</p>
		{/if} 
	</div>
</div>