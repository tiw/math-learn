import Link from "next/link";
import { catalog } from "@/content/catalog";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      <p className="mb-2 font-mono text-xs uppercase tracking-widest text-ink-faint">
        math-learn
      </p>
      <h1
        className="mb-4 text-4xl font-medium text-ink"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        交互式数学
      </h1>
      <p className="mb-12 max-w-prose text-lg leading-relaxed text-ink-soft">
        数学不是静态的，更应该是动态的。滚动阅读、动手操作，把三年级下册的
        知识「演」出来。
      </p>

      <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-ink-muted">
        三年级下册 · 目录
      </h2>
      <ul className="space-y-3">
        {catalog.map((chapter) => (
          <li key={chapter.id}>
            {chapter.status === "ready" && chapter.href ? (
              <Link
                href={chapter.href}
                className="group block rounded-2xl border border-border bg-surface p-5 transition hover:border-accent/40 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-ink-faint">
                      第 {chapter.number} 章 · {chapter.pdfPages}
                    </p>
                    <p
                      className="mt-1 text-xl font-medium text-ink group-hover:text-accent"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {chapter.title}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-success/10 px-2 py-0.5 text-xs text-success">
                    可学习
                  </span>
                </div>
              </Link>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-paper/50 p-5 opacity-60">
                <p className="text-xs text-ink-faint">
                  第 {chapter.number} 章 · {chapter.pdfPages}
                </p>
                <p
                  className="mt-1 text-xl font-medium text-ink"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {chapter.title}
                </p>
                <p className="mt-1 text-sm text-ink-muted">即将推出</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
