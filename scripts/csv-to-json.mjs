/**
 * Convert results.csv → data/results.json for the static Next.js site.
 * Runs on predev / prebuild. No network calls.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const csvPath = path.join(root, "results.csv");
const outPath = path.join(root, "data", "results.json");

function parseCsv(text) {
  const rows = [];
  let i = 0;
  let field = "";
  let row = [];
  let inQuotes = false;

  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += c;
      i++;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (c === ",") {
      row.push(field);
      field = "";
      i++;
      continue;
    }
    if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
      i++;
      continue;
    }
    field += c;
    i++;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

if (!fs.existsSync(csvPath)) {
  console.error(`Missing ${csvPath}. Run benchmark.py first.`);
  process.exit(1);
}

const raw = fs.readFileSync(csvPath, "utf8");
const table = parseCsv(raw);
const headers = table[0];
const records = table.slice(1).map((cells) => {
  const obj = {};
  headers.forEach((h, idx) => {
    obj[h] = cells[idx] ?? "";
  });
  return {
    model: obj.model,
    prompt_id: obj.prompt_id,
    prompt: obj.prompt,
    run: Number(obj.run) || 1,
    latency_s: Number(obj.latency_s) || 0,
    tokens: Number(obj.tokens) || 0,
    tokens_per_sec: Number(obj.tokens_per_sec) || 0,
    quality_score:
      obj.quality_score === "" || obj.quality_score == null
        ? null
        : Number(obj.quality_score),
    keyword_hit:
      obj.keyword_hit === "" || obj.keyword_hit == null
        ? null
        : Number(obj.keyword_hit),
  };
});

const models = [...new Set(records.map((r) => r.model))];
const byModel = models.map((model) => {
  const rows = records.filter((r) => r.model === model);
  const tps = rows.map((r) => r.tokens_per_sec);
  const lat = rows.map((r) => r.latency_s);
  const qs = rows
    .map((r) => r.quality_score)
    .filter((v) => v != null && !Number.isNaN(v));
  const avg = (arr) =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  return {
    model,
    avg_tokens_per_sec: Math.round(avg(tps) * 100) / 100,
    avg_latency_s: Math.round(avg(lat) * 100) / 100,
    avg_quality: qs.length ? Math.round(avg(qs) * 100) / 100 : null,
    n: rows.length,
  };
});

const payload = {
  generated_at: new Date().toISOString(),
  source: "results.csv",
  models: byModel,
  rows: records,
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
console.log(`Wrote ${records.length} rows → ${outPath}`);
