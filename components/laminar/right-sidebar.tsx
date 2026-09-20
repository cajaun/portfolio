"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, BookOpen, Github } from "lucide-react";
import { getLaminarDocPage } from "./docs-nav";

const RESOURCE_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/cajaun/laminar",
    icon: Github,
  },
  {
    label: "Article",
    href: "https://cajaun.com/blog/laminar",
    icon: BookOpen,
  },
];

export default function LaminarRightSidebar() {
  const pathname = usePathname();
  const page = getLaminarDocPage(pathname);

  return (
    <aside className="sticky top-0 hidden h-screen w-[275px] flex-col border-l border-preview-border bg-[#FCFCFC] px-6 py-6 dark:border-preview-dark-border dark:bg-[#101010] lg:flex">
      <section className="mb-8">
        <h2 className="mb-2 text-[15px] font-semibold text-black dark:text-white">
          On this page
        </h2>
        <ul className="space-y-1">
          {page.sections.map((link) => (
            <li key={link.hash}>
              <a
                href={link.hash}
                className="flex h-8 w-[calc(100%+0.75rem)] -ml-2 items-center rounded-md px-2 text-[14px] font-medium text-gray-200 transition-colors hover:bg-gray-300 hover:text-black dark:text-gray-100 hover:dark:bg-[#2A2A2A] hover:dark:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-[15px] font-semibold text-black dark:text-white">
          Resources
        </h2>
        <ul className="space-y-1">
          {RESOURCE_LINKS.map((link) => {
            const Icon = link.icon;

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex h-8 w-[calc(100%+0.75rem)] -ml-2 items-center justify-between rounded-md px-2 text-[14px] font-medium text-gray-200 transition-colors hover:bg-gray-300 hover:text-black dark:text-gray-100 hover:dark:bg-[#2A2A2A] hover:dark:text-white"
                >
                  <span className="inline-flex min-w-0 items-center gap-2">
                    <Icon className="size-3.5 shrink-0" aria-hidden />
                    <span className="truncate">{link.label}</span>
                  </span>
                  <ArrowUpRight className="size-3.5 shrink-0" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </aside>
  );
}
