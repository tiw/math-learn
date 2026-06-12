import type { Lesson, WidgetConfig } from "@/lib/lesson-types";

export const matchingLesson: Lesson = {
  id: "grade3-sem2-matching",
  entry: 8,
  chapter: 8,
  title: "数学广角——搭配（二）",
  subtitle: "三年级下册 · 搭配",
  backHref: "/",
  backLabel: "返回目录",
  footerNote: "参考：人教版三年级下册 · 第 8 章 p.94–98",
  prevLesson: {
    href: "/lesson/decimals",
    title: "小数的初步认识",
  },
  nextLesson: {
    href: "/lesson/review",
    title: "总复习",
  },
  objectives: [
    "能用固定顺序列举搭配方案，做到不重不漏",
    "会用连线、列表等方法解决搭配问题",
    "能用乘法计算两类事物的搭配总数",
    "能区分「有序排列」和「无序组合」",
  ],
  intro:
    "早餐、穿衣、比赛……生活中处处有搭配。只要按顺序、有条理地思考，就能不重不漏地找出所有方案。",
  steps: [
    {
      id: "step-1",
      title: "搭配问题从哪来",
      caption: "图 1 · 生活中的搭配",
      narration:
        "早上选早餐、出门选衣服、学校安排比赛，都会遇到「可以有多少种不同搭配」的问题。这节课我们学习怎样有序地找出所有方案。",
      widget: { kind: "matching", props: { mode: "intro" } } as unknown as WidgetConfig,
    },
    {
      id: "step-2",
      title: "用数字组两位数",
      caption: "图 2 · 0、1、3、5 能组成几个两位数",
      narration:
        "用 0、1、3、5 组成没有重复数字的两位数，十位不能是 0。先固定十位，再换个位，就能不重不漏地写出来。",
      widget: {
        kind: "matching",
        props: { mode: "digits", digits: [0, 1, 3, 5] },
      } as unknown as WidgetConfig,
    },
    {
      id: "step-3",
      title: "衣服怎么配",
      caption: "图 3 · 上装和下装的搭配",
      narration:
        "有 2 件上装和 3 件下装，每次各选 1 件。每件上装都可以和 3 件下装搭配，用乘法可以很快算出一共有多少种穿法。",
      widget: {
        kind: "matching",
        props: {
          mode: "outfit",
          tops: ["红色上衣", "蓝色上衣"],
          bottoms: ["黑色裤子", "白色裤子", "灰色裙子"],
        },
      } as unknown as WidgetConfig,
    },
    {
      id: "step-4",
      title: "每两个班赛一场",
      caption: "图 4 · 4 个班一共要比几场",
      narration:
        "4 个班进行足球比赛，每 2 个班踢一场。先把一个班和其他班分别连线，再依次确定下一个班，就能数出总场次。",
      widget: {
        kind: "matching",
        props: { mode: "handshake", items: ["1 班", "2 班", "3 班", "4 班"] },
      } as unknown as WidgetConfig,
    },
    {
      id: "step-5",
      title: "有序思考，不重不漏",
      caption: "图 5 · 搭配小妙招",
      narration:
        "搭配问题的关键是「有序」：先固定一个，再依次搭配另一个。两类事物搭配用乘法；每两人只算一次时要除掉重复。",
      widget: { kind: "matching", props: { mode: "summary" } } as unknown as WidgetConfig,
    },
  ],
  exercises: [
    {
      id: "digit-practice",
      title: "做一做：用 0、2、4、6 组两位数",
      description:
        "课本做一做：用 0、2、4、6 能组成多少个没有重复数字的两位数？",
      widget: {
        kind: "matching",
        props: { mode: "digits", digits: [0, 2, 4, 6] },
      } as unknown as WidgetConfig,
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: "用 0、2、4、6 组成没有重复数字的两位数，能组成多少个？",
      hint: "十位不能是 0，十位有 3 种选择，个位也有 3 种选择",
      answer: 9,
      unit: "个",
    },
    {
      id: "q2",
      prompt: "有 2 件上装和 4 件下装，每次各选 1 件，有多少种不同搭配？",
      hint: "上装数 × 下装数",
      answer: 8,
      unit: "种",
    },
    {
      id: "q3",
      prompt: "5 个人，每 2 个人握一次手，一共要握多少次手？",
      hint: "第一个人和 4 人握手，第二个人再和剩下 3 人握手……",
      answer: 10,
      unit: "次",
    },
  ],
};
