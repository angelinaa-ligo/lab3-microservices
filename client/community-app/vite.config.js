import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
  name: "communityApp",
  remotes: {
    authApp: "http://localhost:4173/assets/remoteEntry.js",
  },
  shared: {
    react: { singleton: true, eager: true },
    "react-dom": { singleton: true, eager: true },
    "@apollo/client": { singleton: true, eager: true },
    "react-router-dom": { singleton: true, eager: true },
  },
}),
  ],
  server: {
    port: 3002,
  },
});