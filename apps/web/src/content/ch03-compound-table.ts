import type { Lesson, WidgetConfig } from "@/lib/lesson-types";

export const compoundTableLesson: Lesson = {
  id: "grade3-sem2-compound-table",
  entry: 3,
  chapter: 3,
  title: "复式统计表",
  subtitle: "三年级下册 · 统计",
  backHref: "/",
  backLabel: "返回目录",
  footerNote: "参考：人教版三年级下册 · 第 3 章 p.34–37",
  prevLesson: {
    href: "/lesson/division",
    title: "除数是一位数的除法",
  },
  nextLesson: {
    href: "/lesson/multiplication",
    title: "两位数乘两位数",
  },
  objectives: [
    "认识单式统计表和复式统计表",
    "能把两个相关的单式统计表合并成复式统计表",
    "会从复式统计表中读取、比较信息",
    "体会复式统计表更简洁、更便于比较的优点",
  ],
  intro:
    "要了解全班同学最喜欢的运动项目，可以把男生、女生分开调查。可是分开的两张表不太方便比较。今天我们就来学习怎样把两张表「合二为一」，变成一张复式统计表。",
  steps: [
    {
      id: "step-1",
      title: "两张单式统计表",
      caption: "图 1 · 男生、女生分开统计",
      narration:
        "这是某班男生、女生最喜欢的运动项目人数情况。两个表的调查项目一样，但数据分开存放，比较起来有点麻烦。",
      widget: {
        kind: "compound-table",
        props: {
          mode: "intro",
          title: "最喜欢的运动项目",
          rowLabel: "运动项目",
          rows: ["足球", "篮球", "游泳", "乒乓球", "跳绳", "踢毽子"],
          colLabel: "性别",
          leftCol: "男生人数",
          rightCol: "女生人数",
          leftData: [8, 5, 2, 4, 6, 3],
          rightData: [2, 3, 5, 6, 4, 7],
        },
      } as unknown as WidgetConfig,
    },
    {
      id: "step-2",
      title: "合并成复式统计表",
      caption: "图 2 · 把两张表合起来",
      narration:
        "两个表的项目相同，可以合成一个表。横向写上男生人数、女生人数，纵向写上各种运动项目，就成了复式统计表。请你把人数填进去。",
      widget: {
        kind: "compound-table",
        props: {
          mode: "merge",
          title: "男生、女生最喜欢的运动项目人数情况",
          rowLabel: "运动项目",
          rows: ["足球", "篮球", "游泳", "乒乓球", "跳绳", "踢毽子"],
          colLabel: "性别",
          leftCol: "男生人数",
          rightCol: "女生人数",
          leftData: [8, 5, 2, 4, 6, 3],
          rightData: [2, 3, 5, 6, 4, 7],
        },
      } as unknown as WidgetConfig,
    },
    {
      id: "step-3",
      title: "从表中读取信息",
      caption: "图 3 · 比较男生女生喜好",
      narration:
        "合成一张表后，一眼就能看出：男生喜欢足球的人最多，女生喜欢踢毽子的人最多。你还发现了什么？",
      widget: {
        kind: "compound-table",
        props: {
          mode: "explore",
          title: "男生、女生最喜欢的运动项目人数情况",
          rowLabel: "运动项目",
          rows: ["足球", "篮球", "游泳", "乒乓球", "跳绳", "踢毽子"],
          colLabel: "性别",
          leftCol: "男生人数",
          rightCol: "女生人数",
          leftData: [8, 5, 2, 4, 6, 3],
          rightData: [2, 3, 5, 6, 4, 7],
        },
      } as unknown as WidgetConfig,
    },
    {
      id: "step-4",
      title: "做一做：空气质量天数",
      caption: "图 4 · 把三年的数据合并观察",
      narration:
        "下面是某市 2013 年、2017 年和 2021 年空气质量各级别天数。把它们合并成复式统计表，更容易比较变化。",
      widget: {
        kind: "compound-table",
        props: {
          mode: "explore",
          title: "某市空气质量各级别天数",
          rowLabel: "空气质量级别",
          rows: ["优", "良", "轻度污染", "中度污染", "重度污染", "严重污染"],
          colLabel: "年份",
          leftCol: "2017 年",
          rightCol: "2021 年",
          leftData: [124, 184, 40, 12, 5, 0],
          rightData: [66, 150, 79, 42, 20, 8],
        },
      } as unknown as WidgetConfig,
    },
    {
      id: "step-5",
      title: "复式统计表的优点",
      caption: "图 5 · 更简洁、更方便比较",
      narration:
        "复式统计表能同时表示几组数据，项目相同，一眼就能比较。你还见过生活中的哪些复式统计表？",
      widget: {
        kind: "compound-table",
        props: {
          mode: "intro",
          title: "复式统计表简洁明了",
          rowLabel: "运动项目",
          rows: ["足球", "篮球", "游泳", "乒乓球", "跳绳", "踢毽子"],
          colLabel: "性别",
          leftCol: "男生人数",
          rightCol: "女生人数",
          leftData: [8, 5, 2, 4, 6, 3],
          rightData: [2, 3, 5, 6, 4, 7],
        },
      } as unknown as WidgetConfig,
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: "根据运动项目调查表，男生喜欢哪种运动项目的人最多？",
      hint: "看「男生人数」这一列，找最大数",
      answer: 1,
      choices: [
        { label: "篮球", value: 2 },
        { label: "足球", value: 1 },
        { label: "跳绳", value: 3 },
      ],
    },
    {
      id: "q2",
      prompt: "参加运动项目调查的一共有多少人？",
      hint: "把所有男生人数和女生人数加起来",
      answer: 53,
      unit: "人",
    },
    {
      id: "q3",
      prompt: "右表是某汽车销售店 2017—2021 年燃油汽车和新能源汽车的销售情况。哪个说法正确？",
      hint: "燃油汽车销量逐年减少，新能源汽车销量逐年增加",
      answer: 2,
      choices: [
        { label: "燃油汽车的销量一年比一年多", value: 1 },
        { label: "新能源汽车的销量一年比一年多", value: 2 },
      ],
    },
  ],
};
