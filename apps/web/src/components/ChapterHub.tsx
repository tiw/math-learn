"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getChapter } from "@/content/catalog";
import { areaUnitsLesson } from "@/content/ch05-area-units";
import { rectangleLesson } from "@/content/ch05-area-rectangle";
import { subLessonStatus } from "@/lib/lesson-storage";

const LESSON_META: Record<
  string,
  { lessonId: string; stepIds: string[]; quizIds: string[] }
> = {
  "area-units": {
    lessonId: areaUnitsLesson.id,
    stepIds: areaUnitsLesson.steps.map((s) => s.id),
    quizIds: areaUnitsLesson.quiz.map((q) => q.id),
  },
  "area-rectangle": {
    lessonId: rectangleLesson.id,
    stepIds: rectangleLesson.steps.map((s) => s.id),
    quizIds: rectangleLesson.quiz.map((q) => q.id),
  },
};

function statusLabel(status: ReturnType<typeof subLessonStatus>) {
  switch (status) {
    case "completed":
      return { text: "已完成", className: "bg-success/10 text-success" };
    case "in-progress":
      return { text: "进行中", className: "bg-accent/10 text-accent" };
    default:
      return { text: "未开始", className: "bg-border/50 text-ink-faint" };
  }
}

export function ChapterHub({ chapterId }: { chapterId: string }) {
  const chapter = getChapter(chapterId);
  const [mounted, setMounted] = useState(false);
  const [, bump] = useState(0);

  useEffect(() => {
    setMounted(true);
    const onStorage = () => bump((n) => n + 1);
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!chapter?.subLessons) return null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-ink-muted transition hover:text-accent"
      >
        ← 返回全书目录
      </Link>
      <p className="mb-2 font-mono text-xs uppercase tracking-widest text-ink-faint">
        第 {chapter.number} 章 · 教材 {chapter.pdfPages}
      </p>
      <h1
        className="mb-4 text-4xl font-medium text-ink"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {chapter.title}
      </h1>
      <p className="mb-10 text-lg text-ink-soft">
        这一章分成几个小课时，按顺序学习效果更好。
      </p>

      <ul className="space-y-3">
        {chapter.subLessons.map((lesson, i) => {
          const meta = LESSON_META[lesson.id];
          const status =
            mounted && meta
              ? subLessonStatus(meta.lessonId, meta.stepIds, meta.quizIds)
              : "not-started";
          const badge = statusLabel(status);

          return (
            <li key={lesson.id}>
              {lesson.status === "ready" ? (
                <Link
                  href={lesson.href}
                  className="group flex items-start gap-4 rounded-2xl border border-border bg-surface p-5 transition hover:border-accent/40 hover:shadow-md"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-sm text-accent">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs text-ink-faint">{lesson.pages}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${badge.className}`}
                      >
                        {badge.text}
                      </span>
                    </div>
                    <p
                      className="mt-0.5 text-xl font-medium text-ink group-hover:text-accent"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {lesson.title}
                    </p>
                    <p className="mt-1 text-sm text-ink-muted">
                      {lesson.subtitle}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="flex items-start gap-4 rounded-2xl border border-dashed border-border bg-paper/50 p-5 opacity-60">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-border font-mono text-sm text-ink-faint">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-xl font-medium text-ink">{lesson.title}</p>
                    <p className="mt-1 text-sm text-ink-muted">即将推出</p>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
}
