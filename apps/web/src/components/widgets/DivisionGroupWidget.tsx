"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { StepperInput } from "@/components/StepperInput";

type DivisionGroupConfig = {
  dividend: number;
  divisor: number;
  mode: "share" | "estimate" | "long-div" | "explore";
};

type Props = {
  config: DivisionGroupConfig;
  cycle: number;
  stepKey?: string;
  onComplete?: () => void;
};

type LongDivStep = {
  partial: number;
  digit: number;
  product: number;
  remainder: number;
  pos: number;
};

function computeLongDivSteps(
  dividend: number,
  divisor: number,
): LongDivStep[] {
  const digits = String(dividend).split("").map(Number);
  const steps: LongDivStep[] = [];
  let remainder = 0;

  for (let i = 0; i < digits.length; i += 1) {
    const partial = remainder * 10 + digits[i];
    const digit = Math.floor(partial / divisor);
    const product = digit * divisor;
    remainder = partial - product;
    steps.push({ partial, digit, product, remainder, pos: i });
  }

  return steps;
}

function useCompleted(onComplete?: () => void) {
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  const markComplete = () => {
    if (!completedRef.current && onCompleteRef.current) {
      completedRef.current = true;
      onCompleteRef.current();
    }
  };

  return { markComplete, completedRef };
}

