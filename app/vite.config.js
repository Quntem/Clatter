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
      "clatter.work",
      "beta.clatter.work"
    ],
    port: 3000,      // Matches the exposed port in docker-compose
    fs: {
      allow: ['.'] // so /src/... access doesn't get denied
    }
  },
  plugins: [
    {
      name: 'externalize-html-imports',
      enforce: 'pre',
      transformIndexHtml(html) {
        // Regex to match all 3 dirs: routines, components, scripts
        return html.replace(
          /<script\s+type="module"\s+src="\.\/(routines|components|scripts)\/(.+?)"><\/script>/g,
          (_, dir, file) => {
            return `<script type="module" src="/src/${dir}/${file}"></script>`
          }
        )
      }
    }
  ]
});
