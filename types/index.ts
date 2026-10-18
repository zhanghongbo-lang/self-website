export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  avatar: string;
  social: {
    github?: string;
    email?: string;
    wechat?: string;
    blog?: string;
  };
}

export interface Highlight {
  label: string;
  value: string;
}

export interface TimelineItem {
  period: string;
  title: string;
  description: string;
}

export interface About {
  headline: string;
  bio: string;
  highlights: Highlight[];
  timeline?: TimelineItem[];
}

export interface Skill {
  name: string;
  level: number;
  note?: string;
}

export interface SkillGroup {
  group: string;
  items: Skill[];
}

export interface ProjectMeta {
  slug: string;
  title: string;
  description: string;
  cover?: string;
  tech: string[];
  tags?: string[];
  demo?: string;
  source?: string;
  featured?: boolean;
  date: string;
}

export interface Project extends ProjectMeta {
  content: string;
}

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  category?: string;
  cover?: string;
  draft?: boolean;
}

export interface Post extends PostMeta {
  content: string;
  readingMinutes: number;
}
