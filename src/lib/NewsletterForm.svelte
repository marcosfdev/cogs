<script>
import { subscribe } from '$lib/newsletter';

  let email = '';
  let errorMessage = '';
  let successMessage = '';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateEmail(email) {
    return emailRegex.test(email);
  }


  async function handleSubmit() {
    if (!validateEmail(email)) {
      errorMessage = 'Please enter a valid email address.';
      return;
    }

    try {
      const response = await fetch(import.meta.env.VITE_API_GATEWAY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          from: import.meta.env.VITE_FROM_EMAIL,
          subject: 'Newsletter Subscription Confirmation',
          text: 'Thank you for subscribing to our newsletter!',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message === 'Email sent successfully') {
          successMessage = 'Thank you for subscribing!';
          email = '';
          errorMessage = '';
        } else {
          throw new Error('Failed to send email');
        }
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      errorMessage = 'An error occurred while sending the email.';
    }
  }
</script>

<div class="max-w-md mx-auto">
  <h3 class="text-2xl font-bold mb-4 text-center">Stay Updated</h3>
  {#if errorMessage}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {errorMessage}
    </div>
  {/if}
  {#if successMessage}
    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
      {successMessage}
    </div>
  {/if}
  <form on:submit|preventDefault={handleSubmit}>
    <div class="flex">
      <input
        type="email"
        placeholder="Enter your email"
        bind:value={email}
        class="flex-1 border-2 border-blue-300 bg-blue-100 bg-opacity-30 rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
      <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r"
      >
        Subscribe
      </button>
    </div>
  </form>
</div>