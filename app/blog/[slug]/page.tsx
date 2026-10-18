import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getAllPostSlugs, getPost } from "@/lib/content";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    return { title: "文章不存在" };
  }
  return { title: post.title, description: post.summary };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    notFound();
  }

  const posts = await getAllPosts();
  const index = posts.findIndex((item) => item.slug === slug);
  const prev = index > 0 ? posts[index - 1] : null;
  const next = index < posts.length - 1 ? posts[index + 1] : null;

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-center gap-3 text-sm text-muted">
        <time>{post.date}</time>
        <span>·</span>
        <span>{post.readingMinutes} 分钟阅读</span>
      </div>

      <h1 className="mt-3 text-3xl font-bold">{post.title}</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-card px-2 py-0.5 text-xs text-muted"
          >
            {tag}
          </span>
        ))}
      </div>

      <div
        className="markdown mt-10"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <nav className="mt-16 flex justify-between gap-4 border-t border-card-border pt-6 text-sm">
        {prev ? (
          <Link href={`/blog/${prev.slug}`} className="text-muted hover:text-foreground">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/blog/${next.slug}`} className="text-right text-muted hover:text-foreground">
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
