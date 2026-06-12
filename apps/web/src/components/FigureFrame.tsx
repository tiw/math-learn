import type { ReactNode } from "react";

type FigureFrameProps = {
  caption?: string;
  cycle: number;
  variant?: "step" | "exercise";
  children: ReactNode;
};

export function FigureFrame({
  caption,
  cycle,
  variant = "step",
  children,
}: FigureFrameProps) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="border-b border-border bg-paper px-4 py-2.5">
        <div className="flex items-center justify-between gap-3">
          {caption ? (
            <figcaption className="text-xs font-medium uppercase tracking-widest text-ink-muted">
              {caption}
            </figcaption>
          ) : (
            <span />
          )}
          <span className="font-mono text-xs text-ink-faint">
            {variant === "exercise"
              ? "动手做"
              : `步骤 ${String(cycle).padStart(2, "0")}`}
          </span>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </figure>
  );
}
