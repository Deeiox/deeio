// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://bigcitylife.netlify.app",
  integrations: [mdx(), sitemap(), icon(), react()],
  vite: {
    // @ts-ignore - Resolves type mismatch between Astro's internal Vite and the project's Vite
    plugins: [tailwindcss()],
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
});
