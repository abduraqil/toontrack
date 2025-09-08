<script lang="ts">
    import { page } from '$app/state'

    // props
    const {
        itemId,
        itemType = 'unknown',
        isFavorited = false,
        onFavorite = () => {},
    } = $props<{
        itemId: string | number
        itemType?: 'cartoon' | 'character' | 'staff' | 'unknown'
        isFavorite?: boolean
        onFavorite?: (event: {
            success: boolean
            isFavorited?: boolean
            error?: string
            itemId: string | number
            itemType: string
        }) => void
    }>()

    let localFavorited = $state(isFavorited)
    let isSubmitting = $state(false)

    $effect(() => {
        localFavorited = isFavorited
    })

    const detectedType = $derived(
        itemType !== 'unknown' ? itemType : detectType(page.url.pathname)
    )

    function detectType(pathname: string | null): string {
        if (!pathname) return 'unknown'
        if (pathname.includes('/cartoon/')) return 'cartoon'
        if (pathname.includes('/character/')) return 'character'
        if (pathname.includes('/staff/')) return 'staff'

        return 'unknown'
    }

    async function handleFavorite() {
        if (isSubmitting) return // Prevent multiple submissions

        const previousState = localFavorited
        localFavorited = !localFavorited
        isSubmitting = true

        try {
            const response = await fetch('/api/favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    itemId: itemId,
                    itemType: detectedType,
                    favorite: !isFavorited,
                }),
            })

            if (response.ok) {
                onFavorite({
                    success: true,
                    isFavorited: localFavorited,
                    itemId,
                    itemType: detectType,
                })
            } else {
                // revert
                localFavorited = previousState
                const errorData = await response.json()
                onFavorite({
                    success: false,
                    error: errorData.error || 'Failed to toggle favorite',
                    itemId,
                    itemType: detectType,
                })
            }
        } catch (error) {
            console.error('Failed to toggle favorite:', error)
            localFavorited = previousState
            onFavorite({
                success: false,
                error: 'error',
                itemId,
                itemType: detectedType,
            })
        } finally {
            isSubmitting = false
        }
    }
</script>

<button
    type="button"
    onclick={handleFavorite}
    class="
        inline-flex items-center justify-center
        w-10 h-10
        bg-base-100 border border-base-400 rounded
        text-base-content hover:text-red-500 hover:bg-red-50
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
        hover:scale-105
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-105
        {localFavorited ? 'text-red-500 bg-red-50' : ''}"
    aria-label={localFavorited ? 'Unfavorite' : 'Favorite'}
>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6"
    >
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
    </svg>
</button>
