<script lang="ts">
  import { enhance } from "$app/forms";
  import type {ActionData} from "./$types";
  
import { PASSWORD, USERNAME } from '$lib/constants/auth';
  
  export let form: ActionData | undefined;
</script>

<div class="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
  <main class="bg-white shadow-lg rounded-lg w-full max-w-md overflow-hidden">
      <h2 class="text-zinc-400 text-2xl font-semibold text-center mt-6">Sign up to Cartoon Chronicles</h2>
      <form method="POST" use:enhance class="p-6 space-y-6">
          <!-- Username -->
          <!--<label class="block text-sm font-medium text-gray-700" for="username">Username</label>
        -->
          <input
              type="text"
              id="username" 
              name="username"
              placeholder="Username"
              maxLength="64"
              minLength="1"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
          >

          <!-- Password -->
          <!--<label class="block text-sm font-medium text-gray-700" for="password">Password</label>
        -->
          <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              maxLength="999"
              minLength="10"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
          {#if form?.message}
              <p class="mt-1 text-sm text-red-600">{form.message}</p>
          {/if}

          <!-- Confirm Password -->
          <!--<label class="block text-sm font-medium text-gray-700" for="password2">Password again</label>
        -->
          <input
              type="password"
              id="password2"
              name="password2"
              placeholder="Confirm Password"
              maxLength="999"
              minLength="10"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >

          <!-- Email -->
          <!--
          <label class="block text-sm font-medium text-gray-700" for="email">E-mail</label>
          <input
              type="email"
              id="email"
              name="email"
              maxLength="254"
              minLength="3"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
          -->

          <!-- Submit Button -->
          <div class="pt-4">
              <button
                  type="submit"
                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                  Sign Up
              </button>
          </div>

          <!-- Signup Link -->
          <div class="text-center text-sm text-gray-600 pt-2">
            Have an account? 
            <a href="/login" class="font-medium text-blue-600 hover:text-blue-500">
            Login
            </a>
        </div>
      </form>
  </main>
</div>