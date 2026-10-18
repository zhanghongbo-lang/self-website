import Link from "next/link";
import type { Post } from "@/types";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-xl border border-card-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary/50"
    >
      <div className="flex items-center gap-3 text-sm text-muted">
        <time>{post.date}</time>
        <span>·</span>
        <span>{post.readingMinutes} 分钟阅读</span>
      </div>
      <h3 className="mt-2 text-xl font-semibold group-hover:text-primary">
        {post.title}
      </h3>
      <p className="mt-2 text-muted">{post.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-background px-2 py-0.5 text-xs text-muted"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
