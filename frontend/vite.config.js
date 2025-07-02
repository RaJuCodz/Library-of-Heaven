import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "./", // ensure relative asset paths in index.html
  plugins: [react()],
  build: {
    outDir: "dist", // match your Vercel distDir
    emptyOutDir: true, // clear old files on each build
  },
});
