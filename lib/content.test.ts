import { describe, expect, it } from "vitest";
import { getAllPosts, getAllProjects, getPost, getProject } from "./content";

describe("content 读取", () => {
  it("读取示例项目列表", async () => {
    const projects = await getAllProjects();
    expect(projects.length).toBeGreaterThan(0);
    expect(projects[0].title).toBeTruthy();
  });

  it("按 slug 读取项目详情", async () => {
    const project = await getProject("starfield-portfolio");
    expect(project).not.toBeNull();
    expect(project?.title).toBe("个人展示网站");
    expect(project?.content).toContain("<h2");
  });

  it("读取博客文章", async () => {
    const posts = await getAllPosts();
    expect(posts.length).toBeGreaterThan(0);
  });

  it("文章按日期倒序排列", async () => {
    const posts = await getAllPosts();
    const dates = posts.map((post) => post.date);
    const sorted = [...dates].sort((a, b) => b.localeCompare(a));
    expect(dates).toEqual(sorted);
  });

  it("按 slug 读取文章详情", async () => {
    const post = await getPost("hello-world");
    expect(post).not.toBeNull();
    expect(post?.title).toBe("你好，世界");
  });
});
