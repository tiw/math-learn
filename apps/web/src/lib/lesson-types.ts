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

export type WidgetConfig =
  | { kind: "area-grid"; props: AreaGridConfig }
  | { kind: "area-units"; props: AreaUnitsConfig }
  | { kind: "square-area"; props: SquareAreaConfig }
  | { kind: "cut-max-square"; props: CutMaxSquareConfig };

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
