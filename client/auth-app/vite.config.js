import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    federation({
  name: "authApp",
  filename: "remoteEntry.js",
  exposes: {
    "./Navbar": "./src/components/Navbar.jsx",
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
    port: 3000,
    cors: true,
  },
  preview: {
    port: 3000
  },
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,

   
  },
});