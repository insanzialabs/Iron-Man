import { readFile, access, readdir } from "node:fs/promises";
import assert from "node:assert/strict";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const html = await readFile(path.join(root, "index.html"), "utf8");
const css = await readFile(path.join(root, "src/style.css"), "utf8");
const js = await readFile(path.join(root, "src/main.js"), "utf8");
const portrait = await readFile(path.join(root, "src/portrait.js"), "utf8");
const source = [html, css, js, portrait].join("\n");
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(ids.length, new Set(ids).size, "Duplicate HTML IDs");
for (const match of html.matchAll(/href="#([^"]+)"/g))
  assert(ids.includes(match[1]), `Missing anchor #${match[1]}`);
const assets = new Set(
  [...source.matchAll(/\/(?:images|fonts)\/[\w.-]+\.(?:webp|woff2)/g)].map(
    (match) => match[0],
  ),
);
for (const match of js.matchAll(/image:\s*["']([^"']+)["']/g))
  assets.add(`/images/${match[1]}`);
for (const asset of assets) await access(path.join(root, "public", asset));
for (const name of await readdir(path.join(root, "public/images"))) {
  const buffer = await readFile(path.join(root, "public/images", name));
  assert.equal(
    buffer.toString("ascii", 0, 4),
    "RIFF",
    `${name} isn't a valid WebP container`,
  );
  assert.equal(buffer.toString("ascii", 8, 12), "WEBP", `${name} isn't WebP`);
}
assert(
  !source.includes("googletagmanager") && !source.includes("google-analytics"),
  "Unexpected tracking",
);
assert(
  css.includes("prefers-reduced-motion"),
  "Missing reduced-motion adaptation",
);
const config = JSON.parse(
  await readFile(path.join(root, "vercel.json"), "utf8"),
);
assert.equal(config.outputDirectory, "dist");
const built = await readFile(path.join(root, "dist/index.html"), "utf8");
for (const match of built.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g))
  await access(path.join(root, "dist", match[1]));
console.log(
  `Passed: ${assets.size} local assets, ${ids.length} unique IDs, all section anchors, WebP signatures, reduced-motion CSS and production entrypoints.`,
);
