"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { StepperInput } from "@/components/StepperInput";

type CompoundTableConfig = {
  mode: "intro" | "merge" | "explore";
  title?: string;
  rowLabel: string;
  rows: string[];
  colLabel: string;
  leftCol: string;
  rightCol: string;
  leftData: number[];
  rightData: number[];
};

type CompoundTableProps = {
  config: Record<string, unknown>;
  cycle: number;
  onComplete?: () => void;
};

export function CompoundTableWidget({
  config,
  cycle,
  onComplete,
}: CompoundTableProps) {
  const {
    mode,
    title,
    rowLabel,
    rows,
    colLabel,
    leftCol,
    rightCol,
    leftData,
    rightData,
  } = config as CompoundTableConfig;

  const [showSplit, setShowSplit] = useState(mode === "intro");
  const [leftInput, setLeftInput] = useState<string[]>(
    rows.map(() => ""),
  );
  const [rightInput, setRightInput] = useState<string[]>(
    rows.map(() => ""),
  );
  const [exploreLeft, setExploreLeft] = useState<number[]>(leftData);
  const [exploreRight, setExploreRight] = useState<number[]>(rightData);
  const completedRef = useRef(false);

  useEffect(() => {
    setShowSplit(mode === "intro");
    setLeftInput(rows.map(() => ""));
    setRightInput(rows.map(() => ""));
    setExploreLeft(leftData);
    setExploreRight(rightData);
    completedRef.current = false;
  }, [mode, cycle, rows, leftData, rightData]);

  const merged = useMemo(
    () =>
      rows.map((row, i) => ({
        row,
        left: leftData[i] ?? 0,
        right: rightData[i] ?? 0,
        total: (leftData[i] ?? 0) + (rightData[i] ?? 0),
      })),
    [rows, leftData, rightData],
  );

  const exploreRows = useMemo(
    () =>
      rows.map((row, i) => ({
        row,
        left: exploreLeft[i] ?? 0,
        right: exploreRight[i] ?? 0,
        total: (exploreLeft[i] ?? 0) + (exploreRight[i] ?? 0),
      })),
    [rows, exploreLeft, exploreRight],
  );

  const leftTotal = useMemo(
    () => exploreRows.reduce((sum, r) => sum + r.left, 0),
    [exploreRows],
  );
  const rightTotal = useMemo(
    () => exploreRows.reduce((sum, r) => sum + r.right, 0),
    [exploreRows],
  );
  const grandTotal = leftTotal + rightTotal;

  const mergeCorrect = useMemo(() => {
    return rows.every((_, i) => {
      const l = Number(leftInput[i]);
      const r = Number(rightInput[i]);
      return !Number.isNaN(l) && !Number.isNaN(r) && l === leftData[i] && r === rightData[i];
    });
  }, [rows, leftInput, rightInput, leftData, rightData]);

  useEffect(() => {
    if (mode === "merge" && mergeCorrect && onComplete && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  }, [mode, mergeCorrect, onComplete]);

  function handleToggle() {
    setShowSplit((prev) => !prev);
    if (onComplete && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  }

  function handleExploreLeft(index: number, value: number) {
    setExploreLeft((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    if (onComplete && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  }

  function handleExploreRight(index: number, value: number) {
    setExploreRight((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    if (onComplete && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  }

  function renderTableHeader() {
    return (
      <tr className="bg-surface text-sm font-medium text-ink-soft">
        <th className="border border-border px-3 py-2 text-left">{rowLabel}</th>
        <th className="border border-border px-3 py-2 text-center">{leftCol}</th>
        <th className="border border-border px-3 py-2 text-center">{rightCol}</th>
        {mode === "explore" && (
          <th className="border border-border px-3 py-2 text-center">合计</th>
        )}
      </tr>
    );
  }

  if (mode === "intro") {
    return (
      <div className="flex w-full flex-col items-center gap-4">
        {title && (
          <p className="text-center text-sm font-medium text-ink-muted">
            {title}
          </p>
        )}

        <div className="w-full overflow-x-auto">
          {showSplit ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SingleTable
                label={leftCol}
                rowLabel={rowLabel}
                rows={rows}
                data={leftData}
              />
              <SingleTable
                label={rightCol}
                rowLabel={rowLabel}
                rows={rows}
                data={rightData}
              />
            </div>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-surface text-ink-soft">
                  <th className="border border-border px-3 py-2 text-left" rowSpan={2}>
                    {rowLabel}
                  </th>
                  <th
                    className="border border-border px-3 py-2 text-center"
                    colSpan={2}
                  >
                    {colLabel}
                  </th>
                </tr>
                <tr className="bg-surface text-ink-soft">
                  <th className="border border-border px-3 py-2 text-center">
                    {leftCol}
                  </th>
                  <th className="border border-border px-3 py-2 text-center">
                    {rightCol}
                  </th>
                </tr>
              </thead>
              <tbody>
                {merged.map(({ row, left, right }) => (
                  <tr key={row} className="text-ink">
                    <td className="border border-border px-3 py-2 font-medium">
                      {row}
                    </td>
                    <td className="border border-border px-3 py-2 text-center tabular-nums">
                      {left}
                    </td>
                    <td className="border border-border px-3 py-2 text-center tabular-nums">
                      {right}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <button
          type="button"
          onClick={handleToggle}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover"
        >
          {showSplit ? "合起来看看" : "拆成两张表"}
        </button>
      </div>
    );
  }

  if (mode === "merge") {
    return (
      <div className="flex w-full flex-col items-center gap-4">
        {title && (
          <p className="text-center text-sm font-medium text-ink-muted">
            {title}
          </p>
        )}

        <div className="w-full overflow-x-auto rounded-xl border border-border bg-paper">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-surface text-ink-soft">
                <th className="border border-border px-3 py-2 text-left" rowSpan={2}>
                  {rowLabel}
                </th>
                <th
                  className="border border-border px-3 py-2 text-center"
                  colSpan={2}
                >
                  {colLabel}
                </th>
              </tr>
              <tr className="bg-surface text-ink-soft">
                <th className="border border-border px-3 py-2 text-center">
                  {leftCol}
                </th>
                <th className="border border-border px-3 py-2 text-center">
                  {rightCol}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row} className="text-ink">
                  <td className="border border-border px-3 py-2 font-medium">
                    {row}
                  </td>
                  <td className="border border-border px-2 py-2 text-center">
                    <input
                      type="number"
                      inputMode="numeric"
                      value={leftInput[i]}
                      onChange={(e) =>
                        setLeftInput((prev) => {
                          const next = [...prev];
                          next[i] = e.target.value;
                          return next;
                        })
                      }
                      className="w-20 rounded-md border border-border bg-paper px-2 py-1 text-center tabular-nums outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                      aria-label={`${row} 的 ${leftCol}`}
                    />
                  </td>
                  <td className="border border-border px-2 py-2 text-center">
                    <input
                      type="number"
                      inputMode="numeric"
                      value={rightInput[i]}
                      onChange={(e) =>
                        setRightInput((prev) => {
                          const next = [...prev];
                          next[i] = e.target.value;
                          return next;
                        })
                      }
                      className="w-20 rounded-md border border-border bg-paper px-2 py-1 text-center tabular-nums outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                      aria-label={`${row} 的 ${rightCol}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {mergeCorrect ? (
          <p
            className="text-center text-sm font-medium text-success"
            role="status"
          >
            ✓ 表格填写正确！
          </p>
        ) : (
          <p className="text-center text-sm text-ink-muted">
            把左右两张表的人数对应填到复式统计表里。
          </p>
        )}
      </div>
    );
  }

  // explore mode
  return (
    <div className="flex w-full flex-col items-center gap-4">
      {title && (
        <p className="text-center text-sm font-medium text-ink-muted">
          {title}
        </p>
      )}

      <div className="w-full overflow-x-auto rounded-xl border border-border bg-paper">
        <table className="w-full border-collapse text-sm">
          <thead>
            {renderTableHeader()}
          </thead>
          <tbody>
            {exploreRows.map(({ row, left, right, total }) => (
              <tr key={row} className="text-ink">
                <td className="border border-border px-3 py-2 font-medium">
                  {row}
                </td>
                <td className="border border-border px-3 py-2 text-center tabular-nums">
                  {left}
                </td>
                <td className="border border-border px-3 py-2 text-center tabular-nums">
                  {right}
                </td>
                {mode === "explore" && (
                  <td className="border border-border px-3 py-2 text-center tabular-nums font-medium text-accent">
                    {total}
                  </td>
                )}
              </tr>
            ))}
            {mode === "explore" && (
              <tr className="bg-surface font-medium text-ink-soft">
                <td className="border border-border px-3 py-2">合计</td>
                <td className="border border-border px-3 py-2 text-center tabular-nums">
                  {leftTotal}
                </td>
                <td className="border border-border px-3 py-2 text-center tabular-nums">
                  {rightTotal}
                </td>
                <td className="border border-border px-3 py-2 text-center tabular-nums text-accent">
                  {grandTotal}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="w-full max-w-md space-y-3 rounded-xl border border-border bg-surface/80 p-4">
        <p className="text-sm font-medium text-ink-soft">
          调整数据，观察合计的变化：
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <StepperInput
            label={rows[0] + " " + leftCol}
            value={exploreLeft[0]}
            min={0}
            max={30}
            onChange={(v) => handleExploreLeft(0, v)}
          />
          <StepperInput
            label={rows[0] + " " + rightCol}
            value={exploreRight[0]}
            min={0}
            max={30}
            onChange={(v) => handleExploreRight(0, v)}
          />
          <StepperInput
            label={rows[1] + " " + leftCol}
            value={exploreLeft[1]}
            min={0}
            max={30}
            onChange={(v) => handleExploreLeft(1, v)}
          />
          <StepperInput
            label={rows[1] + " " + rightCol}
            value={exploreRight[1]}
            min={0}
            max={30}
            onChange={(v) => handleExploreRight(1, v)}
          />
        </div>
      </div>
    </div>
  );
}

function SingleTable({
  label,
  rowLabel,
  rows,
  data,
}: {
  label: string;
  rowLabel: string;
  rows: string[];
  data: number[];
}) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="bg-surface text-ink-soft">
          <th className="border border-border px-3 py-2 text-left">{rowLabel}</th>
          <th className="border border-border px-3 py-2 text-center">{label}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={row} className="text-ink">
            <td className="border border-border px-3 py-2 font-medium">{row}</td>
            <td className="border border-border px-3 py-2 text-center tabular-nums">
              {data[i] ?? 0}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
