import fs from "node:fs";
import path from "node:path";
import { parseFrontmatter, renderMarkdown } from "./markdown";
import type { About, Post, PostMeta, Project, ProjectMeta, SkillGroup } from "@/types";
import { about } from "@/content/about";
import { skills } from "@/content/skills";

const root = process.cwd();
const projectsDir = path.join(root, "content", "projects");
const blogDir = path.join(root, "content", "blog");

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  if (typeof value === "string") {
    return [value];
  }
  return [];
}

function optionalStringArray(value: unknown): string[] | undefined {
  const arr = asStringArray(value);
  return arr.length > 0 ? arr : undefined;
}

function readMarkdownFiles(dir: string): Array<{ slug: string; raw: string }> {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => ({
      slug: file.replace(/\.md$/, ""),
      raw: fs.readFileSync(path.join(dir, file), "utf8"),
    }));
}

async function parseProject(slug: string, raw: string): Promise<Project> {
  const { data, body } = parseFrontmatter(raw);
  const meta: ProjectMeta = {
    slug,
    title: asString(data.title, slug),
    description: asString(data.description, ""),
    cover: optionalString(data.cover),
    tech: asStringArray(data.tech),
    tags: optionalStringArray(data.tags),
    demo: optionalString(data.demo),
    source: optionalString(data.source),
    featured: data.featured === true,
    date: asString(data.date, ""),
  };
  return { ...meta, content: await renderMarkdown(body) };
}

async function parsePost(slug: string, raw: string): Promise<Post> {
  const { data, body } = parseFrontmatter(raw);
  const meta: PostMeta = {
    slug,
    title: asString(data.title, slug),
    date: asString(data.date, ""),
    summary: asString(data.summary, ""),
    tags: asStringArray(data.tags),
    category: optionalString(data.category),
    cover: optionalString(data.cover),
    draft: data.draft === true,
  };
  return {
    ...meta,
    content: await renderMarkdown(body),
    readingMinutes: estimateReadingMinutes(body),
  };
}

function estimateReadingMinutes(content: string): number {
  const chars = content.replace(/\s/g, "").length;
  return Math.max(1, Math.round(chars / 500));
}

function sortByDateDesc<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.date.localeCompare(a.date));
}

export function getAbout(): About {
  return about;
}

export function getSkills(): SkillGroup[] {
  return skills;
}

export async function getAllProjects(): Promise<Project[]> {
  const projects = await Promise.all(
    readMarkdownFiles(projectsDir).map(({ slug, raw }) => parseProject(slug, raw)),
  );
  return sortByDateDesc(projects);
}

export async function getProject(slug: string): Promise<Project | null> {
  const file = path.join(projectsDir, `${slug}.md`);
  if (!fs.existsSync(file)) {
    return null;
  }
  return parseProject(slug, fs.readFileSync(file, "utf8"));
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getAllProjects();
  return projects.filter((project) => project.featured);
}

export async function getAllPosts(): Promise<Post[]> {
  const posts = await Promise.all(
    readMarkdownFiles(blogDir).map(({ slug, raw }) => parsePost(slug, raw)),
  );
  return sortByDateDesc(posts.filter((post) => !post.draft));
}

export async function getPost(slug: string): Promise<Post | null> {
  const file = path.join(blogDir, `${slug}.md`);
  if (!fs.existsSync(file)) {
    return null;
  }
  const post = await parsePost(slug, fs.readFileSync(file, "utf8"));
  return post.draft ? null : post;
}

export function getAllProjectSlugs(): string[] {
  return readMarkdownFiles(projectsDir).map(({ slug }) => slug);
}

export function getAllPostSlugs(): string[] {
  return readMarkdownFiles(blogDir).map(({ slug }) => slug);
}
