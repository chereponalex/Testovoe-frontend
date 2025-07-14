import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import dynamicImport from "vite-plugin-dynamic-import";
import dotenv from "dotenv";

// https://vitejs.dev/config/
dotenv.config();
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-macros"],
      },
    }),
    tailwindcss(),
    dynamicImport(),
  ],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: process?.env?.BACKEND_URL
          ? `https://${process?.env?.BACKEND_URL}`
          : "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  define: {
    __BACKEND_URL__: JSON.stringify(
      process?.env?.BACKEND_URL
        ? `https://${process?.env?.BACKEND_URL}`
        : "http://localhost:8000"
    ),
    __WS_BACKEND_URL__: JSON.stringify(
      process?.env?.BACKEND_URL
        ? `wss://${process?.env?.BACKEND_URL}/websockets`
        : "http://localhost:8000/websockets"
    ),
    __COMMIT_MESSAGE__: JSON.stringify(process?.env?.COMMIT_MESSAGE || ""),
    __COMMIT_INITIATOR__: JSON.stringify(process?.env?.COMMIT_INITIATOR || ""),
    __COMMIT_DATE__: JSON.stringify(process?.env?.COMMIT_DATE || ""),
  },
  assetsInclude: ["**/*.md"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "build",
  },
});
