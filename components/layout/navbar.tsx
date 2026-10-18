"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/lib/site";

const links = [
  { href: "/", label: "首页" },
  { href: "/skills", label: "技能" },
  { href: "/projects", label: "项目" },
  { href: "/blog", label: "博客" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname.startsWith(href);
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-card-border bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-lg font-semibold"
          onClick={() => setOpen(false)}
        >
          {siteConfig.name}
        </Link>

        <div className="hidden gap-1 sm:flex">
          {links.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  active
                    ? "rounded-md bg-card px-3 py-2 text-sm font-medium text-primary"
                    : "rounded-md px-3 py-2 text-sm text-muted transition hover:text-foreground"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          className="rounded-md px-3 py-2 text-sm text-muted sm:hidden"
          aria-label={open ? "关闭菜单" : "打开菜单"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "关闭" : "菜单"}
        </button>
      </nav>

      {open && (
        <div className="border-t border-card-border px-6 py-4 sm:hidden">
          <div className="flex flex-col gap-2">
            {links.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={
                    active
                      ? "rounded-md bg-card px-3 py-2 text-sm font-medium text-primary"
                      : "rounded-md px-3 py-2 text-sm text-muted"
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
