"use client";

import type { ReactNode } from "react";

type ScrollyLayoutProps = {
  figure: ReactNode;
  children: ReactNode;
};

export function ScrollyLayout({ figure, children }: ScrollyLayoutProps) {
  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] lg:gap-12 lg:px-8">
      <div className="relative space-y-[70vh] lg:space-y-[85vh]">{children}</div>
      <div className="hidden lg:block">
        <div className="sticky top-[4.5rem]">{figure}</div>
      </div>
    </div>
  );
}

export function MobileFigure({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 lg:hidden">{children}</div>
  );
}

export function ScrollyStepBlock({
  index,
  total,
  title,
  narration,
  setRef,
  setScrollTrackRef,
  inlineFigure,
  mobileFigure,
  tall,
  scrollFill,
  isComplete,
  needsAction,
}: {
  index: number;
  total: number;
  title: string;
  narration: string;
  setRef: (node: HTMLElement | null) => void;
  setScrollTrackRef?: (node: HTMLElement | null) => void;
  /** 需点击互动的步骤：桌面/移动都在正文旁显示 */
  inlineFigure?: ReactNode;
  mobileFigure?: ReactNode;
  tall?: boolean;
  scrollFill?: boolean;
  isComplete?: boolean;
  needsAction?: boolean;
}) {
  return (
    <section
      ref={setRef}
      className={`flex flex-col scroll-mt-32 ${
        tall
          ? "min-h-[220vh] justify-start"
          : "min-h-[50vh] justify-center"
      }`}
      aria-label={`步骤 ${index + 1}：${title}${isComplete ? "，已完成" : ""}`}
    >
      <p className="mb-2 font-mono text-xs uppercase tracking-widest text-ink-faint">
        步骤 {index + 1} / {total}
        {isComplete && (
          <span className="ml-2 text-success">✓</span>
        )}
      </p>
      {needsAction && (
        <p
          className="mb-3 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-sm text-accent"
          role="status"
        >
          {scrollFill
            ? "继续向下滚动，右侧方块会一格一格铺起来。"
            : "请先完成这一步的互动，再往下滚动。"}
        </p>
      )}
      <h2
        className="mb-4 text-2xl font-medium leading-snug text-ink md:text-3xl"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {title}
      </h2>
      {inlineFigure}
      {mobileFigure}
      <p className="max-w-prose text-base leading-relaxed text-ink-soft md:text-lg">
        {narration}
      </p>
      {scrollFill && (
        <>
          <div
            ref={setScrollTrackRef}
            className="min-h-[150vh] w-full flex-1"
            aria-hidden
          />
          <p className="pb-16 text-sm text-ink-muted">
            ↓ 继续滚动，直到右侧方块全部铺满
          </p>
        </>
      )}
    </section>
  );
}
