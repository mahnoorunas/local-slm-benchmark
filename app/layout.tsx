import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Local SLM Benchmark",
  description:
    "Portfolio showcase of offline small language model benchmarks via Ollama — privacy, latency, cost, and quality vs speed.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#070B12",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen min-h-[100dvh] flex flex-col relative overflow-x-hidden">
          <div
            className="orb w-64 h-64 sm:w-[420px] sm:h-[420px] bg-cyan/20 -top-24 -left-16 sm:-top-32 sm:-left-24"
            aria-hidden
          />
          <div
            className="orb w-56 h-56 sm:w-[360px] sm:h-[360px] bg-amber/15 top-[50%] -right-20 sm:top-[40%] sm:-right-28"
            style={{ animationDelay: "2s" }}
            aria-hidden
          />
          {children}
          <footer className="mt-auto border-t border-line/80 py-6 sm:py-7 px-4 text-center font-mono text-[11px] sm:text-xs text-muted pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <span className="inline-flex flex-wrap items-center justify-center gap-2 max-w-prose mx-auto">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan shadow-glow-sm animate-pulse" />
              Static showcase · no live inference · data from local Ollama runs
            </span>
          </footer>
        </div>
      </body>
    </html>
  );
}
