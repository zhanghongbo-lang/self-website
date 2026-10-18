import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";

export interface ParsedMarkdown {
  data: Record<string, unknown>;
  body: string;
}

/** 解析 Markdown 文件头部的 frontmatter（由 gray-matter 处理 YAML）。 */
export function parseFrontmatter(raw: string): ParsedMarkdown {
  const { data, content } = matter(raw);
  return { data, body: content };
}

const processor = remark()
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypePrettyCode, { theme: "github-dark" })
  .use(rehypeStringify);

/** 将 Markdown 渲染为 HTML（remark + rehype，含 GFM 与代码高亮）。 */
export async function renderMarkdown(markdown: string): Promise<string> {
  "use cache";
  const file = await processor.process(markdown);
  return String(file);
}
