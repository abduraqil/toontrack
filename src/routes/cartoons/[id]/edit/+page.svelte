<script lang="ts">
    import type { LayoutProps } from './$types'
    let { data }: LayoutProps = $props()
    /*
    data includes session, user, userReview and it should not
    */

    //    types      155
    //    languages  191
    //    countries  314
    //    tags       1259
    //    companies  2467
    //    characters 4775
    //    staff      16990

    export interface ActionData {
        errors?: {
            general?: string
        }
        editorMessage: string
        fields: {
            name: string
            description: string
            coverPic?: string
            seasons?: number
            episodes?: number
            duration?: number
            status?: number
            airStart?: Date
            airEnd?: Date
            ageRating?: string
            links?: string
            //jts: {
            jtCartoonsCartoonTypes?: [
                fkCartoonTypeId: number,
                score: number, // TODO: perhaps this should be modified elsewhere
            ]
            jtCartoonsLanguages?: [fkLanguageId: number, score: number]
            jtCartoonsCountries?: [fkCountryId: number]
            jtCartoonsTags?: [
                fkTagId: number,
                score: number, // TODO: perhaps this should be modified elsewhere
                spoiler: boolean,
            ]
            jtCartoonsCompanies?: [fkCompanyId: number, role: number]
            jtCartoonsCharacters?: [
                // TODO: problem, possibly too many to send over, might have to use a search feature
                credited: boolean,
                fkStaffId: number,
                fkCharacterId: number,
                fkLanguageId: number,
            ]
            jtCartoonsStaff?: [
                // TODO: problem, possibly too many to send over, might lag
                credited: boolean,
                fkLanguageId: number, // this should probably not be used but sometimes there are more differences than just voices between dubs (music?)
                fkStaffId: number,
                role?: string,
            ]
            //}
        }
    }
    const {
        allLanguages,
        allTypes,
        allCountries,
        allTags,
        allCompanies,
        allCharacters,
        allStaff,
    } = data
    let form: ActionData = $state({
        editorMessage: data.cartoon.editorMessage,
        fields: {
            id: data.cartoon.id,
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
            // jts: {
            jtCartoonsCartoonTypes: data.cartoon.types,
            jtCartoonsLanguages: data.cartoon.languages,
            jtCartoonsCountries: data.cartoon.countries,
            jtCartoonsTags: data.cartoon.tags,
            jtCartoonsCompanies: data.cartoon.companies,
            jtCartoonsCharacters: data.cartoon.characters,
            jtCartoonsStaff: data.cartoon.staff,
            // },
        },
    })

    let languageScore = [
        'unknown',
        'original language',
        'language',
        'official translation',
        'unofficial translation',
        // 5. unknown translation
    ]
    let reviewBoxLength = $derived(form.fields?.description?.length)
    form.fields.airStart = form.fields.airStart?.toISOString().split('T')[0]
    form.fields.airEnd = form.fields.airEnd?.toISOString().split('T')[0]

    $inspect(form.fields)

    const handleSubmit = async () => {
        // delete "name" fields from all jts
        form.fields = JSON.parse(
            JSON.stringify(form.fields).replaceAll(/"name":".*?",/g, '')
        )
        form.fields.name = data.cartoon.name
        for (const k in form.fields) {
            if (/^jt/.test(k)) {
                // form.fields[k].forEach((e) => {
                //     delete e['name']
                // })

                // TODO: fix cartoon/+layout.server.ts so that this is not needed.
                // It has to be done this way to preserve the order of the keys,
                // which is used to find differences later
                switch (k) {
                    case 'jtCartoonsCartoonTypes':
                        form.fields[k] = JSON.parse(
                            JSON.stringify(form.fields[k]).replaceAll(
                                'id',
                                'fkCartoonTypeId'
                            )
                        )
                        break
                    case 'jtCartoonsLanguages':
                        // e['fkLanguageId'] = e['id']
                        form.fields[k] = JSON.parse(
                            JSON.stringify(form.fields[k]).replaceAll(
                                'id',
                                'fkLanguageId'
                            )
                        )
                        break
                    case 'jtCartoonsCountries':
                        // e['fkCountryId'] = e['id']
                        form.fields[k] = JSON.parse(
                            JSON.stringify(form.fields[k]).replaceAll(
                                'id',
                                'fkCountryId'
                            )
                        )
                        break
                    case 'jtCartoonsTags':
                        // e['fkTagId'] = e['id']
                        form.fields[k] = JSON.parse(
                            JSON.stringify(form.fields[k]).replaceAll(
                                'id',
                                'fkTagId'
                            )
                        )
                        break
                    case 'jtCartoonsCompanies':
                        // e['fkCompanyId'] = e['id']
                        form.fields[k] = JSON.parse(
                            JSON.stringify(form.fields[k]).replaceAll(
                                'id',
                                'fkCompanyId'
                            )
                        )
                        break
                    case 'jtCartoonsCharacters':
                        // e['fkCharacterId'] = e['id']
                        form.fields[k] = JSON.parse(
                            JSON.stringify(form.fields[k]).replaceAll(
                                'id',
                                'fkCharacterId'
                            )
                        )
                        break
                    case 'jtCartoonsStaff':
                        // e['fkStaffId'] = e['id']
                        form.fields[k] = JSON.parse(
                            JSON.stringify(form.fields[k]).replaceAll(
                                'id',
                                'fkStaffId'
                            )
                        )
                        break
                }
            }
        }
        // console.log(form.fields)

        try {
            await fetch('/api/edit', {
                method: 'POST',
                body: JSON.stringify(form),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            })
        } catch (error) {
            console.error(error)
        }
    }
    // const ordered = Object.keys(form.fields)
    //     .sort()
    //     .reduce((obj, key) => {
    //         obj[key] = form.fields[key]
    //         return obj
    //     }, {})
    function findFK(k: string) {
        switch (k) {
            case 'jtCartoonsCartoonTypes':
                return 'fkCartoonTypeId'
            case 'jtCartoonsLanguages':
                return 'fkLanguageId'
            case 'jtCartoonsCountries':
                return 'fkCountryId'
            case 'jtCartoonsTags':
                return 'fkTagId'
            case 'jtCartoonsCompanies':
                return 'fkCompanyId'
            case 'jtCartoonsCharacters':
                return 'fkCharacterId'
            case 'jtCartoonsStaff':
                return 'fkStaffId'
        }
    }
