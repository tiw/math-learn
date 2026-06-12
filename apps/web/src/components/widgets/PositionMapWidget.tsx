"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const DIRECTIONS = [
  "north",
  "south",
  "west",
  "east",
  "northeast",
  "northwest",
  "southeast",
  "southwest",
] as const;

type Direction = (typeof DIRECTIONS)[number];

type Place = {
  id: string;
  label: string;
  row: number;
  col: number;
  color?: string;
};

type PositionMapConfig = {
  mode: "identify" | "select" | "route" | "explore";
  rows?: number;
  cols?: number;
  places: Place[];
  reference?: string;
  target?: string;
  direction?: Direction;
  answer?: string | Direction;
  options?: string[] | Direction[];
  route?: { from: string; to: string; direction: Direction }[];
  missingLeg?: number;
  prompt?: string;
};

const DIRECTION_LABELS: Record<Direction, string> = {
  north: "北",
  south: "南",
  west: "西",
  east: "东",
  northeast: "东北",
  northwest: "西北",
  southeast: "东南",
  southwest: "西南",
};

const DIRECTION_ICONS: Record<Direction, string> = {
  north: "↑",
  south: "↓",
  west: "←",
  east: "→",
  northeast: "↗",
  northwest: "↖",
  southeast: "↘",
  southwest: "↙",
};

function directionBetween(
  from: { row: number; col: number },
  to: { row: number; col: number },
): Direction {
  const dr = to.row - from.row;
  const dc = to.col - from.col;
  const ns = dr === 0 ? "" : dr < 0 ? "north" : "south";
  const ew = dc === 0 ? "" : dc < 0 ? "west" : "east";
  return `${ns}${ew}` as Direction;
}

function placeById(places: Place[], id?: string) {
  return places.find((p) => p.id === id);
}

function isDirection(value: string): value is Direction {
  return (DIRECTIONS as readonly string[]).includes(value);
}

type Attempt = {
  answer: string;
  correct?: boolean;
};

