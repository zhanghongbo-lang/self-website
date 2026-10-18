import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProjectSlugs, getProject } from "@/lib/content";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) {
    return { title: "项目不存在" };
  }
  return { title: project.title, description: project.description };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold">{project.title}</h1>
      <p className="mt-3 text-muted">{project.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.tech.map((tech) => (
          <span
            key={tech}
            className="rounded-md bg-card px-2 py-0.5 text-xs text-muted"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-6 flex gap-4 text-sm">
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            在线演示
          </a>
        )}
        {project.source && (
          <a
            href={project.source}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            源码
          </a>
        )}
      </div>

      <div
        className="markdown mt-10"
        dangerouslySetInnerHTML={{ __html: project.content }}
      />
    </article>
  );
}
