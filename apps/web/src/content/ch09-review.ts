import type { Lesson } from "@/lib/lesson-types";

export const reviewLesson: Lesson = {
  id: "grade3-sem2-review",
  entry: 9,
  chapter: 9,
  title: "总复习",
  subtitle: "三年级下册 · 整理与复习",
  backHref: "/",
  backLabel: "返回目录",
  footerNote: "参考：人教版三年级下册 · 第 9 章 p.101–108",
  prevLesson: {
    href: "/lesson/matching",
    title: "数学广角——搭配",
  },
  objectives: [
    "回顾本学期学过的主要知识和方法",
    "巩固面积单位：平方厘米、平方分米、平方米",
    "熟练运用长方形、正方形面积公式",
    "能解决剪最大正方形等实际问题",
  ],
  intro:
    "这学期我们认识了方向、学会了除数是一位数的除法、两位数乘两位数，还认识了面积、年月日和小数。现在像『成长小档案』一样，把印象最深、用得最熟的面积知识再整理一遍。",
  steps: [
    {
      id: "step-1",
      title: "面积单位再认识",
      caption: "图 1 · cm²、dm²、m²",
      narration:
        "面积单位有平方厘米、平方分米、平方米。指甲盖约 1 cm²，手掌约 1 dm²，教室地面常用 m²。点击按钮，再次感受它们的大小。",
      widget: {
        kind: "area-units",
        props: { mode: "compare", defaultUnit: "cm2" },
      },
    },
    {
      id: "step-2",
      title: "面积单位换算",
      caption: "图 2 · 1 dm² = 100 cm²",
      narration:
        "1 分米 = 10 厘米，所以 1 平方分米的正方形里能放 10×10 = 100 个 1 平方厘米的小方块。这个换算关系你还记得吗？",
      widget: {
        kind: "area-units",
        props: { mode: "convert" },
      },
    },
    {
      id: "step-3",
      title: "长方形面积公式",
      caption: "图 3 · 长 × 宽",
      narration:
        "长方形的面积 = 长 × 宽。这个长方形长 6 厘米、宽 4 厘米，面积是多少？",
      widget: {
        kind: "area-grid",
        props: {
          length: 6,
          width: 4,
          mode: "formula",
          showFormula: true,
          showLabels: true,
        },
      },
    },
    {
      id: "step-4",
      title: "动手铺一铺",
      caption: "图 4 · 铺满长方形",
      narration:
        "口算练完了，动动手。点击带 + 号的格子，把这个长方形铺满，验证面积公式。",
      widget: {
        kind: "area-grid",
        props: {
          length: 5,
          width: 4,
          mode: "place",
          placePhase: "complete-grid",
          showLabels: true,
        },
      },
    },
    {
      id: "step-5",
      title: "正方形面积",
      caption: "图 5 · 边长 × 边长",
      narration:
        "正方形是特殊的长方形，长 = 宽，所以面积 = 边长 × 边长。拖动滑块，看看不同边长的正方形面积怎么变。",
      widget: {
        kind: "square-area",
        props: { side: 5, mode: "explore" },
      },
    },
    {
      id: "step-6",
      title: "剪下最大的正方形",
      caption: "图 6 · 实际问题",
      narration:
        "课本做一做：一张长 30 厘米、宽 21 厘米的长方形纸，剪下一个最大的正方形，它的面积是多少？拖动滑块找出答案。",
      widget: {
        kind: "cut-max-square",
        props: { length: 30, width: 21 },
      },
    },
  ],
  exercises: [
    {
      id: "fitness-garden",
      title: "健身园占地多少平方米？",
      description:
        "课本 p.102：一个长方形健身园长 85 米、宽 66 米。它占地多少平方米？",
      widget: {
        kind: "area-grid",
        props: {
          length: 10,
          width: 8,
          mode: "explore",
          showFormula: true,
          showLabels: true,
        },
      },
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: "一个长方形健身园长 85 米、宽 66 米，占地多少平方米？",
      hint: "长 × 宽 = 85 × 66",
      answer: 5610,
      unit: "m²",
    },
    {
      id: "q2",
      prompt: "1 dm² = ？ cm²",
      hint: "1 分米 = 10 厘米，1 dm² 里有 10×10 个 1 cm²",
      answer: 100,
      unit: "cm²",
    },
    {
      id: "q3",
      prompt: "长 30 cm、宽 21 cm 的长方形纸，剪下最大正方形，面积是多少？",
      hint: "最大正方形的边长等于长方形的宽",
      answer: 441,
      unit: "cm²",
    },
    {
      id: "q4",
      prompt: "一个正方形养鱼池，边长是 15 米，水面面积是多少平方米？",
      hint: "正方形面积 = 边长 × 边长",
      answer: 225,
      unit: "m²",
    },
  ],
};
