import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./frontend"),
    },
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
    force: true,
  },
  build: {
    target: "esnext",
    cssCodeSplit: true,
    minify: "esbuild",
    sourcemap: false,
    rollupOptions: {
      treeshake: false,
      output: {
        manualChunks: undefined,
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 5173,
    strictPort: false,
  },
});
