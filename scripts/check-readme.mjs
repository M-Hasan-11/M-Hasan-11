// Verifies that every image and link in README.md resolves, so a broken
// badge or dead demo link fails CI instead of silently breaking the profile.
//
// With RENDER_REF and GITHUB_TOKEN set, the README is also rendered by GitHub
// at that ref and every image is fetched the way the profile page loads it.
import { readFileSync, existsSync } from "node:fs";

const README = "README.md";
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

// Images exactly as GitHub serves them on the profile: external URLs go
// through GitHub's camo proxy, which can reject files a direct fetch accepts.
async function renderedImages(ref) {
  const res = await fetch(`https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/readme?ref=${ref}`, {
    headers: {
      Accept: "application/vnd.github.html",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "User-Agent": "profile-readme-check",
    },
  });
  if (!res.ok) throw new Error(`rendering README failed: HTTP ${res.status}`);
  const html = await res.text();
  const urls = new Map();
  for (const [tag] of html.matchAll(/<(?:img|source)\b[^>]*>/g)) {
    const attr = (name) => tag.match(new RegExp(`\\s${name}="([^"]+)"`))?.[1]?.replaceAll("&amp;", "&");
    const url = attr("src") ?? attr("srcset");
    // Relative paths resolve against the repo at that ref, as on the profile page.
    if (url) urls.set(new URL(url, `https://github.com/${process.env.GITHUB_REPOSITORY}/raw/${ref}/`).href, attr("data-canonical-src"));
  }
  return [...urls].map(([url, canonical]) => (canonical ? `${url} <= ${canonical}` : url));
}

async function checkRendered(label) {
  const res = await get(label.split(" <= ")[0]);
  const type = res.headers.get("content-type") ?? "";
  if (res.status !== 200) return `HTTP ${res.status}`;
  if (!type.startsWith("image/")) return `not an image (${type})`;
  return "ok";
}

const OK = new Set(["ok", "local", "skipped"]);
const renderRef = process.env.RENDER_REF;
const rendered = renderRef && process.env.GITHUB_TOKEN ? await renderedImages(renderRef) : [];
const jobs = [
  ...[...images].map((u) => ["image", u, checkImage]),
  ...[...links].map((u) => ["link", u, checkLink]),
  ...rendered.map((u) => ["served", u, checkRendered]),
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
