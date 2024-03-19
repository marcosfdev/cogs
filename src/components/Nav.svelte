<script>
    export const routes = [
      { path: "/", title: "Home" },
      { path: "/about", title: "About" },
      { path: "/contact", title: "Contact" },
      { path: "/signin", title: "Sign In" },
      { path: "/register", title: "Register" },
    ];
  </script>
  
  <nav class="bg-gradient-to-r from-black to-purple-500 text-white font-bold">
    <ul class="text-white">
      {#each routes as route}
        <li class="mr-4">
          <a href="{route.path}" class="{route.path === $location.pathname ? 'text-indigo-500' : ''}">
            {route.title}
          </a>
        </li>
      {/each}
    </ul>
    <ul class="text-white">
      <li class="ml-4"><a href="/signin">Sign In</a></li>
      <li><a href="/register">Register</a></li>
    </ul>
  </nav>
  