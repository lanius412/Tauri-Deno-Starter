import * as esbuild from "https://deno.land/x/esbuild@v0.17.8/mod.js";
import { denoPlugins } from "https://deno.land/x/esbuild_deno_loader@0.7.0/mod.ts";

const result = await esbuild.build({
  plugins: denoPlugins(),
  entryPoints: ["./www/index.tsx"],
  outfile: "./www/dist/main.js",
  bundle: true,
  format: "esm",
});
console.log(result.outputFiles);

esbuild.stop();
