import { readFile, access, readdir } from "node:fs/promises";
import assert from "node:assert/strict";
import path from "node:path";
import { personas } from "../src/personas.js";

const root = path.resolve(import.meta.dirname, "..");
const html = await readFile(path.join(root, "index.html"), "utf8");
const css = await readFile(path.join(root, "src/style.css"), "utf8");
const js = await readFile(path.join(root, "src/main.js"), "utf8");
const portrait = await readFile(path.join(root, "src/portrait.js"), "utf8");
const source = [html, css, js, portrait].join("\n");
assert.equal(personas.length, 3, "All three character experiences must exist");
for (const persona of personas) {
  assert.equal(
    persona.manifesto.length,
    8,
    `${persona.name}: manifesto line count`,
  );
  assert.equal(
    persona.memories.length,
    7,
    `${persona.name}: missing collage image`,
  );
  assert.equal(persona.fan.length, 5, `${persona.name}: incomplete photo fan`);
  assert.equal(
    new Set(persona.memories.map((image) => image.src)).size,
    7,
    `${persona.name}: repeated collage imagery`,
  );
  assert.equal(
    new Set(persona.fan.map((image) => image.src)).size,
    5,
    `${persona.name}: repeated fan imagery`,
  );
  const images = [
    ...persona.memories,
    ...persona.fan,
    persona.interlude,
    persona.chapterImage,
    persona.footerImage,
    ...persona.dual.map((item) => item[3]),
  ];
  for (const image of images) {
    assert(image.alt.length > 5, `${persona.name}: missing image description`);
    await access(path.join(root, "public", image.src));
  }
  for (const file of persona.archive || [])
    await access(path.join(root, "public/images", file.image));
}
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