function ShareMode({
  dividend,
  divisor,
  onComplete,
}: {
  dividend: number;
  divisor: number;
  onComplete?: () => void;
}) {
  const totalBundles = Math.floor(dividend / 10);
  const totalSingles = dividend % 10;
  const quotient = Math.floor(dividend / divisor);
  const remainder = dividend % divisor;

  const [bundlesLeft, setBundlesLeft] = useState(totalBundles);
  const [singlesLeft, setSinglesLeft] = useState(totalSingles);
  const [groups, setGroups] = useState<number[]>(Array(divisor).fill(0));
  const [message, setMessage] = useState<string | null>(null);
  const { markComplete } = useCompleted(onComplete);

  const done = bundlesLeft === 0 && singlesLeft === 0;

  useEffect(() => {
    if (done) {
      markComplete();
    }
  }, [done, markComplete]);

  const giveBundleRound = () => {
    if (bundlesLeft < divisor) {
      setMessage("剩下的整捆不够每人一捆，先把一捆拆开。");
      return;
    }
    setMessage(null);
    setBundlesLeft((b) => b - divisor);
    setGroups((g) => g.map((count) => count + 10));
  };

  const breakBundle = () => {
    if (bundlesLeft === 0) return;
    setMessage(null);
    setBundlesLeft((b) => b - 1);
    setSinglesLeft((s) => s + 10);
  };

  const giveSingleRound = () => {
    if (singlesLeft < divisor) {
      setMessage("剩下的单个不够每人一个，分完啦。");
      return;
    }
    setMessage(null);
    setSinglesLeft((s) => s - divisor);
    setGroups((g) => g.map((count) => count + 1));
  };

  const autoComplete = () => {
    setMessage(null);
    setBundlesLeft(0);
    setSinglesLeft(remainder);
    setGroups(Array(divisor).fill(quotient));
  };

  const canGiveBundle = bundlesLeft >= divisor;
  const canBreak = bundlesLeft > 0 && !canGiveBundle;
  const canGiveSingle = singlesLeft >= divisor;

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <p className="text-center text-sm text-ink-muted">
        把 <span className="font-medium text-ink">{dividend}</span> 平均分成{" "}
        <span className="font-medium text-ink">{divisor}</span> 份，每份几个？
      </p>

      <div className="flex w-full max-w-md flex-col gap-3 rounded-xl border border-border bg-surface/80 p-4">
        <p className="text-xs font-medium text-ink-muted">还没分的物品</p>
        <div className="flex min-h-[3rem] flex-wrap items-center gap-2">
          {Array.from({ length: bundlesLeft }).map((_, i) => (
            <div
              key={`bundle-${i}`}
              className="flex h-8 w-10 items-center justify-center rounded bg-accent/20 text-xs font-semibold text-accent"
            >
              10
            </div>
          ))}
          {Array.from({ length: singlesLeft }).map((_, i) => (
            <div
              key={`single-${i}`}
              className="h-4 w-4 rounded-full bg-accent/60"
            />
          ))}
          {bundlesLeft === 0 && singlesLeft === 0 && (
            <span className="text-sm text-success">全部分完</span>
          )}
        </div>
      </div>

      <div
        className="grid w-full max-w-md gap-3"
        style={{ gridTemplateColumns: `repeat(${divisor}, minmax(0, 1fr))` }}
      >
        {groups.map((count, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-2 rounded-xl border border-border bg-paper p-3"
          >
            <span className="text-xs text-ink-muted">第 {i + 1} 份</span>
            <div className="flex min-h-[2.5rem] flex-wrap items-center justify-center gap-1">
              {Array.from({ length: Math.floor(count / 10) }).map((_, j) => (
                <div
                  key={`g-bundle-${j}`}
                  className="flex h-6 w-8 items-center justify-center rounded bg-accent/20 text-[10px] font-semibold text-accent"
                >
                  10
                </div>
              ))}
              {Array.from({ length: count % 10 }).map((_, j) => (
                <div
                  key={`g-single-${j}`}
                  className="h-3 w-3 rounded-full bg-accent/60"
                />
              ))}
            </div>
            <span className="text-lg font-semibold text-ink">{count}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={giveBundleRound}
          disabled={!canGiveBundle}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-ink transition hover:border-accent disabled:opacity-40"
        >
          每人分一捆（10）
        </button>
        <button
          type="button"
          onClick={breakBundle}
          disabled={!canBreak}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-ink transition hover:border-accent disabled:opacity-40"
        >
          拆一捆成 10 个
        </button>
        <button
          type="button"
          onClick={giveSingleRound}
          disabled={!canGiveSingle}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-ink transition hover:border-accent disabled:opacity-40"
        >
          每人分一个
        </button>
        <button
          type="button"
          onClick={autoComplete}
          disabled={done}
          className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white transition hover:bg-accent-hover disabled:opacity-40"
        >
          全部分完
        </button>
      </div>

      {done && (
        <p
          className="text-center text-sm font-medium text-success"
          role="status"
        >
          ✓ 每份 {quotient} 个，还剩 {remainder} 个
        </p>
      )}

      {message && (
        <p className="text-center text-sm text-wrong">{message}</p>
      )}
    </div>
  );
}

function EstimateMode({
  dividend,
  divisor,
  onComplete,
}: {
  dividend: number;
  divisor: number;
  onComplete?: () => void;
}) {
  const exact = dividend / divisor;
  const correct = Math.max(10, Math.round(exact / 10) * 10);
  const choices = useMemo(() => {
    const base = [correct - 10, correct, correct + 10].filter((c) => c > 0);
    return Array.from(new Set(base)).sort((a, b) => a - b);
  }, [correct]);

  const [selected, setSelected] = useState<number | null>(null);
  const { markComplete } = useCompleted(onComplete);

  const handleSelect = (value: number) => {
    setSelected(value);
    if (value === correct) {
      markComplete();
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <p className="text-center text-base text-ink">
        估算：{dividend} ÷ {divisor} ≈ ？
      </p>
      <p className="text-center text-sm text-ink-muted">
        不用算出准确答案，选一个最接近的整十数。
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        {choices.map((value) => {
          const isSelected = selected === value;
          const isCorrect = value === correct;
          const showCorrect = selected !== null && isCorrect;
          const showWrong = isSelected && !isCorrect;

          return (
            <button
              key={value}
              type="button"
              onClick={() => handleSelect(value)}
              disabled={selected !== null}
              className={`min-w-[5rem] rounded-xl border px-5 py-3 text-lg font-medium transition ${
                showCorrect
                  ? "border-success bg-success/10 text-success"
                  : showWrong
                    ? "border-wrong bg-wrong/10 text-wrong"
                    : isSelected
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border bg-surface text-ink hover:border-accent/40"
              }`}
            >
              {value}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <p
          className={`text-center text-sm font-medium ${
            selected === correct ? "text-success" : "text-wrong"
          }`}
          role="status"
        >
          {selected === correct
            ? `✓ ${dividend} ≈ ${correct}，${correct} ÷ ${divisor} = ${correct / divisor}，所以约是 ${correct / divisor}。`
            : `不对哦，${dividend} 接近 ${correct}，${correct} ÷ ${divisor} = ${correct / divisor}。`}
        </p>
      )}
    </div>
  );
}

function LongDivMode({
  dividend,
  divisor,
  onComplete,
}: {
  dividend: number;
  divisor: number;
  onComplete?: () => void;
}) {
  const steps = useMemo(
    () => computeLongDivSteps(dividend, divisor),
    [dividend, divisor],
  );
  const [stepIndex, setStepIndex] = useState(0);
  const { markComplete } = useCompleted(onComplete);

  const quotient = Math.floor(dividend / divisor);
  const remainder = dividend % divisor;
  const currentStep = steps[stepIndex];

  const quotientDigits = String(quotient).padStart(steps.length, " ").split("");

  useEffect(() => {
    if (stepIndex >= steps.length) {
      markComplete();
    }
  }, [stepIndex, steps.length, markComplete]);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <p className="text-center text-sm text-ink-muted">
        用竖式计算 {dividend} ÷ {divisor}
      </p>

      <div className="rounded-xl border border-border bg-paper p-6">
        <div className="flex items-start gap-1 font-mono text-2xl leading-relaxed text-ink">
          <div className="flex flex-col items-end">
            <span className="invisible">{divisor}</span>
            <span>{divisor}</span>
          </div>
          <div className="flex flex-col">
            <span className="border-b-2 border-ink pb-1 pl-2">
              {quotientDigits.map((d, i) => (
                <span
                  key={i}
                  className={
                    i < stepIndex ? "text-accent" : "text-ink-muted/40"
                  }
                >
                  {d}
                </span>
              ))}
            </span>
            <span className="pl-2">{dividend}</span>
          </div>
        </div>
      </div>

      {currentStep && (
        <div className="max-w-md rounded-lg bg-surface/80 p-4 text-sm text-ink-soft">
          <p className="font-medium text-ink">第 {stepIndex + 1} 步</p>
          <p className="mt-1">
            用 {currentStep.partial} 除以 {divisor}，商{" "}
            <span className="font-semibold text-accent">
              {currentStep.digit}
            </span>
            。
          </p>
          <p>
            {currentStep.digit} × {divisor} = {currentStep.product}，余{" "}
            {currentStep.remainder}。
          </p>
        </div>
      )}

      {stepIndex >= steps.length && (
        <p
          className="text-center text-sm font-medium text-success"
          role="status"
        >
          ✓ {dividend} ÷ {divisor} = {quotient}
          {remainder > 0 ? `……${remainder}` : ""}
        </p>
      )}

      <button
        type="button"
        onClick={() => setStepIndex((i) => Math.min(i + 1, steps.length))}
        disabled={stepIndex >= steps.length}
        className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white transition hover:bg-accent-hover disabled:opacity-40"
      >
        {stepIndex >= steps.length ? "已完成" : "下一步"}
      </button>
    </div>
  );
}

function ExploreMode({
  dividend,
  divisor,
  onComplete,
}: {
  dividend: number;
  divisor: number;
  onComplete?: () => void;
}) {
  const [d, setD] = useState(dividend);
  const [r, setR] = useState(divisor);
  const quotient = Math.floor(d / r);
  const remainder = d % r;

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <p className="text-center text-sm text-ink-muted">
        改变被除数和除数，观察商和余数的变化。
      </p>

      <div className="w-full max-w-md space-y-4 rounded-xl border border-border bg-surface/80 p-4">
        <StepperInput
          label="被除数"
          value={d}
          min={1}
          max={999}
          onChange={(v) => {
            setD(v);
            onComplete?.();
          }}
        />
        <StepperInput
          label="除数"
          value={r}
          min={1}
          max={9}
          onChange={(v) => {
            setR(v);
            onComplete?.();
          }}
        />

        <p className="text-center text-lg font-medium text-ink">
          {d} ÷ {r} ={" "}
          <span className="text-accent">{quotient}</span>
          {remainder > 0 ? (
            <span className="text-ink-muted">
              {" "}
              ……{remainder}
            </span>
          ) : null}
        </p>
      </div>
    </div>
  );
}

export function DivisionGroupWidget({
  config,
  cycle,
  stepKey,
  onComplete,
}: Props) {
  const { dividend, divisor, mode } = config;
  const key = `${stepKey ?? cycle}-${mode}`;

  return (
    <div className="w-full">
      {mode === "share" && (
        <ShareMode
          key={key}
          dividend={dividend}
          divisor={divisor}
          onComplete={onComplete}
        />
      )}
      {mode === "estimate" && (
        <EstimateMode
          key={key}
          dividend={dividend}
          divisor={divisor}
          onComplete={onComplete}
        />
      )}
      {mode === "long-div" && (
        <LongDivMode
          key={key}
          dividend={dividend}
          divisor={divisor}
          onComplete={onComplete}
        />
      )}
      {mode === "explore" && (
        <ExploreMode
          key={key}
          dividend={dividend}
          divisor={divisor}
          onComplete={onComplete}
        />
      )}
    </div>
  );
}
