<script lang="ts">
    export let cartoon: any;
</script>

<div class="space-y-4">
    <div class="prose max-w-none">
        {cartoon.description || "No description available."}
    </div>
</div>