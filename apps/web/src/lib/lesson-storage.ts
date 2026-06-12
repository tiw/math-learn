const PREFIX = "math-learn:";

export type StoredQuizStatus = "idle" | "correct" | "wrong";

export type LessonProgress = {
  completedSteps: string[];
  quiz: Record<string, StoredQuizStatus>;
  lastStepIndex: number;
  lessonCompletedAt?: string;
};

export function emptyLessonProgress(): LessonProgress {
  return { completedSteps: [], quiz: {}, lastStepIndex: 0 };
}

export function progressKey(lessonId: string) {
  return `${PREFIX}progress:${lessonId}`;
}

export function readProgress(lessonId: string): LessonProgress {
  if (typeof window === "undefined") {
    return emptyLessonProgress();
  }
  try {
    const raw = localStorage.getItem(progressKey(lessonId));
    if (!raw) return emptyLessonProgress();
    return JSON.parse(raw) as LessonProgress;
  } catch {
    return emptyLessonProgress();
  }
}

export function writeProgress(lessonId: string, data: LessonProgress) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(progressKey(lessonId), JSON.stringify(data));
  } catch {
    /* quota exceeded — ignore */
  }
}

export function isLessonComplete(
  lessonId: string,
  stepIds: string[],
  quizIds: string[],
): boolean {
  const p = readProgress(lessonId);
  const stepsDone = stepIds.every((id) => p.completedSteps.includes(id));
  const quizDone = quizIds.every((id) => p.quiz[id] === "correct");
  return stepsDone && quizDone;
}

export function subLessonStatus(
  lessonId: string,
  stepIds: string[],
  quizIds: string[],
): "not-started" | "in-progress" | "completed" {
  const p = readProgress(lessonId);
  if (isLessonComplete(lessonId, stepIds, quizIds)) return "completed";
  if (
    p.completedSteps.length > 0 ||
    p.lastStepIndex > 0 ||
    Object.values(p.quiz).some((s) => s === "correct")
  ) {
    return "in-progress";
  }
  return "not-started";
}
