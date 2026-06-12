import type { Lesson, WidgetConfig } from "@/lib/lesson-types";

export const calendarLesson: Lesson = {
  id: "grade3-sem2-calendar",
  entry: 6,
  chapter: 6,
  title: "年、月、日",
  subtitle: "三年级下册 · 时间",
  backHref: "/",
  backLabel: "返回目录",
  footerNote: "参考：人教版三年级下册 · 第 6 章 p.70–82",
  prevLesson: {
    href: "/lesson/multiplication",
    title: "两位数乘两位数",
  },
  nextLesson: {
    href: "/lesson/decimals",
    title: "小数的初步认识",
  },
  objectives: [
    "认识年、月、日三个常用时间单位",
    "知道一年有 12 个月，能区分大月、小月和特殊的 2 月",
    "理解平年和闰年，会判断简单年份",
    "认识 24 时计时法，会进行简单的时间换算",
    "能解决简单的经过时间实际问题",
  ],
  intro:
    "翻开年历，每一天都印在上面。一年有多少个月？每个月又有多少天？为什么 2 月有时 28 天、有时 29 天？今天我们就来认识这些常用的时间单位。",
  steps: [
    {
      id: "step-1",
      title: "一年有 12 个月",
      caption: "图 1 · 认识十二个月",
      narration:
        "这是一张年历。一年有 12 个月，每个月的天数不完全相同。我们把鼠标移到月份卡片上，看看它们分别有多少天。",
      widget: {
        kind: "calendar",
        props: { mode: "months-intro" },
      } as unknown as WidgetConfig,
    },
    {
      id: "step-2",
      title: "大月和小月",
      caption: "图 2 · 31 天的月份有哪些？",
      narration:
        "有 31 天的月份叫大月，有 30 天的月份叫小月。请用手指点击所有的大月。",
      widget: {
        kind: "calendar",
        props: { mode: "months-sort", targetDays: 31 },
      } as unknown as WidgetConfig,
    },
    {
      id: "step-3",
      title: "特殊的 2 月",
      caption: "图 3 · 平年与闰年",
      narration:
        "2 月最特别。平年的 2 月有 28 天，闰年的 2 月有 29 天。观察不同年份的 2 月，判断它是平年还是闰年。",
      widget: {
        kind: "calendar",
        props: { mode: "leap-year", year: 2024 },
      } as unknown as WidgetConfig,
    },
    {
      id: "step-4",
      title: "24 时计时法",
      caption: "图 4 · 一天有 24 小时",
      narration:
        "为了简明且不易出错，人们常用 0 时到 24 时的计时法。拖动滑块改变时间，把 12 时计时法和 24 时计时法互相转换。",
      widget: {
        kind: "calendar",
        props: { mode: "24hour-dial", hour: 17 },
      } as unknown as WidgetConfig,
    },
    {
      id: "step-5",
      title: "经过的时间",
      caption: "图 5 · 小红坐火车",
      narration:
        "小红上午 9 时出发，下午 6 时到达。先把下午 6 时化成 18 时，再用 18 − 9 算出她坐了多久的火车。",
      widget: {
        kind: "calendar",
        props: { mode: "duration", startHour: 9, endHour: 18 },
      } as unknown as WidgetConfig,
    },
    {
      id: "step-6",
      title: "自由探索",
      caption: "图 6 · 换一换时间",
      narration:
        "改变开始和结束时间，算算任意两个时刻之间经过了几小时。也可以换不同的年份，看看 2 月有多少天。",
      widget: {
        kind: "calendar",
        props: { mode: "duration", startHour: 8, endHour: 14 },
      } as unknown as WidgetConfig,
    },
  ],
  exercises: [
    {
      id: "months-recall",
      title: "再来分一分小月",
      description: "请找出所有 30 天的月份。",
      widget: {
        kind: "calendar",
        props: { mode: "months-sort", targetDays: 30 },
      } as unknown as WidgetConfig,
    },
    {
      id: "leap-explore",
      title: "探索闰年规律",
      description: "试试 1900 年和 2000 年，哪一个才是闰年？",
      widget: {
        kind: "calendar",
        props: { mode: "leap-year", year: 1900 },
      } as unknown as WidgetConfig,
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: "一年有多少个月？",
      hint: "数一数年历上的月份",
      answer: 12,
      unit: "个月",
    },
    {
      id: "q2",
      prompt: "平年的 2 月有多少天？",
      hint: "平年 2 月 28 天，闰年 2 月 29 天",
      answer: 28,
      unit: "天",
    },
    {
      id: "q3",
      prompt: "下午 5 时用 24 时计时法表示是（ ）时。",
      hint: "5 + 12",
      answer: 17,
      unit: "时",
    },
    {
      id: "q4",
      prompt: "一场电影从 14 时 30 分开始，16 时 30 分结束，放映了（ ）小时。",
      hint: "16 时 30 分 − 14 时 30 分",
      answer: 2,
      unit: "小时",
    },
    {
      id: "q5",
      prompt: "下面哪个年份是闰年？",
      hint: "能被 4 整除，整百年需被 400 整除",
      answer: 2016,
      choices: [
        { label: "1994", value: 1994 },
        { label: "2016", value: 2016 },
        { label: "1900", value: 1900 },
        { label: "2010", value: 2010 },
      ],
    },
  ],
};
