const esbuild = require("esbuild");
const { sassPlugin } = require("esbuild-sass-plugin");

esbuild
  .build({
    entryPoints: ["Application.tsx", "style.scss"],
    outdir: "../public/assets",  // !!!
    bundle: true,
    watch: true,
    minify: true,
    // outfile: "out.js",
    plugins: [sassPlugin()],
  })
  .then(() => console.log("⚡ Build complete! ⚡"))
  .catch(() => process.exit(1));
