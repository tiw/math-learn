import type { Lesson, WidgetConfig } from "@/lib/lesson-types";

export const decimalsLesson: Lesson = {
  id: "grade3-sem2-decimals",
  entry: 7,
  chapter: 7,
  title: "小数的初步认识",
  subtitle: "三年级下册 · 小数",
  backHref: "/",
  backLabel: "返回目录",
  footerNote: "参考：人教版三年级下册 · 第 7 章 p.84–93",
  prevLesson: {
    href: "/lesson/calendar",
    title: "年、月、日",
  },
  nextLesson: {
    href: "/lesson/matching",
    title: "数学广角——搭配（二）",
  },
  objectives: [
    "认识生活中的小数，会读、写简单的小数",
    "知道十分之几可以写成一位小数",
    "会把分米、角等单位用小数表示",
    "会比较小数的大小并排序",
  ],
  intro:
    "小数在生活中随处可见：价格标签、体温、身高……这节课我们认识小数，学习怎么读写，以及怎样比较它们的大小。",
  steps: [
    {
      id: "step-1",
      title: "生活中的小数",
      caption: "图 1 · 认识小数",
      narration:
        "超市的价格标签、体温计上，经常出现这样的数：3.45、0.85、2.60、36.6。它们叫作小数，中间的小圆点叫作小数点。点击卡片，看看它们怎么读。",
      widget: {
        kind: "decimals",
        props: { mode: "intro" },
      } as unknown as WidgetConfig,
    },
    {
      id: "step-2",
      title: "1 分米 = 0.1 米",
      caption: "图 2 · 米和分米",
      narration:
        "把 1 米平均分成 10 份，每份是 1 分米。1 分米是 1 米的十分之一，可以写成 0.1 米。拖动滑块，看看几分米对应多少米。",
      widget: {
        kind: "decimals",
        props: { mode: "measure" },
      } as unknown as WidgetConfig,
    },
    {
      id: "step-3",
      title: "1 角 = 0.1 元",
      caption: "图 3 · 元和角",
      narration:
        "1 元 = 10 角，所以 1 角是十分之一元，写成 0.1 元。5 角就是 0.5 元。拖动滑块换一换。",
      widget: {
        kind: "decimals",
        props: { mode: "money" },
      } as unknown as WidgetConfig,
    },
    {
      id: "step-4",
      title: "小数比大小",
      caption: "图 4 · 数轴上比一比",
      narration:
        "四名男生跳高成绩分别是 0.8 米、1.2 米、1.1 米和 1.09 米。先把两个数放到数轴上，再点一点哪个更高。",
      widget: {
        kind: "decimals",
        props: { mode: "compare", pair: [0.8, 1.2] },
      } as unknown as WidgetConfig,
    },
    {
      id: "step-5",
      title: "排出名次",
      caption: "图 5 · 从大到小排一排",
      narration:
        "把 0.8、1.2、1.1、1.09 按从大到小排一排：1.2 > 1.1 > 1.09 > 0.8。请按顺序点击数字。",
      widget: {
        kind: "decimals",
        props: {
          mode: "order",
          values: [0.8, 1.2, 1.1, 1.09],
          order: "desc",
        },
      } as unknown as WidgetConfig,
    },
  ],
  exercises: [
    {
      id: "race-rank",
      title: "50 米跑颁奖台",
      description:
        "四名同学的 50 米跑成绩如下：小辉 8.2 秒、小林 8.4 秒、小刚 8.8 秒、小涛 8.6 秒。跑步时间越短越快，请把成绩按从快到慢（从小到大）排列。",
      widget: {
        kind: "decimals",
        props: {
          mode: "order",
          values: [8.2, 8.4, 8.8, 8.6],
          order: "asc",
        },
      } as unknown as WidgetConfig,
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: "1 分米写成小数是多少米？",
      hint: "1 分米 = 1/10 米",
      answer: 0.1,
      unit: "米",
    },
    {
      id: "q2",
      prompt: "5 角是多少元（用小数表示）？",
      hint: "1 角 = 0.1 元",
      answer: 0.5,
      unit: "元",
    },
    {
      id: "q3",
      prompt: "3 分米是多少米（用小数表示）？",
      hint: "3 分米 = 3/10 米",
      answer: 0.3,
      unit: "米",
    },
    {
      id: "q4",
      prompt: "下面哪个跳高成绩最高？",
      answer: 1.2,
      choices: [
        { label: "0.8 米", value: 0.8 },
        { label: "1.1 米", value: 1.1 },
        { label: "1.09 米", value: 1.09 },
        { label: "1.2 米", value: 1.2 },
      ],
    },
  ],
};
