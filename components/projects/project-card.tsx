import Link from "next/link";
import type { Project } from "@/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col rounded-xl border border-card-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary/50"
    >
      <h3 className="text-lg font-semibold group-hover:text-primary">
        {project.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm text-muted">
        {project.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tech.map((tech) => (
          <span
            key={tech}
            className="rounded-md bg-background px-2 py-0.5 text-xs text-muted"
          >
            {tech}
          </span>
        ))}
      </div>
    </Link>
  );
}
