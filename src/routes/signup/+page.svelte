<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";
  import { PASSWORD, USERNAME } from '$lib/constants/auth';

  export let form: ActionData | undefined;
</script>

<div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
  <main class="card w-full max-w-md shadow-xl bg-base-100">
    <div class="card-body">
      <h2 class="card-title justify-center text-2xl text-base-content mb-2">Sign up to Cartoon Chronicles</h2>
      <form method="POST" use:enhance class="space-y-4">
        <!-- Username -->
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          maxLength="64"
          minLength="1"
          required
          class="input input-bordered w-full"
        />

        <!-- Password -->
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          maxLength="999"
          minLength="10"
          required
          class="input input-bordered w-full"
        />

        <!-- Confirm Password -->
        <input
          type="password"
          id="password2"
          name="password2"
          placeholder="Confirm Password"
          maxLength="999"
          minLength="10"
          required
          class="input input-bordered w-full"
        />

        {#if form?.message}
          <p class="text-error text-sm flex justify-center">{form.message}</p>
        {/if}

        <!-- Submit Button -->
        <div class="pt-2">
          <button
            type="submit"
            class="btn btn-primary w-full"
          >
            Sign Up
          </button>
        </div>

        <!-- Signup Link -->
        <div class="text-center text-sm text-base-content/60 pt-2">
          Have an account?
          <a href="/login" class="link link-primary ml-1">Login</a>
        </div>
      </form>
    </div>
  </main>
</div>
