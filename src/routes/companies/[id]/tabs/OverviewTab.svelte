<script lang="ts">
    export let company: any;
</script>

<div class="space-y-4">
    <div class="prose max-w-none">
        {company.description || "No description available."}
        <p>Overview test sentence</p>
    </div>
</div>
