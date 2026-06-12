import type { Lesson } from "@/lib/lesson-types";

export const rectangleLesson: Lesson = {
  id: "grade3-sem2-ch5-rectangle",
  entry: 5,
  chapter: 5,
  title: "长方形面积的计算",
  subtitle: "三年级下册 · 面积",
  backHref: "/lesson/area",
  backLabel: "返回第 5 章",
  footerNote: "参考：人教版三年级下册 · 面积 p.59–63",
  prevLesson: {
    href: "/lesson/area/units",
    title: "面积和面积单位",
  },
  objectives: [
    "理解面积是「铺满小正方形」的数量",
    "发现长方形面积 = 长 × 宽",
    "知道正方形面积 = 边长 × 边长",
    "会用公式解决简单实际问题",
  ],
  intro:
    "装修时要买瓷砖，得先知道地面有多大。这节课用 1 平方厘米的小方块，亲手「铺」出长方形的面积。",
  steps: [
    {
      id: "step-1",
      title: "什么是面积？",
      caption: "图 1 · 用方块测量面积",
      narration:
        "数学书封面的大小，就是它的面积。每个小格子代表 1 平方厘米（1 cm²）。",
      widget: {
        kind: "area-grid",
        props: {
          length: 5,
          width: 3,
          mode: "intro",
          showLabels: true,
        },
      },
    },
    {
      id: "step-2",
      title: "滚动铺方块",
      caption: "图 2 · 一格一格铺起来",
      tall: true,
      narration:
        "这个长方形长 5 厘米、宽 3 厘米。慢慢继续向下滚动，看着小方块一格一格铺起来：先铺第一行 5 个，再铺满 3 行。",
      widget: {
        kind: "area-grid",
        props: {
          length: 5,
          width: 3,
          mode: "scroll-fill",
          showLabels: true,
        },
      },
    },
    {
      id: "step-3",
      title: "你来铺第一行",
      caption: "图 3 · 点击铺第一行",
      narration:
        "轮到你啦！点击带 + 号的格子，在第一行铺满 5 个小方块。铺满后进度条会变绿。",
      widget: {
        kind: "area-grid",
        props: {
          length: 5,
          width: 3,
          mode: "place",
          placePhase: "first-row",
          showLabels: true,
        },
      },
    },
    {
      id: "step-4",
      title: "铺完整个长方形",
      caption: "图 4 · 点击铺格子",
      narration:
        "第一行已经铺好了。继续点击下面两行，把整个长方形铺满。",
      widget: {
        kind: "area-grid",
        props: {
          length: 5,
          width: 3,
          mode: "place",
          placePhase: "complete-grid",
          showLabels: true,
        },
      },
    },
    {
      id: "step-5",
      title: "发现公式：长 × 宽",
      caption: "图 5 · 长方形面积公式",
      narration:
        "一共 15 个小方块，面积就是 15 平方厘米。长方形的面积 = 长 × 宽，也就是 5 × 3 = 15（cm²）。",
      widget: {
        kind: "area-grid",
        props: {
          length: 5,
          width: 3,
          mode: "formula",
          showFormula: true,
          showLabels: true,
        },
      },
    },
    {
      id: "step-6",
      title: "正方形面积",
      caption: "图 6 · 边长 × 边长",
      narration:
        "正方形是长和宽相等的长方形。面积 = 边长 × 边长。拖动滑块，看看不同大小的正方形。",
      widget: {
        kind: "square-area",
        props: { side: 5, mode: "explore" },
      },
    },
    {
      id: "step-7",
      title: "自由探索",
      caption: "图 7 · 改变长与宽",
      narration:
        "拖动滑块改变长和宽，观察面积怎么变。公式始终成立：面积 = 长 × 宽。",
      widget: {
        kind: "area-grid",
        props: {
          length: 6,
          width: 4,
          mode: "explore",
          showFormula: true,
          showLabels: true,
        },
      },
    },
  ],
  exercises: [
    {
      id: "cut-square",
      title: "剪下最大的正方形",
      description:
        "课本做一做：长 30 cm、宽 21 cm 的纸，剪下最大的正方形，面积是多少？",
      widget: {
        kind: "cut-max-square",
        props: { length: 30, width: 21 },
      },
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: "长 8 cm、宽 5 cm 的长方形，面积是多少？",
      hint: "长 × 宽 = 8 × 5",
      answer: 40,
      unit: "cm²",
    },
    {
      id: "q2",
      prompt: "长 12 dm、宽 7 dm 的餐桌玻璃，面积是多少？",
      hint: "12 × 7",
      answer: 84,
      unit: "dm²",
    },
    {
      id: "q3",
      prompt: "正方形边长 9 cm，面积是多少？",
      hint: "9 × 9",
      answer: 81,
      unit: "cm²",
    },
  ],
};
