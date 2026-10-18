import { siteConfig } from "./site";

/** 将站内路径拼接为绝对地址，用于 sitemap / OG 等。 */
export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalized}`;
}
