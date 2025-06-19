<script lang="ts">
    import type { PageData } from './$types';
    export let data: PageData;
    
     $: cartoon = data.cartoon;

</script>

<svelte class="head">

</svelte>

<div>
    <h1>{cartoon.name}</h1>
</div>