import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    watch: {
      usePolling: true, // Enables file change polling
    },
    host: '0.0.0.0', // Ensures Vite is accessible from the container
    allowedHosts: [
      "clatter.quntem.co.uk",
      "clatterpreview.quntem.co.uk",
      "clatter.work"
    ],
    port: 3000,      // Matches the exposed port in docker-compose
  },
});
