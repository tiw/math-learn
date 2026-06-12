import type { Lesson, WidgetConfig } from "@/lib/lesson-types";

export const divisionLesson: Lesson = {
  id: "grade3-sem2-division",
  entry: 2,
  chapter: 2,
  title: "除数是一位数的除法",
  subtitle: "三年级下册 · 除法",
  backHref: "/",
  backLabel: "返回目录",
  footerNote: "参考：人教版三年级下册 · 第 2 章 p.11–33",
  prevLesson: {
    href: "/lesson/position-direction",
    title: "位置与方向（一）",
  },
  nextLesson: {
    href: "/lesson/compound-table",
    title: "复式统计表",
  },
  objectives: [
    "掌握整十、整百数除以一位数的口算",
    "理解除法竖式的算理和写法",
    "会用估算解决实际问题",
    "认识商中间或末尾有 0 的除法",
  ],
  intro:
    "手工课上要把彩色纸平均分给同学，春游时要估算每天骑多少千米……除数是一位数的除法在生活中处处用得到。这节课从口算、估算到笔算，一步步掌握它。",
  steps: [
    {
      id: "step-1",
      title: "口算除法：几个十除以几",
      caption: "图 1 · 60 ÷ 3 = ？",
      narration:
        "把 60 张纸平均分给 3 人。60 就是 6 个十，6 个十除以 3 得 2 个十，也就是 20。",
      widget: {
        kind: "division-group",
        props: { dividend: 60, divisor: 3, mode: "long-div" },
      } as unknown as WidgetConfig,
    },
    {
      id: "step-2",
      title: "分一分：66 ÷ 3",
      caption: "图 2 · 先分整捆，再分单个",
      narration:
        "66 张纸平均分给 3 人。先分 6 捆（每捆 10 张），每人 2 捆；再分 6 张，每人 2 张。每人一共 22 张。",
      widget: {
        kind: "division-group",
        props: { dividend: 66, divisor: 3, mode: "share" },
      } as unknown as WidgetConfig,
    },
    {
      id: "step-3",
      title: "估算：每天大约骑行多少千米",
      caption: "图 3 · 267 ÷ 3 ≈ ？",
      narration:
        "李叔叔 3 天骑了 267 千米。267 接近 270，270 ÷ 3 = 90，所以每天大约骑行 90 千米。",
      widget: {
        kind: "division-group",
        props: { dividend: 267, divisor: 3, mode: "estimate" },
      } as unknown as WidgetConfig,
    },
    {
      id: "step-4",
      title: "笔算除法：42 ÷ 2",
      caption: "图 4 · 除法竖式",
      narration:
        "两个班共植树 42 棵，平均每班多少棵？先用 4 个十除以 2 得 2 个十，再用 2 个一除以 2 得 1 个一，结果是 21。",
      widget: {
        kind: "division-group",
        props: { dividend: 42, divisor: 2, mode: "long-div" },
      } as unknown as WidgetConfig,
    },
    {
      id: "step-5",
      title: "有余数的除法：148 ÷ 6",
      caption: "图 5 · 平均分后还剩多少",
      narration:
        "148 个石榴平均分给 6 个年级。14 个十除以 6 商 2 个十，余 2 个十；把 2 个十和 8 个一合起来是 28，28 除以 6 商 4，余 4。",
      widget: {
        kind: "division-group",
        props: { dividend: 148, divisor: 6, mode: "long-div" },
      } as unknown as WidgetConfig,
    },
    {
      id: "step-6",
      title: "商中间有 0：208 ÷ 2",
      caption: "图 6 · 十位不够商 1 就商 0",
      narration:
        "2 套《中国古典名著》共 208 元。百位 2 除以 2 商 1，十位 0 除以 2 商 0，个位 8 除以 2 商 4，每套 104 元。",
      widget: {
        kind: "division-group",
        props: { dividend: 208, divisor: 2, mode: "long-div" },
      } as unknown as WidgetConfig,
    },
    {
      id: "step-7",
      title: "解决问题：128 个菠萝需要几个纸箱",
      caption: "图 7 · 128 ÷ 6 ≈ ？",
      narration:
        "每箱装 6 个菠萝，今天收了 128 个。128 接近 120，120 ÷ 6 = 20，所以大约需要 20 多个纸箱。",
      widget: {
        kind: "division-group",
        props: { dividend: 128, divisor: 6, mode: "estimate" },
      } as unknown as WidgetConfig,
    },
  ],
  exercises: [
    {
      id: "explore-division",
      title: "自由探索",
      description: "改变被除数和除数，看看商和余数怎么变化。",
      widget: {
        kind: "division-group",
        props: { dividend: 96, divisor: 4, mode: "explore" },
      } as unknown as WidgetConfig,
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: "口算：600 ÷ 3 = ？",
      hint: "600 是 6 个百，6 个百除以 3 得 2 个百",
      answer: 200,
    },
    {
      id: "q2",
      prompt: "笔算：256 ÷ 2 = ？",
      hint: "2 个百除以 2，5 个十除以 2……",
      answer: 128,
    },
    {
      id: "q3",
      prompt: "估算：178 ÷ 6 的商最接近哪个整十数？",
      hint: "178 接近 180",
      answer: 30,
      choices: [
        { label: "20", value: 20 },
        { label: "30", value: 30 },
        { label: "40", value: 40 },
      ],
    },
    {
      id: "q4",
      prompt: "公园运来 88 盆花，平均摆在 2 个花坛里，每个花坛摆多少盆？",
      hint: "88 ÷ 2",
      answer: 44,
      unit: "盆",
    },
    {
      id: "q5",
      prompt: "口算：120 ÷ 3 = ？",
      hint: "120 是 12 个十",
      answer: 40,
    },
  ],
};
