<script lang="ts">
    import { enhance } from "$app/forms";
    import type {ActionData} from "./$types";

    export let form: ActionData | undefined;
    
</script>

<div class="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
    <main class="bg-white shadow-lg rounded-lg w-full max-w-md overflow-hidden">
      <h2 class="text-zinc-400 text-2xl font-semibold text-center mt-6">Log In</h2>
      <form method="POST" use:enhance class="p-6 space-y-4">
        <!-- Your form content here -->
         <label class="block text-sm font-medium text-gray-700" for="username">Username</label>
         <input
          type="text"
          id="username" 
          name="username"
          maxLength="64"
          minLength="1"
          required
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" 
          >

          <label class="block text-sm font-medium text-gray-700" for="password">Password</label>
          <input
          type="password"
          id="password"
          name="password"
          maxLength="999"
          minLength="20"
          required
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
          {#if form?.error?.password}
          <p class="mt-1 text-sm text-red-600">{form.error.password}</p>
          {/if}

          <!-- Submit Button-->
          <div>
            <button
            type="submit"
            class=""
            onclick={() => {console.log(form.password)}}
            >
            Sign Up
          </button>
          </div>  
        </form>
    </main>
  </div>