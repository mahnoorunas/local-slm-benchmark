import { QualityScatter } from "@/components/QualityScatter";
import { ResultsTable } from "@/components/ResultsTable";
import { SiteNav } from "@/components/SiteNav";
import { SpeedChart } from "@/components/SpeedChart";
import { getBenchmarkData } from "@/lib/data";

export default function ResultsPage() {
  const { models, rows, generated_at } = getBenchmarkData();

  return (
    <>
      <SiteNav active="/results" />
      <main className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-10 sm:py-12 md:py-16">
        <div className="motion-safe-fade">
          <h1 className="font-display text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight">
            Results
          </h1>
          <p className="mt-3 font-body text-sm sm:text-base text-mist max-w-2xl">
            Static snapshot from{" "}
            <code className="font-mono text-xs sm:text-sm text-cyan break-all">
              results.csv
            </code>
            . Means for charts; every prompt run in the table below.
          </p>
          <p className="mt-2 font-mono text-[11px] sm:text-xs text-muted break-words">
            JSON generated {new Date(generated_at).toLocaleString()}
          </p>
        </div>

        <section
          className="motion-safe-fade motion-delay-1 mt-8 sm:mt-10"
          aria-labelledby="speed-heading"
        >
          <h2
            id="speed-heading"
            className="font-display text-lg sm:text-xl font-bold text-cyan"
          >
            Average tokens/sec
          </h2>
          <div className="mt-3 sm:mt-4 panel-glass p-3 sm:p-4 md:p-6 rounded-xl overflow-hidden">
            <SpeedChart models={models} />
          </div>
        </section>

        <section
          className="motion-safe-fade motion-delay-2 mt-10 sm:mt-12"
          aria-labelledby="scatter-heading"
        >
          <h2
            id="scatter-heading"
            className="font-display text-lg sm:text-xl font-bold text-cyan"
          >
            Quality vs speed
          </h2>
          <div className="mt-3 sm:mt-4 panel-glass p-3 sm:p-4 md:p-6 rounded-xl overflow-hidden">
            <QualityScatter models={models} />
          </div>
        </section>

        <section
          className="motion-safe-fade motion-delay-3 mt-10 sm:mt-12"
          aria-labelledby="table-heading"
        >
          <h2
            id="table-heading"
            className="font-display text-lg sm:text-xl font-bold text-cyan"
          >
            Raw runs
          </h2>
          <p className="mt-1 mb-4 font-body text-sm text-muted">
            {rows.length} rows · model × prompt
          </p>
          <ResultsTable rows={rows} />
        </section>
      </main>
    </>
  );
}
