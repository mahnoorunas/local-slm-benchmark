import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { getBenchmarkData } from "@/lib/data";

const MODEL_BLURBS: Record<string, string> = {
  "llama3.2:1b": "Meta Llama 3.2 1B — small, instruction-friendly, ~1.3 GB.",
  "qwen2.5:1.5b": "Qwen2.5 1.5B — strongest raw throughput on this machine.",
  "phi3.5": "Phi-3.5-mini (~3.8B / 2.2 GB) — larger, slower, often verbose here.",
};

export default function HomePage() {
  const { models } = getBenchmarkData();
  const fastest = [...models].sort(
    (a, b) => b.avg_tokens_per_sec - a.avg_tokens_per_sec
  )[0];
  const bestQ = [...models]
    .filter((m) => m.avg_quality != null)
    .sort((a, b) => (b.avg_quality ?? 0) - (a.avg_quality ?? 0))[0];

  return (
    <>
      <SiteNav active="/" />
      <main className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-10 sm:py-14 md:py-20">
        <div className="max-w-3xl">
          <p className="motion-safe-fade font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.28em] text-cyan mb-4 sm:mb-5">
            Offline · Ollama · open-weight
          </p>
          <h1 className="motion-safe-fade motion-delay-1 font-display text-[2rem] leading-[1.1] sm:text-5xl md:text-6xl font-extrabold tracking-tight text-ink break-words">
            Local SLM{" "}
            <span className="bg-gradient-to-r from-cyan via-cyan to-amber bg-clip-text text-transparent">
              Benchmark
            </span>
          </h1>
          <p className="motion-safe-fade motion-delay-2 mt-4 sm:mt-6 max-w-2xl font-body text-base sm:text-lg md:text-xl leading-relaxed text-mist">
            Same prompts. Three small models. One machine. Measure speed and
            quality without ever sending a token to a cloud API.
          </p>
        </div>

        <section
          className="motion-safe-fade motion-delay-3 mt-10 sm:mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Why local SLMs"
        >
          {[
            {
              title: "Privacy",
              body: "Prompts never leave the box — fit for health, legal, or internal text.",
              accent: "border-l-cyan",
            },
            {
              title: "Latency",
              body: "No cloud RTT. Throughput is capped by your CPU, GPU, and RAM.",
              accent: "border-l-amber",
            },
            {
              title: "Cost",
              body: "No per-token bill — just hardware you own and electricity you burn.",
              accent: "border-l-cyanDim",
            },
          ].map((item, i) => (
            <div
              key={item.title}
              className={`panel-glass panel-hover border-l-2 ${item.accent} px-4 sm:px-5 py-4 sm:py-5 ${
                i === 2 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
              style={{ animationDelay: `${300 + i * 80}ms` }}
            >
              <h2 className="font-display font-bold text-ink tracking-tight">
                {item.title}
              </h2>
              <p className="mt-2 font-body text-sm leading-relaxed text-muted">
                {item.body}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-12 sm:mt-16" aria-labelledby="models-heading">
          <div className="motion-safe-fade motion-delay-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h2
                id="models-heading"
                className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-ink"
              >
                Models compared
              </h2>
              <p className="mt-2 font-body text-sm sm:text-base text-muted max-w-xl">
                Free open-weight tags via{" "}
                <code className="font-mono text-xs sm:text-sm text-cyan break-all">
                  ollama pull
                </code>
                . Seven prompts each; quality scored 1–5 by hand.
              </p>
            </div>
            <p className="font-mono text-[11px] sm:text-xs text-muted leading-relaxed">
              <span className="text-cyan break-all">{fastest?.model}</span>{" "}
              fastest
              <span className="mx-1.5 text-line">·</span>
              <span className="text-amber break-all">{bestQ?.model}</span> best
              quality
            </p>
          </div>

          <div className="mt-6 sm:mt-8 grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {models.map((m, i) => (
              <div
                key={m.model}
                className={`motion-safe-fade panel-glass panel-hover group relative overflow-hidden px-4 sm:px-5 py-5 sm:py-6 ${
                  i === 2 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
                style={{ animationDelay: `${400 + i * 100}ms` }}
              >
                <div
                  className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-cyan/10 blur-2xl transition-opacity group-hover:opacity-100 opacity-60"
                  aria-hidden
                />
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber">
                  Avg tokens/sec
                </p>
                <p className="font-mono text-4xl sm:text-5xl font-semibold tabular-nums mt-2 text-ink group-hover:text-cyan transition-colors duration-300">
                  {m.avg_tokens_per_sec.toFixed(1)}
                </p>
                <p className="font-display font-bold mt-4 sm:mt-5 text-base sm:text-lg text-cyan break-all">
                  {m.model}
                </p>
                <p className="font-body text-sm text-muted mt-1.5 leading-snug">
                  {MODEL_BLURBS[m.model] ?? "Open-weight local model."}
                </p>
                <p className="font-mono text-[11px] sm:text-xs text-muted/80 mt-4 border-t border-line pt-3">
                  quality{" "}
                  <span className="text-ink">
                    {m.avg_quality == null ? "—" : m.avg_quality.toFixed(2)}
                  </span>
                  {" · "}
                  latency{" "}
                  <span className="text-ink">{m.avg_latency_s.toFixed(1)}s</span>
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="motion-safe-fade motion-delay-4 mt-10 sm:mt-14 flex flex-col sm:flex-row flex-wrap gap-3">
          <Link
            href="/results"
            className="shimmer-btn inline-flex items-center justify-center font-display font-bold px-6 py-3.5 sm:py-3 rounded-lg shadow-glow transition-transform hover:scale-[1.02] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan touch-manipulation w-full sm:w-auto"
          >
            View charts &amp; table
          </Link>
          <Link
            href="/tradeoffs"
            className="inline-flex items-center justify-center font-display font-bold border border-line text-ink px-6 py-3.5 sm:py-3 rounded-lg bg-panel/50 hover:border-cyan/40 hover:text-cyan transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan touch-manipulation w-full sm:w-auto"
          >
            Read tradeoffs
          </Link>
        </div>
      </main>
    </>
  );
}
