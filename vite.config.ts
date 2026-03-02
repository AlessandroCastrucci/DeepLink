import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function wellKnownHeaders(): Plugin {
  const applyHeaders = (server: { middlewares: { use: Function } }) => {
    server.middlewares.use(
      (
        req: { url?: string },
        res: { setHeader: Function },
        next: Function,
      ) => {
        if (req.url?.startsWith("/.well-known/")) {
          res.setHeader("Content-Type", "application/json");
        }
        next();
      },
    );
  };

  return {
    name: "well-known-headers",
    configureServer: applyHeaders,
    configurePreviewServer: applyHeaders,
  };
}

export default defineConfig({
  plugins: [wellKnownHeaders(), react(), tailwindcss()],
});
