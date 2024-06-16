import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import dotenv from "dotenv";

export default defineConfig({
  root: ".", // Set the root to the project root
  plugins: [react(), svgr(), tsconfigPaths()],
  css: {
    postcss: "./postcss.config.cjs",
  },
  optimizeDeps: {
    include: [
      "hoist-non-react-statics",
      "@thirdweb-dev/react",
      "@thirdweb-dev/sdk",
      "react-is",
      "react",
      "react-dom",
      "react-router-dom",
    ],
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080", // Ensure this matches your backend's URL/port
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: "./src/main.tsx", // Ensure this path correctly matches your entry point
      external: [
        "hoist-non-react-statics",
        "@thirdweb-dev/react",
        "@thirdweb-dev/sdk",
        "react-is",
        "react",
        "react-dom",
        "react-router-dom",
        "./src/assets/GGDataMan.svg", // Ensure this matches your asset path
      ],
    },
  },
});
