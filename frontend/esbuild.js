const esbuild = require("esbuild");
const { sassPlugin } = require("esbuild-sass-plugin");

esbuild
  .build({
    entryPoints: ["Application.tsx", "style.scss"],
    // outdir: "../public/assets",
    outdir: "../public/assets",  // !!!
    bundle: true,
    watch: true,
    minify: true,
    // sourcemap: true,
    // outfile: "out.js",
    // define: {
    //   "process.env.REACT_APP_API_URL": '"http://backend:8080"',
    //   "process.env.REACT_APP_CLIENT_ID": '"57588337508-r1si265oloevpksmlu0kg189cfmr03q8.apps.googleusercontent.com"',
    // },
    plugins: [sassPlugin()],
  })
  .then(() => console.log("⚡ Build complete! ⚡"))
  .catch(() => process.exit(1));
