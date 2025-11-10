import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Dynamically load Tailwind CSS Vite plugin with fallback
async function loadTailwindPlugin() {
  try {
    const tailwind = await import("@tailwindcss/vite");
    return tailwind.default();
  } catch (error) {
    console.warn("⚠️ @tailwindcss/vite not found, Tailwind will process via CSS @import");
    return null;
  }
}

export default defineConfig(async () => {
  const tailwindPlugin = await loadTailwindPlugin();
  
  return {
  plugins: [tailwindPlugin, react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./frontend"),
    },
    dedupe: ["react", "react-dom"],
  },
  esbuild: {
    jsx: 'automatic',
    tsconfigRaw: {
      compilerOptions: {
        jsx: 'react-jsx',
        skipLibCheck: true,
        noEmit: true,
        checkJs: false,
        allowJs: true,
        noImplicitAny: false,
        strict: false
      }
    }
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
    force: true,
    esbuildOptions: {
      jsx: 'automatic',
      tsconfigRaw: {
        compilerOptions: {
          jsx: 'react-jsx',
          skipLibCheck: true
        }
      }
    },
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
}});
