"""Benchmark small local SLMs via Ollama. Offline only — localhost:11434."""

from __future__ import annotations

import argparse
import time
from pathlib import Path

import ollama
import pandas as pd

DEFAULT_MODELS = ["llama3.2:1b", "qwen2.5:1.5b", "phi3.5"]
RESULTS_PATH = Path(__file__).resolve().parent / "results.csv"

PROMPTS: list[dict[str, str]] = [
    {
        "id": "sum01",
        "prompt": (
            "Summarize in 2–3 sentences: Local language models run on your own "
            "hardware, so prompts never leave the machine. They are slower than "
            "cloud APIs on modest CPUs, but avoid per-token fees and third-party logging."
        ),
    },
    {
        "id": "code01",
        "prompt": (
            "Write a Python function `is_palindrome(s: str) -> bool` that ignores "
            "spaces and case. Return only the function, no explanation."
        ),
    },
    {
        "id": "qa01",
        "prompt": "What is the capital of France? Answer in one short sentence.",
    },
    {
        "id": "reason01",
        "prompt": (
            "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than "
            "the ball. How much does the ball cost? Show one line of reasoning, "
            "then the answer."
        ),
    },
    {
        "id": "write01",
        "prompt": (
            "Write a 4-line poem about a laptop that only works offline. "
            "No title, just the poem."
        ),
    },
    {
        "id": "instr01",
        "prompt": (
            "Reply with exactly three bullet points, each starting with '- ', "
            "listing benefits of running AI models locally. No other text."
        ),
    },
    {
        "id": "fact02",
        "prompt": (
            "Name the planet in our solar system that is known for its prominent rings. "
            "One word answer only."
        ),
    },
]


def run_one(model: str, prompt: str) -> dict:
    t0 = time.perf_counter()
    resp = ollama.generate(model=model, prompt=prompt)
    latency_s = time.perf_counter() - t0

    text = (resp.get("response") or "").strip()
    tokens = int(resp.get("eval_count") or 0)
    # Prefer Ollama's eval_duration (ns) when present; else wall clock.
    eval_ns = resp.get("eval_duration")
    if eval_ns and eval_ns > 0 and tokens > 0:
        tokens_per_sec = tokens / (eval_ns / 1e9)
    elif latency_s > 0 and tokens > 0:
        tokens_per_sec = tokens / latency_s
    else:
        tokens_per_sec = 0.0

    return {
        "latency_s": round(latency_s, 4),
        "tokens": tokens,
        "tokens_per_sec": round(tokens_per_sec, 2),
        "response": text,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Local Ollama SLM benchmark")
    parser.add_argument(
        "--models",
        nargs="+",
        default=DEFAULT_MODELS,
        help="Ollama model tags to benchmark",
    )
    parser.add_argument("--runs", type=int, default=1, help="Repeats per prompt (default 1)")
    parser.add_argument(
        "--prompt-id",
        default=None,
        help="Run only this prompt id (smoke test)",
    )
    parser.add_argument(
        "--out",
        type=Path,
        default=RESULTS_PATH,
        help="Output CSV path",
    )
    args = parser.parse_args()

    prompts = PROMPTS
    if args.prompt_id:
        prompts = [p for p in PROMPTS if p["id"] == args.prompt_id]
        if not prompts:
            raise SystemExit(f"Unknown prompt id: {args.prompt_id}")

    rows: list[dict] = []
    for model in args.models:
        print(f"\n=== {model} ===")
        for p in prompts:
            for run in range(1, args.runs + 1):
                print(f"  {p['id']} run {run}/{args.runs} ...", end=" ", flush=True)
                try:
                    m = run_one(model, p["prompt"])
                except Exception as e:
                    print(f"ERROR: {e}")
                    m = {
                        "latency_s": 0.0,
                        "tokens": 0,
                        "tokens_per_sec": 0.0,
                        "response": f"ERROR: {e}",
                    }
                print(f"{m['latency_s']}s, {m['tokens']} tok, {m['tokens_per_sec']} t/s")
                rows.append(
                    {
                        "model": model,
                        "prompt_id": p["id"],
                        "prompt": p["prompt"],
                        "run": run,
                        "latency_s": m["latency_s"],
                        "tokens": m["tokens"],
                        "tokens_per_sec": m["tokens_per_sec"],
                        "response": m["response"],
                    }
                )

    df = pd.DataFrame(rows)
    df.to_csv(args.out, index=False)
    print(f"\nWrote {len(df)} rows -> {args.out}")


if __name__ == "__main__":
    main()
