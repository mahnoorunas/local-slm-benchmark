# Local SLM Benchmark

Compare three small open-weight language models served **locally** by [Ollama](https://ollama.com). Everything stays offline — no OpenAI, Anthropic, Gemini, or other paid APIs.

This repo also includes a **static Next.js portfolio site** that displays benchmark numbers from `results.csv` (converted to `data/results.json` at build time).

> **Note:** this dashboard displays results from local benchmarking runs (see `benchmark.py` in this repo); **no inference happens on this deployed site.**

## Prerequisites (Python benchmark)

1. **Python 3.10+**
2. **[Ollama](https://ollama.com/download)** installed and running (`ollama serve` if needed; default API: `http://localhost:11434`)
3. Pull the models (already pulled? skip):

```bash
ollama pull llama3.2:1b
ollama pull qwen2.5:1.5b
ollama pull phi3.5
```

| Model | Approx. size | Notes |
|-------|--------------|--------|
| `llama3.2:1b` | ~1.3 GB | Meta Llama 3.2 1B |
| `qwen2.5:1.5b` | ~1 GB | Qwen2.5 1.5B |
| `phi3.5` | ~2.2 GB | Phi-3.5-mini (Ollama has no `phi3.5:mini` tag; `phi3.5` *is* mini) |

Fallback if `phi3.5` is unavailable: `gemma2:2b` (document any substitution in TRADEOFFS.md).

## Python setup & scripts

```bash
pip install -r requirements.txt
```

| Script | What it does |
|--------|----------------|
| `benchmark.py` | Runs 7 fixed prompts on each model; writes `results.csv`. |
| `score_manually.py` | Rate each response 1–5; adds `len_chars` / `keyword_hit`. |
| `plot_results.py` | PNG charts under `results/`. |

```bash
python benchmark.py
python score_manually.py
python plot_results.py
```

## Portfolio site (Next.js)

App Router site. Pages are generated as **static** at build time. Reads **only** `data/results.json` and `TRADEOFFS.md` — never calls Ollama or any paid API.

```bash
npm install
npm run dev      # regenerates JSON from results.csv, then next dev
npm run build    # Next.js production build (Vercel-ready)
```

Pages:

- `/` — intro + model summary
- `/results` — Recharts speed bar + quality scatter + raw table
- `/tradeoffs` — styled `TRADEOFFS.md`

### Deploy on Vercel (free)

1. Push this repo to GitHub and import it in Vercel (**Framework Preset: Next.js**, root = repo root).
2. Build command: `npm run build` (runs `prebuild` → `scripts/csv-to-json.mjs`).
3. **Leave Output Directory empty** — do not set it to `out`. Vercel uses the Next.js builder (`.next`), not a static-export folder.
4. No env vars or secrets needed.

If you previously set Output Directory to `out`, clear it and redeploy — that mismatch is a common cause of `404: NOT_FOUND`.

Commit `results.csv` so the build has data; `prebuild` regenerates `data/results.json` on every deploy.

## Output artifacts

- `results.csv` — raw + scored results
- `data/results.json` — site data (generated)
- `results/*.png` — matplotlib charts from the Python path
- `TRADEOFFS.md` — privacy / latency / cost / quality-vs-speed
