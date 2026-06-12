"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Lesson } from "@/lib/lesson-types";
import {
  isClickInteractiveStep,
  isScrollFillStep,
  stepRequiresCompletion,
} from "@/lib/step-completion";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { useScrolly } from "@/hooks/useScrolly";
import { FigureFrame } from "@/components/FigureFrame";
import { ScrollyLayout } from "@/components/ScrollyLayout";
import { QuizSection } from "@/components/QuizSection";
import { StepProgress } from "@/components/StepProgress";
import { ScrollyStepItem } from "@/components/ScrollyStepItem";
import { WidgetRenderer } from "@/components/widgets/registry";

type LessonViewProps = {
  lesson: Lesson;
};

function StickyFigure({
  step,
  cycle,
  scrollTrackNode,
  onComplete,
}: {
  step: Lesson["steps"][number];
  cycle: number;
  scrollTrackNode: HTMLElement | null;
  onComplete?: () => void;
}) {
  return (
    <FigureFrame caption={step.caption} cycle={cycle}>
      <WidgetRenderer
        config={step.widget}
        cycle={cycle}
        stepKey={step.id}
        scrollTrackNode={
          isScrollFillStep(step) ? scrollTrackNode : undefined
        }
        onComplete={onComplete}
      />
    </FigureFrame>
  );
}