export function PositionMapWidget({
  config,
  cycle,
  onComplete,
}: {
  config: Record<string, unknown>;
  cycle: number;
  onComplete?: () => void;
}) {
  const cfg = config as unknown as PositionMapConfig;
  const rows = cfg.rows ?? 3;
  const cols = cfg.cols ?? 3;
  const places = useMemo(() => cfg.places ?? [], [cfg.places]);

  const [attempts, setAttempts] = useState<Record<string, Attempt>>({});
  const completedRef = useRef(false);
  const lastCompletedKeyRef = useRef<string | null>(null);

  const questionKey = useMemo(() => {
    const base = `${cycle}-${cfg.mode}`;
    if (cfg.mode === "identify") {
      return `${base}-${cfg.reference ?? ""}-${cfg.target ?? ""}`;
    }
    if (cfg.mode === "select") {
      return `${base}-${cfg.reference ?? ""}-${cfg.direction ?? ""}`;
    }
    if (cfg.mode === "route") {
      const legs = cfg.route?.map((r) => `${r.from}>${r.to}`).join("-") ?? "";
      return `${base}-${legs}-${cfg.missingLeg ?? 0}`;
    }
    return `${base}-explore`;
  }, [
    cycle,
    cfg.mode,
    cfg.reference,
    cfg.target,
    cfg.direction,
    cfg.route,
    cfg.missingLeg,
  ]);

  const attempt = attempts[questionKey];

  useEffect(() => {
    if (lastCompletedKeyRef.current !== questionKey) {
      completedRef.current = false;
      lastCompletedKeyRef.current = questionKey;
    }
  }, [questionKey]);

  useEffect(() => {
    if (attempt?.correct && !completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  }, [attempt, onComplete]);

  const exploreValues = useMemo(() => {
    if (cfg.mode !== "explore") return null;
    if (attempt?.answer) {
      const [from, to] = attempt.answer.split(">");
      if (from && to) return { from, to };
    }
    const from = cfg.reference ?? places[0]?.id ?? "";
    const to = cfg.target ?? places[1]?.id ?? places[0]?.id ?? "";
    return { from, to };
  }, [cfg.mode, cfg.reference, cfg.target, places, attempt]);

  const fromPlace = placeById(
    places,
    cfg.mode === "explore" ? exploreValues?.from : cfg.reference,
  );
  const toPlace = placeById(
    places,
    cfg.mode === "explore" ? exploreValues?.to : cfg.target,
  );

  const computedDirection = useMemo(() => {
    if (!fromPlace || !toPlace) return null;
    return directionBetween(fromPlace, toPlace);
  }, [fromPlace, toPlace]);

  const CELL = 64;
  const GAP = 4;
  const PADDING = 48;
  const svgWidth = PADDING * 2 + cols * CELL + (cols - 1) * GAP;
  const svgHeight = PADDING * 2 + rows * CELL + (rows - 1) * GAP;

  function recordAttempt(answer: string, correct?: boolean) {
    setAttempts((prev) => ({ ...prev, [questionKey]: { answer, correct } }));
  }

  function handleIdentify(direction: Direction) {
    if (!fromPlace || !toPlace) return;
    const correct = directionBetween(fromPlace, toPlace);
    recordAttempt(direction, direction === correct);
  }

  function handleSelect(placeId: string) {
    if (!fromPlace || !cfg.direction) return;
    const correctId = places.find((p) => {
      const d = directionBetween(fromPlace, p);
      return d === cfg.direction;
    })?.id;
    recordAttempt(placeId, placeId === correctId);
  }

  function handleRouteSubmit(direction: Direction) {
    if (!cfg.route || cfg.missingLeg === undefined) return;
    const correct = cfg.route[cfg.missingLeg].direction;
    recordAttempt(direction, direction === correct);
  }

  function setExploreFrom(id: string) {
    if (!exploreValues) return;
    recordAttempt(`${id}>${exploreValues.to}`);
  }

  function setExploreTo(id: string) {
    if (!exploreValues) return;
    recordAttempt(`${exploreValues.from}>${id}`);
  }

  const optionDirections: Direction[] = useMemo(() => {
    if (
      cfg.options &&
      cfg.options.length > 0 &&
      cfg.options.every((o) => typeof o === "string" && isDirection(o))
    ) {
      return cfg.options as Direction[];
    }
    return ["north", "south", "west", "east"];
  }, [cfg.options]);

  const optionPlaces: Place[] = useMemo(() => {
    if (
      cfg.options &&
      cfg.options.length > 0 &&
      cfg.options.every((o) => typeof o === "string" && !isDirection(o))
    ) {
      return (cfg.options as string[])
        .map((id) => placeById(places, id))
        .filter((p): p is Place => p !== undefined);
    }
    return places;
  }, [cfg.options, places]);

  const promptText =
    cfg.prompt ??
    (cfg.mode === "identify" && fromPlace && toPlace
      ? `${toPlace.label} 在 ${fromPlace.label} 的什么方向？`
      : cfg.mode === "select" && fromPlace && cfg.direction
        ? `${fromPlace.label} 的 ${DIRECTION_LABELS[cfg.direction]} 方向是哪里？`
        : cfg.mode === "route"
          ? "把路线图补充完整"
          : "选择一个观察点和一个目标，看看方向怎么变");

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <p className="text-center text-base font-medium text-ink">{promptText}</p>

      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="h-auto w-full max-w-md select-none"
        role="img"
        aria-label="方位示意图"
      >
        <rect
          x={PADDING - 12}
          y={PADDING - 12}
          width={svgWidth - PADDING * 2 + 24}
          height={svgHeight - PADDING * 2 + 24}
          fill="var(--paper)"
          stroke="var(--border)"
          strokeWidth="1"
          rx="8"
        />
        {Array.from({ length: rows * cols }, (_, i) => {
          const row = Math.floor(i / cols);
          const col = i % cols;
          const x = PADDING + col * (CELL + GAP);
          const y = PADDING + row * (CELL + GAP);
          return (
            <rect
              key={`cell-${row}-${col}`}
              x={x}
              y={y}
              width={CELL}
              height={CELL}
              fill="var(--surface)"
              stroke="var(--border)"
              strokeWidth="1"
              rx="4"
              opacity={0.6}
            />
          );
        })}

        <g transform={`translate(${svgWidth - 44}, 16)`}>
          <circle
            cx="16"
            cy="16"
            r="14"
            fill="var(--paper)"
            stroke="var(--border)"
          />
          <text
            x="16"
            y="10"
            textAnchor="middle"
            fill="var(--wrong)"
            fontSize="10"
            fontWeight="600"
          >
            N
          </text>
          <text
            x="16"
            y="27"
            textAnchor="middle"
            fill="var(--ink-muted)"
            fontSize="10"
          >
            ↑
          </text>
        </g>

        {places.map((place) => {
          const x = PADDING + place.col * (CELL + GAP) + CELL / 2;
          const y = PADDING + place.row * (CELL + GAP) + CELL / 2;
          const isReference =
            place.id === (cfg.mode === "explore" ? exploreValues?.from : cfg.reference);
          const isTarget =
            place.id === (cfg.mode === "explore" ? exploreValues?.to : cfg.target);
          const fill = place.color ?? "var(--accent)";
          return (
            <g key={place.id}>
              <rect
                x={x - CELL / 2 + 4}
                y={y - CELL / 2 + 4}
                width={CELL - 8}
                height={CELL - 8}
                rx="6"
                fill={fill}
                fillOpacity={isReference || isTarget ? 0.35 : 0.2}
                stroke={isReference || isTarget ? "var(--accent)" : "transparent"}
                strokeWidth="2"
              />
              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="13"
                fontWeight={isReference || isTarget ? 600 : 400}
              >
                {place.label}
              </text>
              {(isReference || isTarget) && (
                <text
                  x={x}
                  y={y - CELL / 2 + 14}
                  textAnchor="middle"
                  fill="var(--accent)"
                  fontSize="10"
                >
                  {isReference ? "观察点" : "目标"}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {cfg.mode === "identify" && (
        <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="选择方向">
          {optionDirections.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => handleIdentify(d)}
              className="flex h-11 min-w-[4rem] items-center justify-center gap-1 rounded-lg border border-border bg-surface px-3 text-sm text-ink transition hover:border-accent hover:text-accent"
            >
              <span>{DIRECTION_ICONS[d]}</span>
              {DIRECTION_LABELS[d]}
            </button>
          ))}
        </div>
      )}

      {cfg.mode === "select" && (
        <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="选择地点">
          {optionPlaces.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSelect(p.id)}
              className="rounded-lg border border-border bg-surface px-4 py-2 text-sm text-ink transition hover:border-accent hover:text-accent"
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {cfg.mode === "route" && cfg.route && cfg.missingLeg !== undefined && (
        <div className="w-full max-w-md space-y-3 rounded-xl border border-border bg-surface/80 p-4">
          <ol className="list-inside list-decimal space-y-1 text-sm text-ink">
            {cfg.route.map((leg, idx) => (
              <li
                key={idx}
                className={idx === cfg.missingLeg ? "font-medium text-accent" : ""}
              >
                {idx === cfg.missingLeg ? (
                  <>
                    从 {leg.from} 向{" "}
                    <select
                      value={attempt?.answer ?? ""}
                      onChange={(e) =>
                        recordAttempt(e.target.value as Direction)
                      }
                      className="rounded border border-border bg-paper px-2 py-1 text-ink"
                    >
                      <option value="">选择方向</option>
                      {optionDirections.map((d) => (
                        <option key={d} value={d}>
                          {DIRECTION_LABELS[d]}
                        </option>
                      ))}
                    </select>{" "}
                    走到 {leg.to}
                  </>
                ) : (
                  <>
                    从 {leg.from} 向 {DIRECTION_LABELS[leg.direction]} 走到 {leg.to}
                  </>
                )}
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={() => {
              const answer = attempt?.answer;
              if (answer && isDirection(answer)) {
                handleRouteSubmit(answer);
              }
            }}
            disabled={!attempt?.answer || !isDirection(attempt.answer)}
            className="w-full rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover disabled:opacity-40"
          >
            检查路线
          </button>
        </div>
      )}

      {cfg.mode === "explore" && exploreValues && (
        <div className="w-full max-w-md space-y-3 rounded-xl border border-border bg-surface/80 p-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1">
              <span className="text-xs text-ink-muted">观察点</span>
              <select
                value={exploreValues.from}
                onChange={(e) => setExploreFrom(e.target.value)}
                className="w-full rounded-lg border border-border bg-paper px-2 py-2 text-sm text-ink"
              >
                {places.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-xs text-ink-muted">目标</span>
              <select
                value={exploreValues.to}
                onChange={(e) => setExploreTo(e.target.value)}
                className="w-full rounded-lg border border-border bg-paper px-2 py-2 text-sm text-ink"
              >
                {places.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="text-center text-base text-ink">
            {computedDirection ? (
              <>
                <span className="font-semibold text-accent">
                  {toPlace?.label}
                </span>
                在
                <span className="font-semibold text-accent">
                  {fromPlace?.label}
                </span>
                的
                <span className="font-semibold text-accent">
                  {DIRECTION_LABELS[computedDirection]}
                </span>
                方向
              </>
            ) : (
              "请选择两个不同的地点"
            )}
          </p>
          <button
            type="button"
            onClick={() => recordAttempt(`${exploreValues.from}>${exploreValues.to}`, true)}
            className="w-full rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover"
          >
            确认方向
          </button>
        </div>
      )}

      {attempt && typeof attempt.correct === "boolean" && (
        <p
          className={`text-center text-sm ${
            attempt.correct ? "text-success" : "text-wrong"
          }`}
          role="status"
        >
          {attempt.correct
            ? `✓ 正确！${answerFeedbackText(cfg, attempt.answer, places, fromPlace, toPlace)}`
            : "✗ 再想想，看看地图上的方向标。"}
        </p>
      )}
    </div>
  );
}

function answerFeedbackText(
  cfg: PositionMapConfig,
  answer: string,
  places: Place[],
  fromPlace?: Place,
  toPlace?: Place,
): string {
  if (cfg.mode === "identify" && fromPlace && toPlace) {
    const correct = directionBetween(fromPlace, toPlace);
    return `${toPlace.label} 在 ${fromPlace.label} 的 ${DIRECTION_LABELS[correct]} 方向。`;
  }
  if (cfg.mode === "select" && fromPlace && cfg.direction) {
    const target = placeById(places, answer);
    return `${target?.label} 在 ${fromPlace.label} 的 ${DIRECTION_LABELS[cfg.direction]} 方向。`;
  }
  if (cfg.mode === "route" && cfg.route && cfg.missingLeg !== undefined) {
    const correct = cfg.route[cfg.missingLeg].direction;
    return `向 ${DIRECTION_LABELS[correct]} 走。`;
  }
  return "";
}
