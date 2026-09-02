# Tradeoffs: Local SLMs via Ollama

Numbers below come from one run of `benchmark.py` on this machine (3 models × 7 prompts, `--runs 1`), plus hand quality scores (1–5) written into `results.csv`. Charts: `results/speed_by_model.png`, `results/speed_vs_quality.png`.

## Measured summary

| Model | Avg tokens/sec | Avg latency (s) | Mean quality (1–5) | Keyword hits (of 3 factual/constrained checks) |
|-------|----------------|-----------------|--------------------|------------------------------------------------|
| `qwen2.5:1.5b` | **15.2** | 8.4 | 3.57 | 2 |
| `llama3.2:1b` | 11.8 | 4.9 | **3.86** | 3 |
| `phi3.5` | 6.9 | 46.2 | 3.29 | 3 |

Hardware note: throughput is whatever this PC delivered through Ollama (CPU and/or GPU). Absolute tokens/sec will differ on other machines; the **relative** ordering is the useful takeaway.

## Privacy

All prompts and completions stayed on `localhost:11434`. Nothing was sent to OpenAI, Anthropic, Gemini, or any other hosted API. That matters for health notes, legal drafts, internal docs, or anything you would not paste into a third-party chat product. Tradeoff: you own the risk surface (disk, OS access, who can call Ollama on your LAN) instead of a vendor’s logging policy.

## Latency

There is no cloud round-trip, but local hardware caps speed:

- Short factual answers finished in under ~2 seconds on the small models (`qa01`, `fact02`).
- Heavier prompts (reasoning, long creative output) stretched to tens of seconds — and `phi3.5` ballooned on `write01` / `instr01` (100s+ seconds, hundreds of tokens) when it ignored length instructions and kept generating.
- Fastest average throughput: **qwen2.5:1.5b (~15 t/s)**. Slowest: **phi3.5 (~7 t/s)**, roughly **2× slower** than Qwen on this run.

So “local = low latency” is true for short answers; for long generations, tokens/sec and instruction-following dominate wait time.

## Cost

No per-token API bill. Cost is hardware you already have (or buy once) plus electricity.

**Back-of-envelope for ~1M generated tokens/month:**

- At ~12 tokens/sec sustained, 1M tokens ≈ 23 hours of generation.
- At ~100 W draw while generating and ~$0.15/kWh: ≈ 2.3 kWh ≈ **~$0.35/month** of electricity for that volume.
- Cloud chat APIs often charge on the order of **tenths of a dollar to several dollars per million tokens** (model-dependent; prices change). At modest monthly volume, electricity can undercut API spend; at huge volume or if you buy a GPU just for this, hardware amortization dominates.

Local also has an opportunity cost: your machine is busy while generating.

## Quality vs speed

- **Fastest:** `qwen2.5:1.5b` — best tokens/sec, solid summarization and reasoning (correct bat/ball at $0.05), but failed the one-word planet question (`Jupiter` instead of Saturn) and the palindrome snippet ignored spaces.
- **Best mean quality score:** `llama3.2:1b` — slightly slower than Qwen, but hit Paris + Saturn, followed the 4-line poem and bullet format more cleanly, and solved the bat/ball puzzle. Weak on the coding prompt (broken palindrome check).
- **Slowest / weakest overall here:** `phi3.5` — richer when short answers worked (Paris, Saturn, decent summary), but often **verbose and poorly constrained**: long runaway poems and multi-revision bullet dumps crushed latency and dragged the quality average down despite being the largest model in the set (~3.8B / 2.2 GB).

**Tradeoff in one line:** on this CPU/GPU and these prompts, the **1–1.5B models were both faster and easier to live with** than `phi3.5`; Qwen wins raw speed, Llama 3.2 1B wins the hand score by following instructions a bit more reliably. Pick Qwen when throughput matters most; pick Llama 3.2 1B when short, constrained answers matter more; reserve larger local models when you need deeper reasoning *and* you tighten `num_predict` / stop sequences so they cannot ramble.

## How to reproduce

```bash
python benchmark.py
python score_manually.py   # re-rate if you disagree with the hand scores
python plot_results.py
```
