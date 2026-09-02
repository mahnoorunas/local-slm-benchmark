import Link from "next/link";

const links = [
  { href: "/", label: "Overview" },
  { href: "/results", label: "Results" },
  { href: "/tradeoffs", label: "Tradeoffs" },
];

export function SiteNav({ active }: { active: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-void/80 backdrop-blur-xl pt-[env(safe-area-inset-top)]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-3 sm:py-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <Link
          href="/"
          className="group font-display font-extrabold text-base sm:text-lg tracking-tight text-ink transition-colors hover:text-cyan shrink-0"
        >
          <span className="text-cyan mr-1.5 opacity-80 group-hover:opacity-100">
            ◈
          </span>
          <span className="sm:hidden">Local SLM</span>
          <span className="hidden sm:inline">Local SLM Benchmark</span>
        </Link>
        <nav
          className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-1 font-mono text-sm overflow-x-auto overscroll-x-contain scrollbar-none"
          aria-label="Main"
        >
          {links.map((l) => {
            const isActive = active === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative shrink-0 px-3 py-2 sm:py-1.5 rounded-md transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan touch-manipulation ${
                  isActive
                    ? "bg-cyan/15 text-cyan shadow-glow-sm"
                    : "text-muted hover:text-ink hover:bg-panel"
                }`}
              >
                {l.label}
                {isActive && (
                  <span className="absolute inset-x-2 -bottom-px h-px bg-gradient-to-r from-transparent via-cyan to-transparent" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
