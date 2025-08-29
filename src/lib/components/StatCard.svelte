<script lang="ts">
    export let title: string
    export let value: string | number
    export let subtitle: string = ''
    export let colorTheme: 'red' | 'green' | 'yellow'
    export let icon: 'heart' | 'arrow' | 'star'

    const colorClass = {
        red: 'from-red-500 to-red-600',
        green: 'from-green-500 to-green-600',
        yellow: 'from-yellow-500 to-yellow-600',
    }

    const textColorClass = {
        red: 'text-red-100',
        green: 'text-green-100',
        yellow: 'text-yellow-100',
    }

    const iconBgClasses = {
        red: 'bg-red-400',
        green: 'bg-green-400',
        yellow: 'bg-yellow-400',
    }

    const icons = {
        heart: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3c3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
        arrow: 'M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941',
        star: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
    }
</script>

<div
    class="bg-gradient-to-br {colorClass[
        colorTheme
    ]} text-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
>
    <div class="flex items-center justify-between">
        <div>
            <h3
                class="text-sm font-medium {textColorClass[
                    colorTheme
                ]} uppercase tracking-wide"
            >
                {title}
            </h3>
            <p class="text-3xl font-bold mt-1">{value}</p>
            {#if subtitle}
                <p class="text-sm {textColorClass[colorTheme]} mt-1">
                    {subtitle}
                </p>
            {/if}
        </div>
        <div class="{iconBgClasses[colorTheme]} bg-opacity-30 rounded-full p-3">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={icon === 'heart' ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-6 h-6"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d={icons[icon]}
                />
            </svg>
        </div>
    </div>
</div>
