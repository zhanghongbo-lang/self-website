import type { SkillGroup } from "@/types";

export const skills: SkillGroup[] = [
  {
    group: "前端",
    items: [
      { name: "React", level: 90, note: "组件化、Hooks、性能优化" },
      { name: "Next.js", level: 85, note: "SSR / SSG / App Router" },
      { name: "TypeScript", level: 85, note: "严格模式、类型设计" },
      { name: "Tailwind CSS", level: 80, note: "设计令牌与响应式" },
    ],
  },
  {
    group: "后端",
    items: [
      { name: "Node.js", level: 70, note: "API 开发" },
      { name: "PostgreSQL", level: 60, note: "数据建模" },
    ],
  },
  {
    group: "工具",
    items: [
      { name: "Git", level: 85 },
      { name: "Docker", level: 65 },
      { name: "CI/CD", level: 70 },
    ],
  },
];
