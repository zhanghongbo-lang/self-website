import { siteConfig } from "@/lib/site";

async function getCurrentYear(): Promise<number> {
  "use cache";
  return new Date().getFullYear();
}

export async function Footer() {
  const year = await getCurrentYear();

  return (
    <footer className="border-t border-card-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted sm:flex-row">
        <p>
          © {year} {siteConfig.name} · 保留所有权利
        </p>
        <div className="flex gap-4">
          {siteConfig.social.github && (
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-foreground"
            >
              GitHub
            </a>
          )}
          {siteConfig.social.email && (
            <a
              href={`mailto:${siteConfig.social.email}`}
              className="transition hover:text-foreground"
            >
              Email
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
