export function validateHashFormat(hash) {
    // Implement logic to validate your specific hash format
    // This example assumes a basic format check (adjust based on your needs)
    return hash.split(':').length === 3;
  }
  
  export function handleError(error, status = 500) {
    console.error(error);
    return new Response('An error occurred. Please try again later.', { status });
  }
  
  export function sanitizeHash(hash) {
    // Implement logic to sanitize the hash value
    // This example uses basic regular expression to remove potentially harmful characters
    return hash.replace(/[^a-zA-Z0-9:\-]/g, '');
  }  