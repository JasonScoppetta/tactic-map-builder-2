import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import commonjs from "vite-plugin-commonjs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), commonjs()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@/types": path.resolve(__dirname, "src/types"),
      // Add more aliases as needed
    },
  },
});
