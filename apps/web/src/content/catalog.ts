export type LessonStatus = "ready" | "coming";

export type SubLesson = {
  id: string;
  href: string;
  title: string;
  subtitle: string;
  status: LessonStatus;
  pages?: string;
};

export type Chapter = {
  id: string;
  number: number;
  title: string;
  pdfPages: string;
  status: LessonStatus;
  href?: string;
  subLessons?: SubLesson[];
};

/** 人教版三年级下册 · 目录（对齐 math-3-2.pdf） */
export const catalog: Chapter[] = [
  {
    id: "ch01",
    number: 1,
    title: "位置与方向（一）",
    pdfPages: "p.2–10",
    status: "coming",
  },
  {
    id: "ch02",
    number: 2,
    title: "除数是一位数的除法",
    pdfPages: "p.11–33",
    status: "coming",
  },
  {
    id: "ch03",
    number: 3,
    title: "复式统计表",
    pdfPages: "p.34–37",
    status: "coming",
  },
  {
    id: "ch04",
    number: 4,
    title: "两位数乘两位数",
    pdfPages: "p.38–53",
    status: "coming",
  },
  {
    id: "ch05",
    number: 5,
    title: "面积",
    pdfPages: "p.54–69",
    status: "ready",
    href: "/lesson/area",
    subLessons: [
      {
        id: "area-units",
        href: "/lesson/area/units",
        title: "面积和面积单位",
        subtitle: "cm² · dm² · m²",
        status: "ready",
        pages: "p.54–58",
      },
      {
        id: "area-rectangle",
        href: "/lesson/area/rectangle",
        title: "长方形面积的计算",
        subtitle: "铺方块 · 长 × 宽",
        status: "ready",
        pages: "p.59–63",
      },
    ],
  },
  {
    id: "ch06",
    number: 6,
    title: "年、月、日",
    pdfPages: "p.70–82",
    status: "coming",
  },
  {
    id: "ch07",
    number: 7,
    title: "小数的初步认识",
    pdfPages: "p.84–93",
    status: "coming",
  },
  {
    id: "ch08",
    number: 8,
    title: "数学广角——搭配（二）",
    pdfPages: "p.94–98",
    status: "coming",
  },
  {
    id: "ch09",
    number: 9,
    title: "总复习",
    pdfPages: "p.101+",
    status: "coming",
  },
];

export function getChapter(id: string) {
  return catalog.find((c) => c.id === id);
}
