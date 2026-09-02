"""Plot speed and speed-vs-quality charts from results.csv."""

from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd

ROOT = Path(__file__).resolve().parent
RESULTS_CSV = ROOT / "results.csv"
OUT_DIR = ROOT / "results"


def main() -> None:
    if not RESULTS_CSV.exists():
        raise SystemExit(f"Missing {RESULTS_CSV}. Run benchmark.py first.")

    df = pd.read_csv(RESULTS_CSV)
    OUT_DIR.mkdir(exist_ok=True)

    speed = df.groupby("model", as_index=False)["tokens_per_sec"].mean()

    fig, ax = plt.subplots(figsize=(7, 4))
    ax.bar(speed["model"], speed["tokens_per_sec"], color="#3d5a5b")
    ax.set_ylabel("Avg tokens/sec")
    ax.set_title("Local SLM speed (Ollama)")
    ax.tick_params(axis="x", rotation=15)
    fig.tight_layout()
    bar_path = OUT_DIR / "speed_by_model.png"
    fig.savefig(bar_path, dpi=120)
    plt.close(fig)
    print(f"Wrote {bar_path}")

    if "quality_score" not in df.columns or df["quality_score"].notna().sum() == 0:
        raise SystemExit(
            "No quality_score values in results.csv. Run score_manually.py first."
        )

    scored = df.dropna(subset=["quality_score"])
    agg = scored.groupby("model", as_index=False).agg(
        tokens_per_sec=("tokens_per_sec", "mean"),
        quality_score=("quality_score", "mean"),
    )

    fig, ax = plt.subplots(figsize=(7, 4))
    ax.scatter(agg["tokens_per_sec"], agg["quality_score"], s=80, color="#c45c26")
    for _, r in agg.iterrows():
        ax.annotate(r["model"], (r["tokens_per_sec"], r["quality_score"]), xytext=(6, 4), textcoords="offset points")
    ax.set_xlabel("Avg tokens/sec")
    ax.set_ylabel("Mean quality (1–5)")
    ax.set_title("Speed vs quality")
    ax.set_ylim(0.5, 5.5)
    fig.tight_layout()
    scatter_path = OUT_DIR / "speed_vs_quality.png"
    fig.savefig(scatter_path, dpi=120)
    plt.close(fig)
    print(f"Wrote {scatter_path}")


if __name__ == "__main__":
    main()
