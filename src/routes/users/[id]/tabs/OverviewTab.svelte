<script lang="ts">
    import { marked } from 'marked'
    import DOMPurify from 'dompurify'

    $: latestCartoons =
        userPage?.userCartoonHistory
            ?.filter((entry: any) => entry.edited) // filter out cartoons that dont have edited value
            .sort(
                (a: any, b: any) =>
                    new Date(b.edited).getTime() - new Date(a.edited).getTime()
            ) //sort by edited desc,
            .slice(0, 5) || // only grab first 5
        []

    $: statusData = calculateStatusDistribution(
        userPage?.userCartoonHistory || []
    )
    $: statusDistribution = statusData.distribution
    $: totalRewatched = statusData.totalRewatched
    $: totalCartoons = userPage?.userCartoonHistory?.length || 0

    // counts for each status
    $: completedCount =
        statusDistribution.find((s) => s.status === 2)?.count || 0
    $: watchingCount =
        statusDistribution.find((s) => s.status === 0)?.count || 0
    $: droppedCount = statusDistribution.find((s) => s.status === 5)?.count || 0
    $: onHoldCount = statusDistribution.find((s) => s.status === 3)?.count || 0
    $: planToWatchCount =
        statusDistribution.find((s) => s.status === 1)?.count || 0

    $: meanScore = (() => {
        const scores =
            userPage?.userCartoonHistory
                ?.map((entry: any) => entry.score)
                .filter((score: any) => score != null && !isNaN(score)) || []

        if (scores.length === 0) return 0
        return (
            scores.reduce((sum: number, score: number) => sum + score, 0) /
            scores.length
        )
    })()

    $: totalEpisodes =
        userPage?.userCartoonHistory?.reduce((total: number, entry: any) => {
            return total + (entry.episodes_watched || 0)
        }, 0) || 0

    $: daysWatched = (() => {
        let total = 0
        userPage?.userCartoonHistory?.forEach((e: any) => {
            total +=
                (1 + (e.rewatches || 0)) *
                (e.episodesWatched || 1) *
                (e.cartoon?.duration || 0)
        })
        // Convert minutes to days (60 min/hr * 24 hr/day)
        return Math.round((total / 60 / 24) * 100) / 100
    })()

    export let userPage: any

    const statusMap = {
        0: { name: 'Watching', color: 'bg-success' },
        1: { name: 'Planning', color: 'bg-gray-500' },
        2: { name: 'Completed', color: 'bg-info' },
        3: { name: 'Rewatching', color: 'bg-info' }, // Count as completed
        4: { name: 'Paused', color: 'bg-warning' },
        5: { name: 'Dropped', color: 'bg-error' },
    }

    function calculateStatusDistribution(cartoonHistory: any[]) {
        const statusCounts = {
            0: 0, // watching
            1: 0, // planning
            2: 0, // completed + rewatching
            3: 0, // paused
            5: 0, // dropped
        }

        let totalRewatched = 0

        cartoonHistory.forEach((entry: { status: number }) => {
            if (entry.status === 3) {
                // Count rewatching as completed but track separately
                statusCounts[2]++
                totalRewatched++
            } else if (statusCounts.hasOwnProperty(entry.status)) {
                statusCounts[entry.status as keyof typeof statusCounts]++
            }
        })

        const total = Object.values(statusCounts).reduce(
            (sum, count) => sum + count,
            0
        )

        const distribution =
            total === 0
                ? []
                : Object.entries(statusCounts)
                      .filter(([_, count]) => count > 0)
                      .map(([status, count]) => ({
                          status: parseInt(status),
                          count,
                          percentage: (count / total) * 100,
                          name: statusMap[
                              parseInt(status) as keyof typeof statusMap
                          ].name,
                          color: statusMap[
                              parseInt(status) as keyof typeof statusMap
                          ].color,
                      }))

        return { distribution, totalRewatched }
    }
</script>

