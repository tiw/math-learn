"use client";

type StepProgressProps = {
  total: number;
  activeIndex: number;
  labels?: string[];
  completedSteps?: Set<string> | string[];
  stepIds?: string[];
  onStepClick?: (index: number) => void;
};

export function StepProgress({
  total,
  activeIndex,
  labels,
  completedSteps,
  stepIds,
  onStepClick,
}: StepProgressProps) {
  const completed = completedSteps instanceof Set
    ? completedSteps
    : new Set(completedSteps ?? []);

  return (
    <div
      className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-sm"
      aria-label={`学习进度：第 ${activeIndex + 1} 步，共 ${total} 步`}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="shrink-0 font-mono text-xs text-ink-faint">
            步骤 {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </span>
          {labels?.[activeIndex] && (
            <span className="truncate text-xs text-ink-muted">
              {labels[activeIndex]}
            </span>
          )}
        </div>
        <div className="flex flex-1 gap-1.5" role="tablist" aria-label="步骤导航">
          {Array.from({ length: total }, (_, i) => {
            const stepId = stepIds?.[i];
            const done = stepId ? completed.has(stepId) : false;
            const isActive = i === activeIndex;
            return (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-current={isActive ? "step" : undefined}
                aria-label={
                  labels?.[i]
                    ? `步骤 ${i + 1}：${labels[i]}${done ? "，已完成" : ""}`
                    : `步骤 ${i + 1}`
                }
                title={labels?.[i]}
                onClick={() => onStepClick?.(i)}
                className={`group relative h-2 flex-1 rounded-full transition-colors ${
                  isActive ? "bg-accent/30 ring-1 ring-accent" : "bg-border"
                } ${onStepClick ? "cursor-pointer hover:bg-accent/20" : ""}`}
              >
                <span
                  className={`absolute inset-y-0 left-0 rounded-full transition-all ${
                    done ? "bg-success" : isActive ? "bg-accent" : "bg-transparent"
                  }`}
                  style={{ width: done || isActive ? "100%" : "0%" }}
                />
                {done && (
                  <span className="sr-only">已完成</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
