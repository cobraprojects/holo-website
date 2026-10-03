import { defineConfig } from "vite";

export default defineConfig({
  plugins: [{
    name: "inline-page-css",
    enforce: "post",
    generateBundle(_, bundle) {
      const page = bundle["index.html"];
      page.source = page.source.replace(/<link\b[^>]*>/g, (tag) => {
        if (!/\brel="stylesheet"/.test(tag)) return tag;
        const path = tag.match(/\bhref="\/([^"]+)"/)?.[1];
        const css = bundle[path];
        if (css?.type !== "asset") return tag;
        delete bundle[path];
        return `<style>${css.source}</style>`;
      });
    },
  }],
});
