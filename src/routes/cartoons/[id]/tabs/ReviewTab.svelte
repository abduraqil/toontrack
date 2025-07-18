<script lang="ts">
	export let cartoon: any;
</script>

<div class="space-y-4">
	<div class="prose max-w-none">
		{#if cartoon.reviews}
			{#each cartoon.reviews as review}
				<div class="space-y-2 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
    <div class="flex items-center space-x-3">
        <h3 class="text-lg font-bold text-gray-800">{review.user.name}</h3>
        <span class="text-yellow-500 flex items-center">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
            <span class="ml-1 font-semibold">{review.score}</span>
        </span>
    </div>
    <div class="rounded-md bg-gray-50 px-4 py-3 border border-gray-100 shadow-inner">
        <p class="text-gray-700 italic">{review.review}</p>
    </div>
    <div class="flex justify-between items-center text-sm text-gray-500">
        <p>Reviewed on: {new Date(review.createdAt).toLocaleDateString()}</p>
    </div>
</div>

			{/each}
		{:else}
			<p>No reviews available for this cartoon.</p>
		{/if} 
	</div>
</div>
