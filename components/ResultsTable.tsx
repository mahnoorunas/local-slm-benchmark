import type { BenchmarkRow } from "@/lib/types";

const PROMPT_LABELS: Record<string, string> = {
  sum01: "Summarization",
  code01: "Coding",
  qa01: "Factual Q&A",
  reason01: "Reasoning",
  write01: "Creative writing",
  instr01: "Instruction-following",
  fact02: "Factual (one-word)",
};

export function ResultsTable({ rows }: { rows: BenchmarkRow[] }) {
  return (
    <>
      {/* Mobile: stacked cards */}
      <ul className="md:hidden space-y-3" aria-label="Benchmark runs">
        {rows.map((r, i) => (
          <li
            key={`${r.model}-${r.prompt_id}-${r.run}-${i}`}
            className="panel-glass rounded-xl px-4 py-3.5"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-mono text-sm text-cyan break-all">{r.model}</p>
              <p className="font-mono text-sm tabular-nums text-amber shrink-0">
                {r.tokens_per_sec.toFixed(1)} t/s
              </p>
            </div>
            <p className="mt-1.5 font-body text-sm text-mist">
              {PROMPT_LABELS[r.prompt_id] ?? r.prompt_id}
              <span className="ml-1.5 font-mono text-xs text-muted">
                ({r.prompt_id})
              </span>
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-2 font-mono text-[11px] text-muted border-t border-line pt-3">
              <div>
                <dt className="uppercase tracking-wide">Latency</dt>
                <dd className="text-ink tabular-nums text-sm mt-0.5">
                  {r.latency_s.toFixed(2)}s
                </dd>
              </div>
              <div>
                <dt className="uppercase tracking-wide">Quality</dt>
                <dd className="text-ink tabular-nums text-sm mt-0.5">
                  {r.quality_score == null ? "—" : r.quality_score}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      {/* Desktop / tablet: table */}
      <div className="hidden md:block overflow-x-auto rounded-xl panel-glass -mx-0">
        <p className="sr-only">Scroll horizontally if needed on narrower tablets.</p>
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-line font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              <th className="px-4 py-3 font-medium">Model</th>
              <th className="px-4 py-3 font-medium">Prompt type</th>
              <th className="px-4 py-3 font-medium">Latency (s)</th>
              <th className="px-4 py-3 font-medium">Tokens/sec</th>
              <th className="px-4 py-3 font-medium">Quality</th>
            </tr>
          </thead>
          <tbody className="font-mono text-[13px]">
            {rows.map((r, i) => (
              <tr
                key={`${r.model}-${r.prompt_id}-${r.run}-${i}`}
                className="border-b border-line/60 transition-colors duration-150 hover:bg-cyan/[0.06]"
              >
                <td className="px-4 py-2.5 text-cyan whitespace-nowrap">
                  {r.model}
                </td>
                <td className="px-4 py-2.5 font-body text-mist">
                  {PROMPT_LABELS[r.prompt_id] ?? r.prompt_id}
                  <span className="ml-1.5 text-muted text-xs">
                    ({r.prompt_id})
                  </span>
                </td>
                <td className="px-4 py-2.5 tabular-nums text-ink/90">
                  {r.latency_s.toFixed(2)}
                </td>
                <td className="px-4 py-2.5 tabular-nums text-amber">
                  {r.tokens_per_sec.toFixed(2)}
                </td>
                <td className="px-4 py-2.5 tabular-nums text-ink">
                  {r.quality_score == null ? "—" : r.quality_score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
