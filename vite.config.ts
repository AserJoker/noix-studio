import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vuetsx()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
