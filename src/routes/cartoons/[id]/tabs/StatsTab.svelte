<script lang="ts">
	export let cartoon: any;
	import StatCard from "$lib/components/StatCard.svelte";

	$: stats =
		cartoon.stats && cartoon.stats.length > 0 ? cartoon.stats[0] : null;
	let review = cartoon.reviews;
	$: review = cartoon.reviews;

	const statCards = [
		{
			title: "Favorites",
			getValue: "favorites",
			subtitle: stats ? stats.favorites.toLocaleString() : "",
			colorTheme: "red",
			icon: "heart",
		},
		{
			title: "Popularity",
			getValue: "popularity",
			subtitle: stats ? stats.popularity.toLocaleString() : "",
			colorTheme: "green",
			icon: "arrow",
		},
		{
			title: "Average Score",
			getValue: "score",
			subtitle: stats ? `${stats.score.toLocaleString()}/10` : "",
			colorTheme: "yellow",
			icon: "star",
		}
	] as const;
</script>

<!-- Display Information
-[ RECORD 1 ]-+------------------------------
fk_cartoon_id | 53093
score         | 9
ranked        | 12
popularity    | 250000
members       | 500000
favorites     | 45000
created       | 2025-07-18 23:28:06.593796+00
edited        | 2025-07-18 23:28:06.593796+00
-->

<div>
	{#if stats}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-9">
			{#each statCards as card}
				<StatCard
					title={card.title}
					value={stats[card.getValue]}
					subtitle={card.subtitle || ""}
					colorTheme={card.colorTheme}
					icon={card.icon}
				/>
			{/each}
		</div>
	{:else}
		<!-- No Stats Available -->
		<div class="bg-gray-50 rounded-lg p-8 text-center">
			<div class="text-gray-400 mb-2">
				<div class="flex justify-center items-center mb-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-16 h-16 text-gray-300"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
						/>
					</svg>
				</div>
			</div>
			<p class="text-gray-600 text-lg">
				No stats available.
			</p>
		</div>
	{/if}
</div>
