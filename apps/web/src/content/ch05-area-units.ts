import type { Lesson } from "@/lib/lesson-types";

export const areaUnitsLesson: Lesson = {
  id: "grade3-sem2-ch5-units",
  entry: 5,
  chapter: 5,
  title: "面积和面积单位",
  subtitle: "三年级下册 · 面积",
  backHref: "/lesson/area",
  backLabel: "返回第 5 章",
  footerNote: "参考：人教版三年级下册 · 面积 p.54–58",
  nextLesson: {
    href: "/lesson/area/rectangle",
    title: "长方形面积的计算",
  },
  objectives: [
    "知道面积是物体表面或平面图形的大小",
    "认识 cm²、dm²、m²",
    "理解 1 dm² = 100 cm²",
  ],
  intro:
    "比较两块桌面谁更大，不能只看边长，要看「面」有多大。面积有自己的单位，一起来认识平方厘米、平方分米和平方米。",
  steps: [
    {
      id: "step-1",
      title: "面积是什么？",
      caption: "图 1 · 比较两个面",
      narration:
        "黑板面和课桌面，哪个更大？我们比的是「面」的大小，这就是面积。数学书封面的大小，就是封面的面积。",
      widget: {
        kind: "area-units",
        props: { mode: "compare", defaultUnit: "cm2" },
      },
    },
    {
      id: "step-2",
      title: "平方厘米 cm²",
      caption: "图 2 · 最小常用单位",
      narration:
        "边长 1 厘米的正方形，面积是 1 平方厘米，写作 1 cm²。指甲盖的大小就接近 1 cm²。",
      widget: {
        kind: "area-units",
        props: { mode: "compare", defaultUnit: "cm2" },
      },
    },
    {
      id: "step-3",
      title: "平方分米与平方米",
      caption: "图 3 · 更大的单位",
      narration:
        "边长 1 分米的正方形，面积是 1 平方分米（1 dm²）。边长 1 米的正方形，面积是 1 平方米（1 m²）。点击按钮切换，感受大小差别。",
      widget: {
        kind: "area-units",
        props: { mode: "compare", defaultUnit: "dm2" },
      },
    },
    {
      id: "step-4",
      title: "1 dm² = 100 cm²",
      caption: "图 4 · 单位换算",
      narration:
        "1 分米 = 10 厘米，所以 1 dm² 的正方形里，可以放进 10×10 = 100 个 1 cm² 的小方块。",
      widget: {
        kind: "area-units",
        props: { mode: "convert" },
      },
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: "边长 1 dm 的正方形，面积是多少？",
      hint: "单位是平方分米",
      answer: 1,
      unit: "dm²",
    },
    {
      id: "q2",
      prompt: "1 dm² = ？ cm²",
      hint: "10 × 10",
      answer: 100,
      unit: "cm²",
    },
    {
      id: "q3",
      prompt: "测量教室地面面积，用哪个单位最合适？",
      hint: "教室很大",
      answer: 3,
      choices: [
        { label: "cm²（平方厘米）", value: 1 },
        { label: "dm²（平方分米）", value: 2 },
        { label: "m²（平方米）", value: 3 },
      ],
    },
  ],
};
