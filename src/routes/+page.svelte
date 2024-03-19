<!-- +page.svelte -->
<script>
    import NewsletterForm from '$lib/NewsletterForm.svelte';
    import Hero from '$lib/Hero.svelte';
    import Features from '$lib/Features.svelte';
  </script>
  
<Hero />
<Features />
  
  <section class="bg-gray-100 py-16">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl font-bold text-center mb-8">Subscribe to Our Newsletter</h2>
      <div class="max-w-lg mx-auto">
        <div class="bg-white bg-opacity-50 p-8 rounded-lg shadow-lg">
          <NewsletterForm />
        </div>
      </div>
    </div>
  </section>