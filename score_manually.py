"""Rate benchmark responses 1–5 by hand; add trivial auto proxies."""

from __future__ import annotations

from pathlib import Path

import pandas as pd

RESULTS_PATH = Path(__file__).resolve().parent / "results.csv"

# Expected keywords (case-insensitive) for factual / constrained prompts.
EXPECTED_KEYWORDS: dict[str, list[str]] = {
    "qa01": ["paris"],
    "fact02": ["saturn"],
    "instr01": ["- "],
}


def keyword_hit(prompt_id: str, response: str) -> int:
    keys = EXPECTED_KEYWORDS.get(prompt_id)
    if not keys:
        return 0
    lower = (response or "").lower()
    return int(any(k.lower() in lower for k in keys))


def main() -> None:
    if not RESULTS_PATH.exists():
        raise SystemExit(f"Missing {RESULTS_PATH}. Run benchmark.py first.")

    df = pd.read_csv(RESULTS_PATH)
    if "quality_score" not in df.columns:
        df["quality_score"] = pd.NA

    df["len_chars"] = df["response"].fillna("").astype(str).str.len()
    df["keyword_hit"] = [
        keyword_hit(pid, resp)
        for pid, resp in zip(df["prompt_id"], df["response"].fillna(""))
    ]

    print("Rate each response 1–5 (Enter to keep existing / skip, 'q' to quit early).\n")
    for i, row in df.iterrows():
        print("=" * 60)
        print(f"[{i + 1}/{len(df)}] {row['model']} | {row['prompt_id']} | run {row.get('run', 1)}")
        print("-" * 40)
        print(f"PROMPT: {row['prompt'][:200]}{'...' if len(str(row['prompt'])) > 200 else ''}")
        print("-" * 40)
        print(row["response"])
        print("-" * 40)
        existing = row.get("quality_score")
        hint = f" [current={existing}]" if pd.notna(existing) else ""
        raw = input(f"Score 1–5{hint}: ").strip().lower()
        if raw == "q":
            break
        if raw == "":
            continue
        if raw not in {"1", "2", "3", "4", "5"}:
            print("Ignored (need 1–5).")
            continue
        df.at[i, "quality_score"] = int(raw)

    df.to_csv(RESULTS_PATH, index=False)
    scored = df["quality_score"].notna().sum()
    print(f"\nSaved {RESULTS_PATH} ({scored}/{len(df)} scored).")


if __name__ == "__main__":
    main()
