import { describe, expect, it } from "vitest";
import { parseFrontmatter, renderMarkdown } from "./markdown";

describe("parseFrontmatter", () => {
  it("解析 frontmatter 与正文", () => {
    const raw = [
      "---",
      'title: "测试文章"',
      'tags: ["a", "b"]',
      "featured: true",
      "---",
      "正文内容",
    ].join("\n");

    const { data, body } = parseFrontmatter(raw);

    expect(data.title).toBe("测试文章");
    expect(data.tags).toEqual(["a", "b"]);
    expect(data.featured).toBe(true);
    expect(body).toContain("正文内容");
  });
});

describe("renderMarkdown", () => {
  it("渲染标题与段落", async () => {
    const html = await renderMarkdown("# 标题\n\n段落");
    expect(html).toContain("<h1>标题</h1>");
    expect(html).toContain("<p>段落</p>");
  });

  it("渲染列表与链接", async () => {
    const html = await renderMarkdown("- 甲\n- 乙\n\n[链接](https://example.com)");
    expect(html).toContain("<ul>");
    expect(html).toContain("<li>甲</li>");
    expect(html).toContain('href="https://example.com"');
  });

  it("渲染代码块", async () => {
    const html = await renderMarkdown("```ts\nconst a = 1;\n```");
    expect(html).toContain("<pre");
    expect(html).toContain("<code");
  });
});
