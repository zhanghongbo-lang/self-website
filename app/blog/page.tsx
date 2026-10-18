import { getAllPosts } from "@/lib/content";
import { PostCard } from "@/components/blog/post-card";

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold">博客</h1>
      <p className="mt-2 text-muted">记录思考与技术笔记。</p>

      <div className="mt-10 space-y-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
