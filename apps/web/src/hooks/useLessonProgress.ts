"use client";

import { useCallback, useEffect, useState } from "react";
import {
  emptyLessonProgress,
  readProgress,
  writeProgress,
  type LessonProgress,
  type StoredQuizStatus,
} from "@/lib/lesson-storage";

export function useLessonProgress(lessonId: string) {
  const [progress, setProgress] = useState<LessonProgress>(emptyLessonProgress);

  useEffect(() => {
    setProgress(readProgress(lessonId));
  }, [lessonId]);

  const persist = useCallback(
    (next: LessonProgress) => {
      setProgress(next);
      writeProgress(lessonId, next);
    },
    [lessonId],
  );

  const markStepComplete = useCallback(
    (stepId: string) => {
      setProgress((prev) => {
        if (prev.completedSteps.includes(stepId)) return prev;
        const next = {
          ...prev,
          completedSteps: [...prev.completedSteps, stepId],
        };
        writeProgress(lessonId, next);
        return next;
      });
    },
    [lessonId],
  );

  const setLastStep = useCallback(
    (index: number) => {
      setProgress((prev) => {
        if (prev.lastStepIndex === index) return prev;
        const next = { ...prev, lastStepIndex: index };
        writeProgress(lessonId, next);
        return next;
      });
    },
    [lessonId],
  );

  const setQuizStatus = useCallback(
    (questionId: string, status: StoredQuizStatus) => {
      setProgress((prev) => {
        const next = {
          ...prev,
          quiz: { ...prev.quiz, [questionId]: status },
        };
        writeProgress(lessonId, next);
        return next;
      });
    },
    [lessonId],
  );

  const markLessonComplete = useCallback(() => {
    setProgress((prev) => {
      const next = {
        ...prev,
        lessonCompletedAt: new Date().toISOString(),
      };
      writeProgress(lessonId, next);
      return next;
    });
  }, [lessonId]);

  const isStepComplete = useCallback(
    (stepId: string) => progress.completedSteps.includes(stepId),
    [progress.completedSteps],
  );

  return {
    progress,
    persist,
    markStepComplete,
    setLastStep,
    setQuizStatus,
    markLessonComplete,
    isStepComplete,
  };
}
