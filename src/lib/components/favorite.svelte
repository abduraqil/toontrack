<script lang="ts">
  import {page} from "$app/stores";
  import {createEventDispatcher} from "svelte";

  // props
  export let itemId: string | number;
  export let itemType: 
    "cartoon" | 
    "character" | 
    "staff" | 
    "unknown" = "unknown";
  export let isFavorite: boolean = false;

  const dispatch = createEventDispatcher();

  $: detectedType = itemType || detectType($page.params.routeId);

  function detectType(routeId: string | null): string {
    if (!routeId) return "unknown";
    if (routeId?.includes("cartoon")) return "cartoon";
    if (routeId?.includes("characters")) return "character";
    if (routeId?.includes("staff")) return "staff";
    return "unknown";
  }

  async function handleFavorite() {
    const favoriteData = {
      id: itemId,
      type: detectedType,
      action: isFavorite ? "remove" : "add"
    };

    try {
      const response = await fetch('/api/user-lists/favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartoonId: itemId,
          favorite: !isFavorite
        })
      });
      
      if (response.ok) {
        isFavorite = !isFavorite;
        // Dispatch event for parent component to handle any additional logic
        dispatch('favorite', { ...favoriteData, success: true, isFavorite });
      } else {
        console.error('Failed to toggle favorite');
        dispatch('favorite', { ...favoriteData, success: false, error: 'Failed to toggle favorite' });
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      dispatch('favorite', { ...favoriteData, success: false, error });
    }
  }
</script>

<button
  class="
        inline-flex items-center justify-center
        w-10 h-10
        bg-white border border-gray-300 rounded
        text-gray-500 hover:text-red-500 hover:bg-red-50
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
        hover:scale-105"
  aria-label="Favorite"
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
