import type { MetadataRoute } from "next";
import { getAllPosts, getAllProjects } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPages = ["", "/skills", "/projects", "/blog"].map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
  }));
  const projects = (await getAllProjects()).map((project) => ({
    url: absoluteUrl(`/projects/${project.slug}`),
    lastModified: now,
  }));
  const posts = (await getAllPosts()).map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: now,
  }));

  return [...staticPages, ...projects, ...posts];
}
