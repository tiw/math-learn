import type { ScrollyStep } from "@/lib/lesson-types";

/** 需要用户完成互动才计为「已完成」的步骤 */
export function stepRequiresCompletion(step: ScrollyStep): boolean {
  const { widget } = step;
  switch (widget.kind) {
    case "area-grid":
      return widget.props.mode === "place" || widget.props.mode === "scroll-fill";
    case "cut-max-square":
      return true;
    case "area-units":
      return widget.props.mode === "compare";
    default:
      return false;
  }
}

export function isScrollFillStep(step: ScrollyStep): boolean {
  return (
    step.widget.kind === "area-grid" &&
    step.widget.props.mode === "scroll-fill"
  );
}

/** 需要点击/拖拽等直接操作的步骤（scroll-fill 靠滚动驱动，单独处理） */
export function isClickInteractiveStep(step: ScrollyStep): boolean {
  return stepRequiresCompletion(step) && !isScrollFillStep(step);
}