</script>

<!-- {#snippet typeSelect( -->
<!--     name: string, -->
<!--     //
￼The Irreplaceable Charlie Kirkeslint-disable-next-line @typescript-eslint/no-explicit-any -->
<!--     allOptions: any, -->
<!--     selected: { id: number; name: string } -->
<!-- )} -->
<!--     <select -->
<!--         {name} -->
<!--         class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm -->
<!-- 				 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:bg-white" -->
<!--     > -->
<!--         <option value={undefined}> select {name} </option> -->
<!--         {#each allOptions as t (t.id)} -->
<!--             {#if selected.id == t.id} -->
<!--                 <option selected value={t.id}> {t.name} </option> -->
<!--             {/if} -->
<!--             <option value={t.id}> {t.name} </option> -->
<!--         {/each} -->
<!--     </select> -->
<!-- {/snippet} -->
<!---->
<!-- {#snippet selectAddDel( -->
<!--     name: string, -->
<!--     // eslint-disable-next-line @typescript-eslint/no-explicit-any -->
<!--     allOptions: any, -->
<!--     tbl: any -->
<!-- )} -->
<!--     <div class="flex justify-between"> -->
<!--         <label for={name}>{name}:</label> -->
<!--         <div> -->
<!--             <button -->
<!--                 class="btn btn-primary hover:btn-info w-5 h-5" -->
<!--                 form="NONE" -->
<!--                 onclick={() => { -->
<!--                     tbl.pop() -->
<!--                 }} -->
<!--             > -->
<!--                 - -->
<!--             </button> -->
<!--             <button -->
<!--                 class="btn btn-primary hover:btn-info w-5 h-5" -->
<!--                 form="NONE" -->
<!--                 onclick={() => { -->
<!--                     tbl.push({ id: null }) -->
<!--                 }} -->
<!--             > -->
<!--                 + -->
<!--             </button> -->
<!--         </div> -->
<!--     </div> -->
<!--     {#each tbl as t} -->
<!--         {@render typeSelect(name, allOptions, t)} -->
<!--     {:else} -->
<!--         <div class="mt-1 px-3 py-2 bg-gray-50 rounded-md text-gray-400"> -->
<!--             No {name} added. -->
<!--         </div> -->
<!--     {/each} -->
<!-- {/snippet} -->
{#snippet selectAddDel(
    name: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    allOptions: any,
    tbl: any
)}
    <div class="flex justify-between">
        <label for={name}>{name}:</label>
        <div>
            <button
                class="btn btn-primary hover:btn-info w-5 h-5"
                form="NONE"
                onclick={() => {
                    tbl.pop()
                }}
            >
                -
            </button>
            <button
                class="btn btn-primary hover:btn-info w-5 h-5"
                form="NONE"
                onclick={() => {
                    tbl.push({ id: null })
                }}
            >
                +
            </button>
        </div>
    </div>
    {#each tbl as t}
        <div class="flex flex-justify">
            <select
                {name}
                required
                class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm
				 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
                bind:value={t.id}
            >
                <option value={undefined}> select {name} </option>
                {#each allOptions as u (u.id)}
                    <option value={u.id}> {u.name} </option>
                {/each}
            </select>
            {#if name == 'tags'}
                <input
                    name="{name}Spoiler"
                    bind:checked={t.spoiler}
                    type="checkbox"
                    class="w-20 h-7 mt-2 rounded-full bg-gray-200 checked:bg-blue-500 focus:ring-blue-600"
                />
            {/if}
        </div>
    {:else}
        <div class="mt-1 px-3 py-2 bg-gray-50 rounded-md text-gray-400">
            No {name} added.
        </div>
    {/each}
{/snippet}

<svelte:head>
    <title>Edit {form.fields.name} - ToonTrack</title>
</svelte:head>

<h2
    class="text-base-content bg-base-200 text-2xl font-semibold text-center mt-6"
>
    Edit {form.fields.name}
</h2>
<div class="min-h-screen bg-base-200 py-2 px-10">
    <form
        method="POST"
        class="bg-base-300 white shadow-lg rounded-lg grid grid-cols-2 p-2"
    >
        <div class="min-h-screen p-2 bg-base-300 white shadow-lg rounded-lg">
            <!-- MAIN DATA -->
            <label for="name">Name:</label>
            <input
                type="text"
                id="name"
                name="name"
                placeholder="name"
                maxLength="100"
                minLength="5"
                class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm
				 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
                value={form.fields.name}
            />

            <label for="editorMessage">What is the reason for your edit:</label>
            <textarea
                id="editorMessage"
                name="editorMessage"
                placeholder="What is the reason for your edit."
                maxLength="1000"
                minLength="10"
                rows="2"
                bind:value={form.fields.editorMessage}
                class="w-full px-4 py-3 field-sizing-content text-sm font-medium text-gray-700 bg-white rounded-md focus:outline-none focus:ring-gray-300 transition-colors duration-200"
            ></textarea>

            <label for="description">Description:</label>
            <div
                class="w-full field-sizing-content text-sm font-medium text-gray-700 bg-white rounded-md focus:outline-none focus:ring-gray-300 focus:ring shadow-sm transition-colors duration-200"
            >
                <textarea
                    id="description"
                    name="description"
                    placeholder="Cartoon description."
                    maxLength="4000"
                    rows="5"
                    bind:value={form.fields.description}
                    class="w-full px-4 py-3 field-sizing-content text-sm font-medium text-gray-700 bg-white rounded-md focus:outline-none focus:ring-gray-300 transition-colors duration-200"
                    >{form.fields.description}</textarea
                >
                <div class="text-grey-700">
                    {reviewBoxLength}/4000
                </div>
            </div>

            <label for="coverPic">Cover Picture:</label>
            <input
                type="text"
                id="coverPic"
                name="coverPic"
                placeholder="coverPic"
                maxLength="300"
                class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm
				 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
                bind:value={form.fields.coverPic}
            />
            <!-- <div> -->
            <!--     <img -->
            <!--         src={form.fields.coverPic ? form.fields.coverPic : '/nocover.jpg'} -->
            <!--         alt={form.fields.name} -->
            <!--         class="object-contain rounded-lg shadow-lg" -->
            <!--     /> -->
            <!-- </div> -->

            {#if !data.cartoon?.types[0]?.name?.includes('film')}
                <label for="seasons">Seasons:</label>
                <input
                    type="number"
                    id="seasons"
                    name="seasons"
                    placeholder="none"
                    max="65"
                    class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm
				 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
                    bind:value={form.fields.seasons}
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
                    bind:value={form.fields.episodes}
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
                bind:value={form.fields.duration}
            />

            <label for="status">Status:</label>
            <select
                required
                name="status"
                id="status"
                class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm
				 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
                bind:value={form.fields.status}
            >
                <option value={0}>Unknown</option>
                <option value={1}>Planned</option>
                <option value={2}>In Progress</option>
                <option value={3}>Completed</option>
                <option value={4}>Halted</option>
                <option value={5}>Canceled</option>
                <option value={6}>Unreleased</option>
            </select>

            {#if !data.cartoon?.types[0]?.name?.includes('film')}
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
                bind:value={form.fields.airStart}
                class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm
				 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
            />

            {#if !data.cartoon?.types[0]?.name?.includes('film')}
                <label for="airEnd">Air End:</label>
                <input
                    type="date"
                    id="airEnd"
                    name="airEnd"
                    placeholder="air end"
                    min="1916-01-01"
                    bind:value={form.fields.airEnd}
                    class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm
				 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
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
                bind:value={form.fields.ageRating}
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
                bind:value={form.fields.links}
            />

            <div class="pt-2">
                <!-- type="submit" -->
                <button
                    form="NONE"
                    onclick={handleSubmit}
                    class="btn btn-primary hover:btn-info end"
                >
                    Post
                </button>
            </div>
        </div>

        <!-- JUNCTION TABLES -->
        <div class="min-h-screen p-2 bg-base-300 white shadow-lg rounded-lg">
            {@render selectAddDel(
                'types',
                allTypes,
                form.fields.jtCartoonsCartoonTypes
            )}

            <div class="grid grid-cols-2">
                <label for="languages">Languages:</label>
                <label for="languages">Language type:</label>
                <div></div>
                <div id="add-del-buttons">
                    <button
                        class="btn btn-primary hover:btn-info w-5 h-5"
                        form="NONE"
                        onclick={() => {
                            form.fields.jtCartoonsLanguages.pop()
                        }}
                    >
                        -
                    </button>
                    <button
                        class="btn btn-primary hover:btn-info w-5 h-5"
                        form="NONE"
                        onclick={() => {
                            form.fields.jtCartoonsLanguages.push({
                                id: null,
                                score: 0,
                            })
                        }}
                    >
                        +
                    </button>
                </div>

                {#each form.fields.jtCartoonsLanguages, t}
                    <select
                        required
                        name="languages"
                        class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
                        bind:value={form.fields.jtCartoonsLanguages[t].id}
                    >
                        {#each allLanguages as u (u.id)}
                            <option value={u.id}> {u.name} </option>
                        {/each}
                    </select>

                    <select
                        required
                        name="languageScore"
                        class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
                        bind:value={form.fields.jtCartoonsLanguages[t].score}
                    >
                        {#each languageScore, u}
                            <option value={u}>
                                {languageScore[u]}
                            </option>
                        {/each}
                    </select>
                {/each}
            </div>

            {@render selectAddDel(
                'countries',
                allCountries,
                form.fields.jtCartoonsCountries
            )}

            {@render selectAddDel('tags', allTags, form.fields.jtCartoonsTags)}

            {@render selectAddDel(
                'companies',
                allCompanies,
                form.fields.jtCartoonsCompanies
            )}
            <!-- <label for="name">Companies:</label> -->
            <!-- {#each form.fields.companies as t {t.id}} -->
            <!--     {@render typeSelect('companies', allCompanies, t)} -->
            <!-- {/each} -->

            <!--  <label for="name">Characters:</label> -->
            <!-- {#each form.fields.characters as t (t.id)} -->
            <!--     {@render typeSelect('characters', allCharacters, t)} -->
            <!-- {/each} -->
            <!---->
            <!--  <label for="name">Staff:</label> -->
            <!-- {#each form.fields.staff as t (t.id)} -->
            <!--     {@render typeSelect('staff', allStaff, t)} -->
            <!-- {/each} -->
        </div>
    </form>
</div>
