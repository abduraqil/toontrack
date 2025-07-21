<script lang="ts">
	export let cartoon: any;
	
	import {writable} from 'svelte/store';
	let isDropdownOpen = false;
	let currentSort = 'Date';
	let isAscending = false; // false = descending (newest first), true = ascending (oldest first)
	
	const sortOptions = [
		{ label: 'Date', value: 'date' },
		{ label: 'Score', value: 'score' },
		{ label: 'Name', value: 'name' }
	];
	

	let expanded = new Set<number>();
	function toggleExpand(id: number) {
		const newSet = new Set(expanded);
		if (newSet.has(id)) {
			newSet.delete(id);
		} else {
			newSet.add(id);
		}
		expanded = newSet;
	}
	
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
			const aDate = new Date(a.created).getTime();
			const bDate = new Date(b.created).getTime();
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
		{#if cartoon.reviews && cartoon.reviews.length > 0}
			<div class="flex items-center gap-2">
				<div class="flex items-center gap-2 pb-3.5">
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
								px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-purple-50"
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
						px-2 py-2 text-sm font-semibold text-gray-900  hover:bg-gray-50"
					>
						{#if isAscending}
							<!-- Up Arrow (Ascending) -->
							<svg 
								xmlns="http://www.w3.org/2000/svg" fill="none" 
								viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
								class="size-6 stroke-purple-600">
								<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
							</svg>
						{:else}
							<!-- Down Arrow (Descending) -->
							<svg 
								xmlns="http://www.w3.org/2000/svg" 
								fill="none" viewBox="0 0 24 24" stroke-width="1.5" 
								stroke="currentColor" class="size-6 stroke-purple-600">
								<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
							</svg>

						{/if}
					</button>
				</div>
				<!-- Add/Edit Review Button -->
				<div class="flex ml-auto">
					<button 
						type="button"
						aria-label="Add or edit review"
						class="inline-flex items-center justify-center rounded-md bg-white 
						px-2 py-2 text-sm font-semibold text-gray-900  hover:bg-purple-50">
						<svg
							xmlns="http://www.w3.org/2000/svg" 
							fill="none" 
							viewBox="0 0 24 24" stroke-width="1.5" 
							stroke="currentColor" class="size-6 stroke-purple-600">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
						</svg>
						<p>Add Review</p>
					</button>
				</div>
			</div>
			
			{#if cartoon.reviews}
				{#each sortedReviews as review}
					<div class="mb-8">
						<div class="bg-white border-l-4 border-purple-500 pl-6 pr-6 py-6 shadow-sm hover:bg-purple-50 transition-colors duration-200">
							<div class="flex items-start justify-between mb-4">
								<div>
									<h3 class="text-xl font-semibold text-gray-900">{review.user.name}</h3>
									<div class="flex items-center mt-1">
										<div class="flex text-yellow-400">
											<svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
												<path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
											</svg>
										</div>
										<span class="ml-2 text-sm font-medium text-gray-600">{review.score} / 10</span>
									</div>
								</div>
								<span class="text-xs text-gray-400 uppercase tracking-wider">{new Date(review.created).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })}</span>
							</div>
							<p class="text-gray-700 text-lg leading-relaxed">
								{#if review.review.length > 300}
									{#if expanded.has(review.id)}
										{review.review}
										<button
											class="ml-2 text-purple-600 underline text-sm cursor-pointer"
											on:click={() => toggleExpand(review.id)}
										>
											View Less
										</button>
									{:else}
										{review.review.slice(0, 300)}...
										<button
											class="ml-2 text-purple-600 underline text-sm cursor-pointer"
											on:click={() => toggleExpand(review.id)}
										>
											View More
										</button>
									{/if}
								{:else}
									{review.review}
								{/if}
							</p>
						</div>
					</div>
				{/each}
			{:else}
				<p>No reviews available for this cartoon.</p>
			{/if} 
		{:else}
			<div class="bg-gray-50 rounded-lg p-8 text-center">
                <div class="text-gray-400 mb-2">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mx-auto h-10 w-10">
						<path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
					</svg>
                </div>
                <p class="text-gray-600 text-lg">No reviews yet. Be the first to review!</p>
            </div>
		{/if}
	</div>
</div>