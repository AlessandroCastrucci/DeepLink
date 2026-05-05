import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "AppBanner",
      fileName: (format) =>
        format === "umd" ? "app-banner.umd.cjs" : "app-banner.js",
      formats: ["es", "umd"],
    },
    sourcemap: true,
    minify: true,
  },
});