export function LessonView({ lesson }: LessonViewProps) {
  const {
    progress,
    markStepComplete,
    setLastStep,
    setQuizStatus,
    markLessonComplete,
    isStepComplete,
  } = useLessonProgress(lesson.id);

  const maxActiveIndex = useMemo(() => {
    for (let i = 0; i < lesson.steps.length; i += 1) {
      const step = lesson.steps[i];
      if (stepRequiresCompletion(step) && !isStepComplete(step.id)) {
        return i;
      }
    }
    return lesson.steps.length - 1;
  }, [lesson.steps, isStepComplete]);

  const scrollFillPromoteIndex = useMemo(() => {
    const idx = lesson.steps.findIndex(isScrollFillStep);
    if (idx < 0) return undefined;
    if (isStepComplete(lesson.steps[idx].id)) return undefined;
    return idx;
  }, [lesson.steps, isStepComplete]);

  const { activeIndex, setStepRef, scrollToStep } = useScrolly(
    lesson.steps.length,
    lesson.id,
    maxActiveIndex,
    scrollFillPromoteIndex,
  );
  const activeStep = lesson.steps[activeIndex] ?? lesson.steps[0];
  const [scrollTrackNodes, setScrollTrackNodes] = useState<
    (HTMLElement | null)[]
  >([]);

  const figureStepIndex = useMemo(() => {
    const locked = maxActiveIndex;
    const lockedStep = lesson.steps[locked];
    if (
      isScrollFillStep(lockedStep) &&
      !isStepComplete(lockedStep.id) &&
      activeIndex >= locked
    ) {
      return locked;
    }
    return activeIndex;
  }, [maxActiveIndex, activeIndex, lesson.steps, isStepComplete]);

  const figureStep = lesson.steps[figureStepIndex] ?? lesson.steps[0];

  const handleStepRef = useCallback(
    (index: number, node: HTMLElement | null) => {
      setStepRef(index, node);
    },
    [setStepRef],
  );

  const handleScrollTrackRef = useCallback(
    (index: number, node: HTMLElement | null) => {
      setScrollTrackNodes((prev) => {
        if (prev[index] === node) return prev;
        const next = [...prev];
        next[index] = node;
        return next;
      });
    },
    [],
  );

  const handleStepComplete = useCallback(
    (stepId: string) => {
      markStepComplete(stepId);
    },
    [markStepComplete],
  );

  useEffect(() => {
    setLastStep(activeIndex);
  }, [activeIndex, setLastStep]);

  const allStepsComplete = lesson.steps.every((s) =>
    progress.completedSteps.includes(s.id),
  );
  const allQuizCorrect = lesson.quiz.every(
    (q) => progress.quiz[q.id] === "correct",
  );

  useEffect(() => {
    if (allStepsComplete && allQuizCorrect && !progress.lessonCompletedAt) {
      markLessonComplete();
    }
  }, [
    allStepsComplete,
    allQuizCorrect,
    progress.lessonCompletedAt,
    markLessonComplete,
  ]);

  const backHref = lesson.backHref ?? "/";
  const backLabel = lesson.backLabel ?? "返回目录";

  const completedSet = useMemo(
    () => new Set(progress.completedSteps),
    [progress.completedSteps],
  );

  const figure = isScrollFillStep(figureStep) ? (
    <StickyFigure
      key={figureStep.id}
      step={figureStep}
      cycle={figureStepIndex + 1}
      scrollTrackNode={scrollTrackNodes[figureStepIndex] ?? null}
      onComplete={() => handleStepComplete(figureStep.id)}
    />
  ) : isClickInteractiveStep(figureStep) ? (
    <FigureFrame caption={figureStep.caption} cycle={figureStepIndex + 1}>
      <div className="py-8 text-center text-sm leading-relaxed text-ink-muted">
        <p>← 请在左侧完成这一步的互动</p>
        <p className="mt-2 text-xs text-ink-faint">
          点击带 + 号的格子，把方块铺上去
        </p>
      </div>
    </FigureFrame>
  ) : (
    <StickyFigure
      key={figureStep.id}
      step={figureStep}
      cycle={figureStepIndex + 1}
      scrollTrackNode={scrollTrackNodes[figureStepIndex] ?? null}
    />
  );

  return (
    <article>
      <header className="border-b border-border bg-paper">
        <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8 lg:py-16">
          <Link
            href={backHref}
            className="mb-6 inline-block text-sm text-ink-muted transition hover:text-accent"
          >
            ← {backLabel}
          </Link>
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-ink-faint">
            第 {lesson.chapter} 章
          </p>
          <h1
            className="mb-3 text-3xl font-medium leading-tight text-ink md:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {lesson.title}
          </h1>
          <p className="mb-6 text-lg text-ink-muted">{lesson.subtitle}</p>
          <p className="max-w-prose text-base leading-relaxed text-ink-soft">
            {lesson.intro}
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {lesson.objectives.map((obj) => (
              <li
                key={obj}
                className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-ink-muted"
              >
                {obj}
              </li>
            ))}
          </ul>
          {progress.lessonCompletedAt && (
            <p className="mt-4 text-sm font-medium text-success" role="status">
              ✓ 本节已于此前完成，欢迎复习。
            </p>
          )}
        </div>
      </header>

      <StepProgress
        total={lesson.steps.length}
        activeIndex={activeIndex}
        labels={lesson.steps.map((s) => s.title)}
        stepIds={lesson.steps.map((s) => s.id)}
        completedSteps={completedSet}
        onStepClick={scrollToStep}
      />

      {stepRequiresCompletion(activeStep) &&
        !isStepComplete(activeStep.id) && (
          <p
            className="mx-auto max-w-6xl px-4 py-2 text-center text-sm text-accent lg:px-8"
            role="status"
          >
            {isScrollFillStep(activeStep)
              ? "当前步骤：继续向下滚动，右侧方块会逐步铺满（进度条变绿表示完成）"
              : "当前步骤需要完成互动（进度条变绿表示完成）"}
          </p>
        )}

      <ScrollyLayout figure={figure}>
        {lesson.steps.map((step, index) => (
          <ScrollyStepItem
            key={step.id}
            step={step}
            index={index}
            total={lesson.steps.length}
            isActive={index === activeIndex}
            isComplete={isStepComplete(step.id)}
            setStepRef={handleStepRef}
            setScrollTrackRef={handleScrollTrackRef}
            onStepComplete={handleStepComplete}
          />
        ))}
      </ScrollyLayout>

      {lesson.exercises && lesson.exercises.length > 0 && (
        <section className="mx-auto max-w-3xl border-t border-border px-4 py-16 lg:px-8">
          <h2
            className="mb-2 text-2xl font-medium text-ink"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            动手做
          </h2>
          <p className="mb-8 text-ink-muted">像课本「做一做」那样，亲自试一试。</p>
          <div className="space-y-10">
            {lesson.exercises.map((ex) => (
              <div key={ex.id}>
                <h3 className="mb-1 text-lg font-medium text-ink">
                  {ex.title}
                </h3>
                {ex.description && (
                  <p className="mb-4 text-sm text-ink-muted">
                    {ex.description}
                  </p>
                )}
                <FigureFrame
                  caption={`练习 · ${ex.title}`}
                  cycle={0}
                  variant="exercise"
                >
                  <WidgetRenderer config={ex.widget} cycle={0} />
                </FigureFrame>
              </div>
            ))}
          </div>
        </section>
      )}

      <QuizSection
        questions={lesson.quiz}
        quizState={progress.quiz}
        onStatusChange={setQuizStatus}
      />

      {(lesson.prevLesson || lesson.nextLesson) && (
        <nav
          className="mx-auto flex max-w-3xl justify-between gap-4 border-t border-border px-4 py-8 lg:px-8"
          aria-label="课时导航"
        >
          {lesson.prevLesson ? (
            <Link
              href={lesson.prevLesson.href}
              className="text-sm text-ink-muted transition hover:text-accent"
            >
              ← {lesson.prevLesson.title}
            </Link>
          ) : (
            <span />
          )}
          {lesson.nextLesson ? (
            <Link
              href={lesson.nextLesson.href}
              className="text-sm text-ink-muted transition hover:text-accent"
            >
              {lesson.nextLesson.title} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}

      <footer className="border-t border-border bg-surface py-10 text-center">
        <p className="text-sm text-ink-muted">
          {lesson.footerNote ??
            `参考：人教版三年级下册 · 第 ${lesson.chapter} 章`}
        </p>
      </footer>
    </article>
  );
}