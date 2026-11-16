// Checks every Source and Docs link in src/sources.json (run `npm run build:data` first).
// Usage: npm run check:links            → prints a table of links that did not answer 2xx/3xx
// Not part of scripts/check.sh: government sites are often slow or bot-protected, so a red
// result here needs a human look (open it in a normal browser) before changing the data.
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const { sources } = JSON.parse(await readFile(path.join(root, "src", "sources.json"), "utf8"));
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

const links = new Map();
for (const source of sources) {
  for (const [kind, url] of [["source", source.url], ["docs", source.docs]]) {
    if (!url) continue;
    if (url.includes("{")) {
      console.log(`! template URL used as a link: ${source.name} (${kind}) ${url}`);
      continue;
    }
    if (!links.has(url)) links.set(url, []);
    links.get(url).push(`${source.name} (${kind})`);
  }
}

async function check(url) {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(30000),
      headers: { "User-Agent": UA, "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8" },
    });
    return { url, status: response.status, final: response.url };
  } catch (error) {
    return { url, status: "ERR", final: String(error.cause?.code ?? error.name ?? error) };
  }
}

const urls = [...links.keys()];
const results = [];
for (let i = 0; i < urls.length; i += 12) {
  results.push(...(await Promise.all(urls.slice(i, i + 12).map(check))));
}

const bad = results.filter((r) => r.status === "ERR" || r.status >= 400);
const moved = results.filter(
  (r) => r.status !== "ERR" && r.status < 400 && new URL(r.final).host !== new URL(r.url).host,
);
console.log(`Checked ${results.length} unique links: ${results.length - bad.length} OK, ${bad.length} not OK.`);
for (const r of bad) console.log(`✗ ${r.status}\t${r.url}\t${r.final}\t← ${links.get(r.url).join("; ")}`);
for (const r of moved) console.log(`→ moved\t${r.url}\t${r.final}\t← ${links.get(r.url).join("; ")}`);
console.log("403/ERR on IBGE, ANTAQ, Painel de Preços and similar is usually bot protection: confirm in a browser.");
