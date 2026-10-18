import Link from "next/link";
import {
  getAbout,
  getAllPosts,
  getFeaturedProjects,
  getSkills,
} from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { ProjectCard } from "@/components/projects/project-card";
import { PostCard } from "@/components/blog/post-card";

export default async function HomePage() {
  const about = getAbout();
  const featured = (await getFeaturedProjects()).slice(0, 3);
  const posts = (await getAllPosts()).slice(0, 3);
  const skillTags = getSkills().flatMap((group) =>
    group.items.map((skill) => skill.name),
  );

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <section className="py-16 text-center">
        <h1 className="text-4xl font-bold sm:text-5xl">{siteConfig.name}</h1>
        <p className="mt-3 text-xl text-primary">{about.headline}</p>
        <p className="mx-auto mt-6 max-w-2xl text-muted">{about.bio}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/projects"
            className="rounded-full bg-primary px-6 py-2.5 font-medium text-white transition hover:brightness-110"
          >
            查看项目
          </Link>
          <Link
            href="/blog"
            className="rounded-full border border-card-border px-6 py-2.5 font-medium transition hover:bg-card"
          >
            阅读博客
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {about.highlights.map((highlight) => (
          <div
            key={highlight.label}
            className="rounded-xl border border-card-border bg-card p-6 text-center"
          >
            <div className="text-3xl font-bold text-primary">
              {highlight.value}
            </div>
            <div className="mt-1 text-sm text-muted">{highlight.label}</div>
          </div>
        ))}
      </section>

      <section className="mt-20">
        <h2 className="text-2xl font-semibold">精选项目</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-2xl font-semibold">技能</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {skillTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-card-border bg-card px-3 py-1 text-sm text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-2xl font-semibold">最新文章</h2>
        <div className="mt-6 grid grid-cols-1 gap-6">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