<!--
Not sure if i should make it bg-base-100 or 300 for the box to stand out?
Cartoon List
-->
<div class="bg-base-100 text-base-content p-6 rounded-lg">
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-medium">Cartoon Stats</h2>
    </div>

    <!-- Days and Mean Score -->
    <div class="grid grid-cols-2 gap-15 mb-6">
        <div>
            <span class="text-base-content">Days:</span>
            <span class="text-base-content ml-2 font-medium">{daysWatched}</span
            >
        </div>
        <div>
            <span class="text-base-content">Mean Score:</span>
            <span class="text-base-content ml-2 font-medium"
                >{meanScore > 0 ? meanScore.toFixed(2) : 'N/A'}</span
            >
        </div>
    </div>

    <!-- Status Distribution Bar -->
    {#if totalCartoons > 0}
        <div class="mb-6">
            <div class="w-full rounded h-4 overflow-hidden mb-4">
                {#each statusDistribution as segment}
                    <div
                        class="{segment.color} h-full inline-block"
                        style="width: {segment.percentage}%"
                        title="{segment.name}: {segment.count} ({segment.percentage.toFixed(
                            1
                        )}%)"
                    ></div>
                {/each}
            </div>
        </div>
    {/if}

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 gap-y-3">
        <!-- Left Column - Status Counts -->
        <div class="space-y-3">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 bg-success rounded-full"></div>
                    <span class="text-base-content">Watching</span>
                </div>
                <span class="text-base-content">{watchingCount}</span>
            </div>

            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 bg-info rounded-full"></div>
                    <span class="text-base-content">Completed</span>
                </div>
                <span class="text-base-content">{completedCount}</span>
            </div>

            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 bg-warning rounded-full"></div>
                    <span class="text-base-content">On-Hold</span>
                </div>
                <span class="text-base-content">{onHoldCount}</span>
            </div>

            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 bg-error rounded-full"></div>
                    <span class="text-base-content">Dropped</span>
                </div>
                <span class="text-base-content">{droppedCount}</span>
            </div>

            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span class="text-base-content">Plan to Watch</span>
                </div>
                <span class="text-base-content">{planToWatchCount}</span>
            </div>
        </div>

        <!-- Right Column - Additional Stats -->
        <div class="space-y-3 pl-8">
            <div class="flex items-center justify-between">
                <span class="text-base-content">Total Entries</span>
                <span class="text-base-content">{totalCartoons}</span>
            </div>

            <!-- {#if totalRewatched > 0}
				<div class="flex items-center justify-between">
					<span class="text-base-content">Rewatched</span>
					<span class="text-base-content">{totalRewatched}</span>
				</div>
			{/if} -->

            <div class="flex items-center justify-between">
                <span class="text-base-content">Episodes</span>
                <span class="text-base-content">{totalEpisodes}</span>
            </div>
        </div>
    </div>
</div>

<!-- Cartoon Updates -->
<div class="space-y-4 p-6 rounded-lg">
    <div class="prose max-w-none">
        <h2 class="text-xl font-medium mb-4">Latest Cartoon Updates</h2>
        {#each latestCartoons as cartoon}
            <div>
                <div class="card card-side bg-base-100 shadow-sm mb-2">
                    <figure>
                        <img
                            src={cartoon.cartoon?.coverPic || '/nocover.jpg'}
                            alt={cartoon.cartoon?.name}
                            class="w-32 h-32 object-contain rounded-lg transition-all duration-300"
                            style="aspect-ratio: 1 / 1;"
                        />
                    </figure>
                    <div class="card-body">
                        <h3>{cartoon.cartoon?.name}</h3>
                        <div class="flex items-center gap-2 mt-2">
                            <div
                                class="w-3 h-3
                                {statusMap[
                                    cartoon.status as keyof typeof statusMap
                                ]?.color ?? 'bg-gray-300'} 
                                rounded-full"
                            ></div>
                            <span>
                                {statusMap[
                                    cartoon.status as keyof typeof statusMap
                                ]?.name ?? 'Unknown'}
                            </span>
                        </div>
                        <div class="ml-5 text-sm text-base-content/70">
                            Updated on {new Date(
                                cartoon.edited
                            ).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>
