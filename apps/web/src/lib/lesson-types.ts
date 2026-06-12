export type AreaGridConfig = {
  length: number;
  width: number;
  mode: "intro" | "place" | "scroll-fill" | "formula" | "explore";
  /** place 模式：先铺第一行 / 铺完整个长方形 */
  placePhase?: "first-row" | "complete-grid";
  showFormula?: boolean;
  showLabels?: boolean;
};

export type AreaUnitsConfig = {
  mode: "compare" | "convert";
  defaultUnit?: "cm2" | "dm2" | "m2";
};

export type SquareAreaConfig = {
  side: number;
  mode: "demo" | "explore";
};

export type CutMaxSquareConfig = {
  length: number;
  width: number;
};

export type PositionMapConfig = {
  mode: "identify" | "select" | "route" | "explore";
  rows?: number;
  cols?: number;
  places: { id: string; label: string; row: number; col: number; color?: string }[];
  reference?: string;
  target?: string;
  direction?: string;
  answer?: string;
  options?: string[];
  route?: { from: string; to: string; direction: string }[];
  missingLeg?: number;
  prompt?: string;
};

export type DivisionGroupConfig = {
  dividend: number;
  divisor: number;
  mode: "share" | "estimate" | "long-div" | "explore";
};

export type CompoundTableConfig = {
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

export type MultiplicationAreaConfig = {
  a: number;
  b: number;
  mode: "intro" | "fill" | "explore";
};

export type CalendarConfig = {
  mode:
    | "months-intro"
    | "months-sort"
    | "leap-year"
    | "24hour-dial"
    | "duration";
  targetDays?: 31 | 30 | 28 | 29;
  year?: number;
  hour?: number;
  startHour?: number;
  endHour?: number;
};

export type DecimalsConfig = {
  mode: "intro" | "measure" | "money" | "compare" | "order";
  values?: number[];
  pair?: [number, number];
  order?: "asc" | "desc";
};

export type MatchingConfig = {
  mode: "intro" | "digits" | "outfit" | "handshake" | "summary";
  digits?: number[];
  tops?: string[];
  bottoms?: string[];
  items?: string[];
};

export type WidgetConfig =
  | { kind: "area-grid"; props: AreaGridConfig }
  | { kind: "area-units"; props: AreaUnitsConfig }
  | { kind: "square-area"; props: SquareAreaConfig }
  | { kind: "cut-max-square"; props: CutMaxSquareConfig }
  | { kind: "position-map"; props: PositionMapConfig }
  | { kind: "division-group"; props: DivisionGroupConfig }
  | { kind: "compound-table"; props: CompoundTableConfig }
  | { kind: "multiplication-area"; props: MultiplicationAreaConfig }
  | { kind: "calendar"; props: CalendarConfig }
  | { kind: "decimals"; props: DecimalsConfig }
  | { kind: "matching"; props: MatchingConfig };

export type ScrollyStep = {
  id: string;
  title: string;
  narration: string;
  caption?: string;
  widget: WidgetConfig;
  /** scroll-fill 等需要长滚动区间的步骤 */
  tall?: boolean;
};

export type InteractiveExercise = {
  id: string;
  title: string;
  description?: string;
  widget: WidgetConfig;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  hint?: string;
  answer: number;
  unit?: string;
  choices?: { label: string; value: number }[];
};

export type Lesson = {
  id: string;
  entry: number;
  chapter: number;
  title: string;
  subtitle: string;
  objectives: string[];
  intro: string;
  steps: ScrollyStep[];
  exercises?: InteractiveExercise[];
  quiz: QuizQuestion[];
  backHref?: string;
  backLabel?: string;
  footerNote?: string;
  prevLesson?: { href: string; title: string };
  nextLesson?: { href: string; title: string };
};
