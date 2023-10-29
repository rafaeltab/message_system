import * as esbuild from "esbuild"

await esbuild.build({
  entryPoints: ["./src/db.ts"],
  bundle: true,
  tsconfig: "./tsconfig.json",
  outfile: "./dist/db.js",
  platform: "node",
  format: "esm",
  banner: {
    js: `
        import path from 'path';
        import { fileURLToPath } from 'url';
        import { createRequire as topLevelCreateRequire } from 'module';
        const require = topLevelCreateRequire(import.meta.url);
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        `
  },
})
