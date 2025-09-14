<script lang="ts">
    import { marked } from 'marked'
    import DOMPurify from 'dompurify'

    export let userPage: any
</script>

<div class="space-y-8">
    <div class="space-y-4">
        <h3
            class="text-xl font-semibold text-base-content flex items-center justify-between"
        >
            Favorite Cartoons
            <span class="text-sm font-normal text-base-content/70"
                >({userPage.userCartoonFavorites?.length || 0})</span
            >
        </h3>
        {#if userPage.userCartoonFavorites.length > 0}
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {#each userPage.userCartoonFavorites as favorite}
                    <div
                        class="card w-40 bg-base-100 shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-primary/30"
                    >
                        <figure class="px-2 pt-3">
                            <img
                                src={favorite.cartoon.coverPic ||
                                    '/nocover.jpg'}
                                alt={favorite.cartoon.name}
                                class="w-full h-40 object-contain rounded-md transition-all duration-300"
                            />
                        </figure>
                        <div
                            class="card-body p-2 bg-gradient-to-t from-primary/5 to-transparent"
                        >
                            <a
                                href={`/cartoons/${favorite.fkCartoonId}`}
                                data-sveltekit-reload
                                class="card-title text-xs text-center hover:text-primary transition-colors block font-semibold text-base-content hover:bg-primary/10 rounded-lg py-1 px-2"
                            >
                                {favorite.cartoon.name}
                            </a>
                        </div>
                    </div>
                {/each}
            </div>
        {:else}
            <div class="text-center py-8 bg-base-200 rounded-lg">
                <p class="text-base-content/70">No favorite cartoons yet!</p>
            </div>
        {/if}
    </div>

    <!-- Character Favorites -->
    <div class="space-y-4">
        <h3
            class="text-xl font-semibold text-base-content flex items-center justify-between"
        >
            Favorite Characters
            <span class="text-sm font-normal text-base-content/70"
                >({userPage.userCharacterFavorites?.length || 0})</span
            >
        </h3>
        {#if userPage.userCharacterFavorites?.length > 0}
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {#each userPage.userCharacterFavorites as favorite}
                    <div
                        class="card w-40 bg-base-100 shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-primary/30"
                    >
                        <figure class="px-2 pt-3">
                            <img
                                src={favorite.character.coverPic ||
                                    '/nocover.jpg'}
                                alt={favorite.character.name}
                                class="w-full h-40 object-contain rounded-md transition-all duration-300"
                            />
                        </figure>
                        <div
                            class="card-body p-2 bg-gradient-to-t from-primary/5 to-transparent"
                        >
                            <a
                                href={`/characters/${favorite.fkCharacterId}`}
                                data-sveltekit-reload
                                class="card-title text-xs text-center hover:text-primary transition-colors block font-semibold text-base-content hover:bg-primary/10 rounded-lg py-1 px-2"
                            >
                                {favorite.character.name}
                            </a>
                        </div>
                    </div>
                {/each}
            </div>
        {:else}
            <div class="text-center py-8 bg-base-200 rounded-lg">
                <p class="text-base-content/70">No favorite characters yet!</p>
            </div>
        {/if}
    </div>

    <!-- Staff Favorites -->
    <div class="space-y-4">
        <h3
            class="text-xl font-semibold text-base-content flex items-center justify-between"
        >
            Favorite Staff
            <span class="text-sm font-normal text-base-content/70"
                >({userPage.userStaffFavorites?.length || 0})</span
            >
        </h3>
        {#if userPage.userStaffFavorites?.length > 0}
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {#each userPage.userStaffFavorites as favorite}
                    <div
                        class="card w-40 bg-base-100 shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-primary/30"
                    >
                        <figure class="px-2 pt-3">
                            <img
                                src={favorite.staff.coverPic ||
                                    '/nocover.jpg'}
                                alt={favorite.staff.name}
                                class="w-full h-40 object-contain rounded-md transition-all duration-300"
                            />
                        </figure>
                        <div
                            class="card-body p-2 bg-gradient-to-t from-primary/5 to-transparent"
                        >
                            <a
                                href={`/staff/${favorite.fkStaffId}`}
                                data-sveltekit-reload
                                class="card-title text-xs text-center hover:text-primary transition-colors block font-semibold text-base-content hover:bg-primary/10 rounded-lg py-1 px-2"
                            >
                                {favorite.staff.name}
                            </a>
                        </div>
                    </div>
                {/each}
            </div>
        {:else}
            <div class="text-center py-8 bg-base-200 rounded-lg">
                <p class="text-base-content/70">No favorite staff yet!</p>
            </div>
        {/if}
    </div>

    <!-- Favorite Companies -->
    <div class="space-y-4">
        <h3
            class="text-xl font-semibold text-base-content flex items-center justify-between"
        >
            Favorite Companies
            <span class="text-sm font-normal text-base-content/70"
                >({userPage.userCompanyFavorites?.length || 0})</span
            >
        </h3>
        {#if userPage.userCompanyFavorites?.length > 0}
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {#each userPage.userCompanyFavorites as favorite}
                    <div
                        class="card w-40 bg-base-100 shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-primary/30"
                    >
                        <figure class="px-2 pt-3">
                            <img
                                src={favorite.company.coverPic ||
                                    '/nocover.jpg'}
                                alt={favorite.company.name}
                                class="w-full h-40 object-contain rounded-md transition-all duration-300"
                            />
                        </figure>
                        <div
                            class="card-body p-2 bg-gradient-to-t from-primary/5 to-transparent"
                        >
                            <a
                                href={`/companies/${favorite.fkCompanyId}`}
                                data-sveltekit-reload
                                class="card-title text-xs text-center hover:text-primary transition-colors block font-semibold text-base-content hover:bg-primary/10 rounded-lg py-1 px-2"
                            >
                                {favorite.company.name}
                            </a>
                        </div>
                    </div>
                {/each}
            </div>
        {:else}
            <div class="text-center py-8 bg-base-200 rounded-lg">
                <p class="text-base-content/70">No favorite companies yet!</p>
            </div>
        {/if}
    </div>

</div>
