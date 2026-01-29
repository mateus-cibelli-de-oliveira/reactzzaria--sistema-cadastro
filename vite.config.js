import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
    },
  },
  server: {
    // Responde tanto a http://localhost:5173 quanto a http://127.0.0.1:5173
    host: '0.0.0.0',
    port: 5173, // Define explicitamente a porta, se necessário
  }
});
