import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SiteNav } from "@/components/SiteNav";

export default function TradeoffsPage() {
  const mdPath = path.join(process.cwd(), "TRADEOFFS.md");
  const markdown = fs.readFileSync(mdPath, "utf8");

  return (
    <>
      <SiteNav active="/tradeoffs" />
      <main className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-10 sm:py-12 md:py-16">
        <article className="motion-safe-fade prose-tradeoffs panel-glass rounded-xl px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10 overflow-x-auto">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        </article>
      </main>
    </>
  );
}
