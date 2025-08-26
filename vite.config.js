import react from "@vitejs/plugin-react";
import { copyFileSync } from "fs";
import { defineConfig } from "vite";

function copyRedirects() {
  return {
    name: "copy-redirects",
    closeBundle() {
      try {
        copyFileSync("public/_redirects", "dist/_redirects");
        console.log("✅ Fichier _redirects copié dans dist/");
      } catch (err) {
        console.error("⚠️ Impossible de copier _redirects :", err);
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copyRedirects()],
});