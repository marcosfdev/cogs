<script>
    export let status = '';
    
    // Placeholder books data. In a real app, this would come from an API.
    let books = [
      { id: 1, title: 'Svelte for Beginners', category: 'Software Engineering', status: 'Currently Reading' },
      // Add more sample books here
    ];
  </script>
  
  <div class="my-8">
    <h2 class="text-lg font-bold mb-4">{status}</h2>
    <div class="grid grid-cols-4 gap-4">
      {#each books as book (book.id)}
        {#if book.status === status}
          <div class="bg-white p-4 shadow rounded">
            <h3 class="font-semibold">{book.title}</h3>
            <p class="text-sm">{book.category}</p>
          </div>
        {/if}
      {/each}
    </div>
  </div>
  