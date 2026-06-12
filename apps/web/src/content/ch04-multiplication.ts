import type { Lesson, WidgetConfig } from "@/lib/lesson-types";

export const multiplicationLesson: Lesson = {
  id: "grade3-sem2-multiplication",
  entry: 4,
  chapter: 4,
  title: "两位数乘两位数",
  subtitle: "三年级下册 · 乘法",
  backHref: "/",
  backLabel: "返回目录",
  footerNote: "参考：人教版三年级下册 · 第 4 章 p.38–53",
  prevLesson: {
    href: "/lesson/compound-table",
    title: "复式统计表",
  },
  nextLesson: {
    href: "/lesson/calendar",
    title: "年、月、日",
  },
  objectives: [
    "掌握整十、整百数的口算乘法",
    "理解两位数乘两位数的算理（拆分点子图）",
    "能正确列竖式计算两位数乘两位数",
    "会用连乘、连除解决简单实际问题",
  ],
  intro:
    "买草莓、算橙子、发酸奶……生活中处处要用到乘法。这一单元我们一起学习两位数乘两位数，用小格子“拆”出答案。",
  steps: [
    {
      id: "step-1",
      title: "口算热身：16 × 3",
      caption: "图 1 · 每筐 16 盒，3 筐有多少盒？",
      narration:
        "课本例 1：每筐有 16 盒草莓，3 筐有多少盒？把 16 拆成 10 和 6，分别乘 3 再相加。",
      widget: {
        kind: "multiplication-area",
        props: { a: 16, b: 3, mode: "intro" },
      } as unknown as WidgetConfig,
    },
    {
      id: "step-2",
      title: "整十数口算：12 × 20",
      caption: "图 2 · 每盒 12 个，20 盒有多少个？",
      narration:
        "每盒有 12 个苹果，20 盒有多少个？先算 12 × 2 = 24，再在末尾添一个 0，就是 240。",
      widget: {
        kind: "multiplication-area",
        props: { a: 12, b: 20, mode: "intro" },
      } as unknown as WidgetConfig,
    },
    {
      id: "step-3",
      title: "点子图：14 × 12",
      caption: "图 3 · 一套书 14 册，12 套有多少册？",
      narration:
        "一套书有 14 册，王老师买了 12 套。观察下面的长方形：把 14 分成 10 和 4，把 12 分成 10 和 2，四块小长方形合起来就是答案。",
      widget: {
        kind: "multiplication-area",
        props: { a: 14, b: 12, mode: "intro" },
      } as unknown as WidgetConfig,
    },
    {
      id: "step-4",
      title: "动手拆分：14 × 12",
      caption: "图 4 · 你来算一算每一块",
      narration:
        "现在轮到你了！根据拆分出的四块小长方形，分别写出每块有多少个小格子，然后检查答案。",
      widget: {
        kind: "multiplication-area",
        props: { a: 14, b: 12, mode: "fill" },
      } as unknown as WidgetConfig,
    },
    {
      id: "step-5",
      title: "笔算练习：23 × 13",
      caption: "图 5 · 先拆分，再相加",
      narration:
        "试着用同样的方法计算 23 × 13。把 23 拆成 20 和 3，把 13 拆成 10 和 3，四块面积分别是多少？",
      widget: {
        kind: "multiplication-area",
        props: { a: 23, b: 13, mode: "fill" },
      } as unknown as WidgetConfig,
    },
    {
      id: "step-6",
      title: "自由探索",
      caption: "图 6 · 改变两个乘数",
      narration:
        "拖动滑块改变两个乘数，面积模型会自动帮你拆分、计算。观察：什么时候需要四块？什么时候只需要两块？",
      widget: {
        kind: "multiplication-area",
        props: { a: 15, b: 15, mode: "explore" },
      } as unknown as WidgetConfig,
    },
  ],
  exercises: [
    {
      id: "warm-up",
      title: "口算小挑战",
      description: "课本做一做：11 × 5、15 × 6、23 × 4，你还会算吗？",
      widget: {
        kind: "multiplication-area",
        props: { a: 23, b: 4, mode: "intro" },
      } as unknown as WidgetConfig,
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: "16 × 3 = ?",
      hint: "10×3 + 6×3",
      answer: 48,
    },
    {
      id: "q2",
      prompt: "12 × 20 = ?",
      hint: "先算 12×2，再添一个 0",
      answer: 240,
    },
    {
      id: "q3",
      prompt: "14 × 12 = ?",
      hint: "10×12 + 4×12",
      answer: 168,
    },
    {
      id: "q4",
      prompt: "每箱保温壶 12 个，每个 45 元，一箱保温壶卖多少钱？",
      hint: "12 × 45",
      answer: 540,
      unit: "元",
    },
    {
      id: "q5",
      prompt: "60 名同学平均分成 2 队，每队再分成 3 组，每组有多少人？",
      hint: "60 ÷ 2 ÷ 3",
      answer: 10,
      unit: "人",
    },
  ],
};
