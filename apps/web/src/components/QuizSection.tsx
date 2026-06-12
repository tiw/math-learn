"use client";

import { useEffect, useState } from "react";
import type { QuizQuestion } from "@/lib/lesson-types";
import type { StoredQuizStatus } from "@/lib/lesson-storage";

function QuizItem({
  question,
  initialStatus,
  onStatusChange,
}: {
  question: QuizQuestion;
  initialStatus: StoredQuizStatus;
  onStatusChange: (id: string, status: StoredQuizStatus) => void;
}) {
  const [value, setValue] = useState("");
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [status, setStatus] = useState<StoredQuizStatus>(initialStatus);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  function check() {
    const answer = question.choices
      ? selectedChoice
      : Number(value.trim());

    if (answer === null || answer === undefined || Number.isNaN(answer as number)) {
      setStatus("wrong");
      return;
    }

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    if (answer === question.answer) {
      setStatus("correct");
      onStatusChange(question.id, "correct");
      return;
    }

    setStatus("wrong");
    onStatusChange(question.id, "wrong");
  }

  const showFullHint = attempts >= 2 && status === "wrong";

  return (
    <div
      className={`rounded-xl border p-5 ${
        status === "correct"
          ? "border-success/40 bg-success/5"
          : "border-border bg-surface"
      }`}
    >
      <p className="mb-3 font-medium text-ink">{question.prompt}</p>

      {question.choices ? (
        <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="选择答案">
          {question.choices.map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={() => {
                setSelectedChoice(c.value);
                setStatus("idle");
              }}
              className={`min-h-11 rounded-lg px-4 py-2 text-sm transition ${
                selectedChoice === c.value
                  ? "bg-accent text-white"
                  : "border border-border bg-paper text-ink hover:border-accent/40"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <input
            type="number"
            inputMode="numeric"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setStatus("idle");
            }}
            onKeyDown={(e) => e.key === "Enter" && check()}
            className="w-28 rounded-lg border border-border bg-paper px-3 py-2 text-lg outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            aria-label="你的答案"
          />
          {question.unit && (
            <span className="text-ink-muted">{question.unit}</span>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={check}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover"
      >
        检查
      </button>

      <div aria-live="polite" className="mt-3 text-sm">
        {status === "correct" && (
          <p className="font-medium text-success">
            ✓ 答对了！
            {question.hint && ` ${question.hint} = ${question.answer}`}
            {question.unit && question.unit}
          </p>
        )}
        {status === "wrong" && !value.trim() && !question.choices && (
          <p className="text-wrong">请先输入答案。</p>
        )}
        {status === "wrong" && (value.trim() || question.choices) && (
          <p className="text-wrong">
            ✗ 再想想。
            {showFullHint
              ? ` 参考答案：${question.answer}${question.unit ? ` ${question.unit}` : ""}`
              : question.hint
                ? ` 提示：${question.hint}`
                : ""}
          </p>
        )}
      </div>
    </div>
  );
}

type QuizSectionProps = {
  questions: QuizQuestion[];
  quizState: Record<string, StoredQuizStatus>;
  onStatusChange: (id: string, status: StoredQuizStatus) => void;
};

export function QuizSection({
  questions,
  quizState,
  onStatusChange,
}: QuizSectionProps) {
  const allCorrect = questions.every((q) => quizState[q.id] === "correct");
  const correctCount = questions.filter(
    (q) => quizState[q.id] === "correct",
  ).length;

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      <h2
        className="mb-2 text-2xl font-medium text-ink"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        做一做
      </h2>
      <p className="mb-2 text-ink-muted">用刚学的公式算一算。</p>
      <p className="mb-8 text-sm text-ink-faint">
        进度：{correctCount}/{questions.length} 题正确
      </p>
      <div className="space-y-4">
        {questions.map((q) => (
          <QuizItem
            key={q.id}
            question={q}
            initialStatus={quizState[q.id] ?? "idle"}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
      {allCorrect && (
        <p
          className="mt-8 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-center font-medium text-success"
          role="status"
        >
          ✓ 全部答对！这一节的练习完成了。
        </p>
      )}
    </section>
  );
}
