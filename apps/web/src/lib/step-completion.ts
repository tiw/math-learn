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
    case "position-map":
      return (
        widget.props.mode === "identify" ||
        widget.props.mode === "select" ||
        widget.props.mode === "route"
      );
    case "division-group":
      return (
        widget.props.mode === "share" ||
        widget.props.mode === "estimate" ||
        widget.props.mode === "long-div"
      );
    case "compound-table":
      return widget.props.mode === "merge";
    case "multiplication-area":
      return widget.props.mode === "fill";
    case "calendar":
      return (
        widget.props.mode === "months-sort" ||
        widget.props.mode === "leap-year" ||
        widget.props.mode === "24hour-dial" ||
        widget.props.mode === "duration"
      );
    case "decimals":
      return widget.props.mode === "compare" || widget.props.mode === "order";
    case "matching":
      return (
        widget.props.mode === "digits" ||
        widget.props.mode === "outfit" ||
        widget.props.mode === "handshake"
      );
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
