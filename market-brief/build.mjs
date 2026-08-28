#!/usr/bin/env node
/**
 * Bundles index.html + data.js into one self-contained file.
 *
 *   node build.mjs             -> dist/market-brief.html
 *       A standalone page: open it from disk, email it, host it anywhere.
 *
 *   node build.mjs --fragment  -> dist/market-brief.fragment.html
 *       Same page without the <!doctype>/<html>/<head>/<body> wrapper, for
 *       publishing as a Claude Artifact (which supplies its own skeleton).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(dir, "index.html"), "utf8");
const data = fs.readFileSync(path.join(dir, "data.js"), "utf8");

const inlined = html.replace(
  /<script src="\.\/data\.js"><\/script>/,
  "<script>\n" + data.trimEnd() + "\n</script>"
);
if (inlined === html) {
  console.error("build failed: could not find the data.js script tag in index.html");
  process.exit(1);
}

fs.mkdirSync(path.join(dir, "dist"), { recursive: true });

if (process.argv.includes("--fragment")) {
  const head = /<head>([\s\S]*?)<\/head>/.exec(inlined)[1]
    .replace(/<meta charset[^>]*>\s*/i, "")
    .replace(/<meta name="viewport"[^>]*>\s*/i, "");
  const body = /<body>([\s\S]*?)<\/body>/.exec(inlined)[1];
  const out = path.join(dir, "dist", "market-brief.fragment.html");
  fs.writeFileSync(out, head.trim() + "\n" + body.trim() + "\n");
  console.log("wrote " + out);
} else {
  const out = path.join(dir, "dist", "market-brief.html");
  fs.writeFileSync(out, inlined);
  console.log("wrote " + out);
}
