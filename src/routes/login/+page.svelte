<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";
  
  // export let form: ActionData | undefined;
</script>

<div class="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
  <main class="bg-white shadow-lg rounded-lg w-full max-w-md overflow-hidden">
    <h2 class="text-zinc-400 text-2xl font-semibold text-center mt-6">Log in to Cartoon Chronicles</h2>
    
    <form method="POST" use:enhance class="p-6 space-y-6">
      <!-- Username -->
      <div>
        <input
          type="text"
          id="username" 
          name="username"
          placeholder="Username"
          required
          class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm
                 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:bg-white" 
        />
      </div>

      <!-- Password -->
      <div>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          required
          class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm
                 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
        />
      </div>


      <!-- Submit Button -->
      <div class="pt-2">
        <button
          type="submit"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm 
                 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Log In
        </button>
      </div>

      <!-- Signup Link -->
      <div class="text-center text-sm text-gray-600 pt-2">
        Don't have an account? 
        <a href="/signup" class="font-medium text-blue-600 hover:text-blue-500">
          Sign up
        </a>
      </div>
    </form>
  </main>
</div>