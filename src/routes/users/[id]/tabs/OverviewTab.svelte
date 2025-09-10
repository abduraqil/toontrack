<script lang="ts">
    import { marked } from 'marked'
    import DOMPurify from 'dompurify'

    export let userPage: any
</script>

<div class="space-y-4">
    <div class="prose max-w-none">
        {#if userPage.description}
            {@html DOMPurify.sanitize(marked(userPage.description))}
        {:else}
            No description available.
        {/if}
    </div>
</div>
