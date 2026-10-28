// Verifies that every image and link in README.md resolves, so a broken
// badge or dead demo link fails CI instead of silently breaking the profile.
//
// Images served from this repo's `output` branch are checked against
// $OUTPUT_DIR (the freshly generated files) when it is set.
import { readFileSync, existsSync } from "node:fs";

const README = "README.md";
const OUTPUT_PREFIX = "https://raw.githubusercontent.com/M-Hasan-11/M-Hasan-11/output/";
const outputDir = process.env.OUTPUT_DIR;
const md = readFileSync(README, "utf8").replace(/<!--[\s\S]*?-->/g, "");

const images = new Set();
const links = new Set();
for (const [, url] of md.matchAll(/\s(?:src|srcset)="([^"]+)"/g)) images.add(url);
for (const [, url] of md.matchAll(/!\[[^\]]*\]\(([^)\s]+)\)/g)) images.add(url);
for (const [, url] of md.matchAll(/\shref="([^"]+)"/g)) links.add(url);
for (const [, url] of md.matchAll(/(?<!!)\[[^\]]*\]\(([^)\s]+)\)/g)) links.add(url);

async function get(url) {
  let last;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, {
        redirect: "follow",
        headers: { "User-Agent": "Mozilla/5.0 (profile-readme-check)", Accept: "*/*" },
        signal: AbortSignal.timeout(20_000),
      });
      await res.arrayBuffer();
      if (res.status < 500 && res.status !== 429) return res;
      last = `HTTP ${res.status}`;
    } catch (e) {
      last = e.message;
    }
    await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
  }
  throw new Error(last);
}

async function checkImage(url) {
  if (url.startsWith(OUTPUT_PREFIX) && outputDir) {
    const file = `${outputDir}/${url.slice(OUTPUT_PREFIX.length).split("?")[0]}`;
    return existsSync(file) ? "generated" : `missing generated file ${file}`;
  }
  if (!/^https?:/.test(url)) return existsSync(url) ? "local" : "missing local file";
  const res = await get(url);
  const type = res.headers.get("content-type") ?? "";
  if (res.status !== 200) return `HTTP ${res.status}`;
  if (!type.startsWith("image/")) return `not an image (${type})`;
  return "ok";
}

async function checkLink(url) {
  if (url.startsWith("mailto:") || url.startsWith("#")) return "skipped";
  if (!/^https?:/.test(url)) return existsSync(url) ? "local" : "missing local file";
  const res = await get(url);
  return res.status < 400 ? "ok" : `HTTP ${res.status}`;
}

const OK = new Set(["ok", "local", "generated", "skipped"]);
const jobs = [
  ...[...images].map((u) => ["image", u, checkImage]),
  ...[...links].map((u) => ["link", u, checkLink]),
];
const results = await Promise.all(
  jobs.map(async ([kind, url, fn]) => {
    let status;
    try {
      status = await fn(url);
    } catch (e) {
      status = `error: ${e.message}`;
    }
    return { kind, url, status };
  }),
);

let failed = 0;
for (const r of results) {
  const good = OK.has(r.status);
  if (!good) failed++;
  console.log(`${good ? "PASS" : "FAIL"}  ${r.kind.padEnd(5)}  ${r.status.padEnd(10)}  ${r.url}`);
}
console.log(`\n${results.length - failed}/${results.length} checks passed`);
if (failed) process.exit(1);
