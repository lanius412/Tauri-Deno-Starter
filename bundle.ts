import * as esbuild from "https://deno.land/x/esbuild@v0.17.8/mod.js";
import { denoPlugins } from "https://deno.land/x/esbuild_deno_loader@0.7.0/mod.ts";
import { readLines } from "https://deno.land/std@0.185.0/io/mod.ts";

const ctx = await esbuild.context({
  plugins: denoPlugins(),
  entryPoints: ["./www/index.tsx"],
  outfile: "./www/dist/main.js",
  bundle: true,
  format: "esm",
});

const { host, port } = await ctx.serve({
  port: 3000,
  servedir: "./www",
});
console.log(`Serving on ${host}:${port}`);

await ctx.watch();
// console.log("Watching...");

for await (const _ of readLines(Deno.stdin)) {
  await ctx.rebuild().catch(() => {});
}

esbuild.stop();
