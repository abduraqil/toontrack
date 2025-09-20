<script lang="ts">
    import type { LayoutProps } from './$types'
    let { data }: LayoutProps = $props()

    let form = {
        name: data.cartoon.name,
        description: data.cartoon.description,
        coverPic: data.cartoon.coverPic,
        seasons: data.cartoon.seasons,
        episodes: data.cartoon.episodes,
        duration: data.cartoon.duration,
        status: data.cartoon.status,
        airStart: data.cartoon.airStart,
        airEnd: data.cartoon.airEnd,
        ageRating: data.cartoon.ageRating,
        links: data.cartoon.links,
    }

    // $effect(() => {
    //     console.log(data.cartoon.types[0])
    // })

    // function handleInput (e: Event) {
    //   // form[e.target.name] = e.target.value;
    // }
    //
    // const handleSubmit = async () => {
    //   try {
    //     await fetchFormAction('/cartoon/insert', {
    //       method: 'POST',
    //       body: JSON.stringify(form),
    //       headers: {
    //         'Content-Type': 'application/json'
    //       }
    //     });
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };
</script>

<svelte:head>
    <title>Edit {form.name} - ToonTrack</title>
</svelte:head>

<div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
    <form
        method="POST"
        class="bg-base-300 white shadow-lg rounded-lg w-full max-w-md"
    >
        <h2 class="text-base-content text-2xl font-semibold text-center mt-6">
            Edit {form.name}
        </h2>

        <label for="name">Name:</label>
        <input
            type="text"
            id="name"
            name="name"
            placeholder="name"
            maxLength="100"
            minLength="5"
            required
            class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm
				 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
            value={form.name}
        />

        <label for="editorMessage">What is the reason for your edit:</label>
        <textarea
            id="editorMessage"
            name="editorMessage"
            placeholder="What is the reason for your edit."
            maxLength="1000"
            minLength="10"
            rows="2"
            required
            class="w-full px-4 py-3 field-sizing-content text-sm font-medium text-gray-700 bg-white rounded-md focus:outline-none focus:ring-gray-300 transition-colors duration-200"
        ></textarea>

        <label for="description">Description:</label>
        <textarea
            id="description"
            name="description"
            placeholder="Cartoon description."
            maxLength="4000"
            rows="5"
            required
            class="w-full px-4 py-3 field-sizing-content text-sm font-medium text-gray-700 bg-white rounded-md focus:outline-none focus:ring-gray-300 transition-colors duration-200"
            >{form.description}</textarea
        >

        <label for="coverPic">Cover Picture:</label>
        <input
            type="text"
            id="coverPic"
            name="coverPic"
            placeholder="coverPic"
            maxLength="300"
            class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm
				 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
            value={form.coverPic}
        />
        <div
            class="w-70 h-80 flex items-center justify-center relative -mt-20 z-10 rounded-lg"
        >
            <img
                src={form.coverPic ? form.coverPic : '/nocover.jpg'}
                alt={form.name}
                class="object-contain rounded-lg shadow-lg"
            />
        </div>

        {#if !data.cartoon.types[0].name.includes('film')}
            <label for="seasons">Seasons:</label>
            <input
                type="number"
                id="seasons"
                name="seasons"
                placeholder="none"
                max="65"
                class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm
				 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
                value={form.seasons}
            />

            <label for="episodes">Episodes:</label>
            <input
                type="number"
                id="episodes"
                name="episodes"
                placeholder="episodes"
                max="3500"
                class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm
				 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
                value={form.episodes}
            />
        {/if}

        <label for="duration">Duration (episodes/film length):</label>
        <input
            type="number"
            id="duration"
            name="duration"
            placeholder="duration"
            max="4500"
            min="1"
            class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm
				 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
            value={form.duration}
        />

        <label for="status">Status:</label>
        <select
            name="status"
            id="status"
            class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm
				 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
        >
            <option selected value={0}>Unknown</option>
            <option value={1}>Planned</option>
            <option value={2}>In Progress</option>
            <option value={3}>Completed</option>
            <option value={4}>Halted</option>
            <option value={5}>Canceled</option>
            <option value={6}>Unreleased</option>
        </select>

        {#if !data.cartoon.types[0].name.includes('film')}
            <label for="airStart">Air Start:</label>
        {:else}
            <label for="airStart">Release:</label>
        {/if}
        <input
            type="date"
            id="airStart"
            name="airStart"
            placeholder="airStart"
            min="1915-01-01"
            class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm
				 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
            value={form.airStart?.toISOString().split('T')[0]}
        />

        {#if !data.cartoon.types[0].name.includes('film')}
            <label for="airEnd">Air End:</label>
            <input
                type="date"
                id="airEnd"
                name="airEnd"
                placeholder="air end"
                min="1916-01-01"
                class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm
				 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
                value={form.airEnd?.toISOString().split('T')[0]}
            />
        {/if}

        <label for="ageRating">Age Rating:</label>
        <input
            type="text"
            id="ageRating"
            name="ageRating"
            placeholder="age rating"
            maxLength="100"
            minLength="1"
            class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm
				 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
            value={form.ageRating}
        />

        <label for="links">Links:</label>
        <input
            type="text"
            id="links"
            name="links"
            placeholder="links"
            maxLength="500"
            minLength="1"
            class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm
				 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
            value={form.links}
        />

        <div class="pt-2">
            <button type="submit" class="btn btn-primary hover:btn-info end">
                Post
            </button>
        </div>
    </form>
</div>
