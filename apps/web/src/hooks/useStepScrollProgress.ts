"use client";

import { useEffect, useState } from "react";

/** 返回元素在滚动穿过视口时的进度 0–1（用于 scroll-fill 动画） */
export function useStepScrollProgress(element: HTMLElement | null) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!element) return;
    const el = element;

    function update() {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const stickyTop = vh * 0.18;
      // 轨道顶部到达视口 85% 处 → 0；轨道底部到达 sticky 线 → 1
      const startLine = vh * 0.85;
      const endLine = stickyTop;
      const range = Math.max(1, el.offsetHeight - (startLine - endLine));
      const traveled = startLine - rect.top;
      setProgress(Math.max(0, Math.min(1, traveled / range)));
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [element]);

  return progress;
}
