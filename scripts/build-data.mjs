import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const csvPath = path.join(root, "data", "sources.csv");
const outPath = path.join(root, "src", "sources.json");
const publicCsvPath = path.join(root, "public", "data", "sources.csv");

function parseCsv(text) {
  const rows = [];
  let field = "";
  let row = [];
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }

  const [headers, ...records] = rows;
  return records
    .filter((record) => record.some(Boolean))
    .map((record) =>
      Object.fromEntries(headers.map((header, index) => [header, record[index] ?? ""])),
    );
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function inferAccessType(row) {
  const text = `${row["Access Method"]} ${row["Auth Required"]}`.toLowerCase();
  if (text.includes("oauth") || text.includes("login") || text.includes("restricted")) return "Restricted";
  if (text.includes("paid")) return "Paid";
  if (text.includes("token") || text.includes("key") || text.includes("free google cloud")) return "Free key";
  if (text.includes("api")) return "Open API";
  return "Open";
}

function extractFirstUrl(value) {
  const match = value.match(/https?:\/\/[^\s;)]+/i);
  if (!match) return "";

  return match[0].replace(/[.,]+$/, "");
}

function normalize(row, index) {
  const name = row.Name.trim();
  return {
    id: `${slugify(name)}-${index + 1}`,
    name,
    agency: row.Agency.trim(),
    level: row.Level.trim(),
    location: row["State/Municipality"].trim(),
    domain: row.Domain.trim(),
    url: extractFirstUrl(row.URL),
    rawUrl: row.URL.trim(),
    docs: extractFirstUrl(row["API/Docs"]),
    rawDocs: row["API/Docs"].trim(),
    accessMethod: row["Access Method"].trim(),
    accessType: inferAccessType(row),
    formats: row.Formats.split(",").map((item) => item.trim()).filter(Boolean),
    granularity: row.Granularity.trim(),
    coverage: row["Temporal Coverage"].trim(),
    updateFrequency: row["Update Frequency"].trim(),
    description: row["What You Can Get"].trim(),
    license: row["License/Terms"].trim(),
    authRequired: row["Auth Required"].trim(),
    limitations: row.Limitations.trim(),
    relevance: row["Venture Relevance"].trim(),
    lastVerified: row["Last Verified"].trim(),
  };
}

const rows = parseCsv(await readFile(csvPath, "utf8"));
const csvText = await readFile(csvPath, "utf8");
const sources = rows.map(normalize);
const summary = {
  sourceCount: sources.length,
  lastVerified: sources.reduce((latest, item) => (item.lastVerified > latest ? item.lastVerified : latest), ""),
  domains: [...new Set(sources.map((item) => item.domain))].sort(),
  levels: [...new Set(sources.map((item) => item.level))].sort(),
  relevance: [...new Set(sources.map((item) => item.relevance))].sort(),
};

await writeFile(outPath, `${JSON.stringify({ summary, sources }, null, 2)}\n`);
await mkdir(path.dirname(publicCsvPath), { recursive: true });
await writeFile(publicCsvPath, csvText);
console.log(`Built ${sources.length} sources -> ${path.relative(root, outPath)}`);
