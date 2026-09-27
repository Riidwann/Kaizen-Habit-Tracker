import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  esbuild: {
    loader: "tsx",
    include: /\.[jt]sx?$/,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./tests/setup.ts",
  },
  resolve: {
    alias: {
      "@/shared": path.resolve(__dirname, "./src/shared"),
      "@/modules": path.resolve(__dirname, "./src/modules"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

