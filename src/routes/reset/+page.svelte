<form on:submit|preventDefault={handleForgotPassword}>
    <h1 class="text-2xl mb-4">Forgot Password</h1>
    <div class="mb-4">
      <label for="email" class="block">Email:</label>
      <input type="email" id="email" bind:value={email} class="w-full p-2 border-gray-300" required />
    </div>
    <button type="submit" class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">Reset Password</button>
  </form>
</div>
</main>

