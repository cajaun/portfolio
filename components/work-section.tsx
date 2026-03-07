"use client";

import { useState } from "react";
import { AnimatedTabs } from "./ui/tabs/tabs";
import Link from "next/link";
import { ArticlesIcon } from "./ui/icons/articles";
import { ComponentsIcon } from "./ui/icons/components";
import { RocketIcon } from "./ui/icons/rocket";
import { TextMorph } from "torph/react";

type BlogPost = {
  slug: string;
  title: string;
  publishedAt: string;
};

const tabs = [
  {
    id: "articles",
    name: "Articles",
    icon: <ArticlesIcon className="size-5" />,
  },
  {
    id: "components",
    name: "Components",
    icon: <ComponentsIcon className="size-5" />,
  },
  {
    id: "projects",
    name: "Projects",
    icon: <RocketIcon className="size-5" />,
  },
];

export default function WorkSection({ posts }: { posts: BlogPost[] }) {
  const [activeTab, setActiveTab] = useState("articles");

  const components = [
    {
      title: "Slide to Listen",
      date: "March 14, 2026",
      href: "/",
    },
    {
      title: "Elastic Slider",
      date: "March 20, 2026",
      href: "/",
    },
  ];

  const projects = [
    { title: "Varse", date: "August 23, 2025", href: "https://varse.app" },
    {
      title: "RankedOut",
      date: "August 20, 2023",
      href: "https://rankedout.com",
    },
    { title: "Movers", date: "February 14, 2025", href: "/" },
    { title: "Auto-Care", date: "May 08, 2025", href: "/" },
  ];

  const items =
    activeTab === "articles"
      ? posts.map((p) => ({
          title: p.title,
          date: p.publishedAt,
          href: `/blog/${p.slug}`,
          external: false,
        }))
      : activeTab === "components"
        ? components.map((c) => ({
            title: c.title,
            date: c.date,
            href: c.href,
            external: false,
          }))
        : projects.map((p) => ({
            title: p.title,
            date: p.date,
            href: p.href,
            external: true,
          }));

  return (
    <div className="flex flex-col">
      <AnimatedTabs tabs={tabs} onChange={(id) => setActiveTab(id)} />

      <div className="flex flex-col gap-2 px-6">
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            className="group -mx-2 flex items-center gap-4 rounded-xl p-2 hover:bg-gray-300 dark:hover:bg-[#2A2A2A] transition-colors duration-500 ease-in-out"
          >
            {activeTab === "articles" && (
              <div className="relative flex h-13 w-11 shrink-0 select-none items-center justify-center overflow-hidden rounded-md shadow-custom bg-[lab(100%_0_0)] dark:bg-[lab(3.04863%_0_0)]">
                <div className="flex h-full w-full flex-col items-start justify-center gap-1 p-1.5">
                  <div className="flex h-full w-full flex-col justify-start gap-1">
                    <span className="mt-0.5 h-[3px] w-4 rounded-full bg-[lab(91.996%_-0.0000298023_0.0000119209)] dark:bg-[lab(17.06%_0_0)]" />
                    <span className="mt-1 h-[3px] w-8 rounded-full bg-[lab(91.996%_-0.0000298023_0.0000119209)] dark:bg-[lab(17.06%_0_0)]" />
                    <span className="h-[3px] w-6 rounded-full bg-[lab(91.996%_-0.0000298023_0.0000119209)] dark:bg-[lab(17.06%_0_0)]" />
                    <span className="mt-1 h-[3px] w-5 rounded-full bg-[lab(91.996%_-0.0000298023_0.0000119209)] dark:bg-[lab(17.06%_0_0)]" />
                    <span className="h-[3px] w-3 rounded-full bg-[lab(91.996%_-0.0000298023_0.0000119209)] dark:bg-[lab(17.06%_0_0)]" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "components" && (
              <div className="relative flex h-13 w-11 shrink-0 select-none items-center justify-center overflow-hidden rounded-md shadow-custom bg-[lab(100%_0_0)] dark:bg-[lab(3.04863%_0_0)]">
                <div className="flex h-full w-full flex-col items-start justify-center gap-1 p-1.5">
                  <div className="flex h-full w-full flex-col justify-start gap-1">
                    <div className="flex h-5 rounded-sm bg-[lab(91.996%_-0.0000298023_0.0000119209)] dark:bg-[lab(17.06%_0_0)]" />
                    <span className="h-[3px] w-5 rounded-full bg-[lab(91.996%_-0.0000298023_0.0000119209)] dark:bg-[lab(17.06%_0_0)]" />
                    <span className="h-[3px] w-8 rounded-full bg-[lab(91.996%_-0.0000298023_0.0000119209)] dark:bg-[lab(17.06%_0_0)]" />
                    <span className="h-[3px] w-3 rounded-full bg-[lab(91.996%_-0.0000298023_0.0000119209)] dark:bg-[lab(17.06%_0_0)]" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "projects" && (
              <div className="relative flex h-13 w-11 shrink-0 select-none items-center justify-center overflow-hidden rounded-md shadow-custom bg-[lab(100%_0_0)] dark:bg-[lab(3.04863%_0_0)]">
                <div className="flex h-full w-full flex-col gap-1 p-1.5">
                  <span className="mt-0.5 h-[3px] w-4 rounded-full bg-[lab(91.996%_-0.0000298023_0.0000119209)] dark:bg-[lab(17.06%_0_0)]" />

                  <div className="flex flex-row justify-between items-center gap-x-1">
                    <div className="h-[11px] w-1/2 rounded-sm bg-[lab(91.996%_-0.0000298023_0.0000119209)] dark:bg-[lab(17.06%_0_0)]" />
                    <div className="h-[11px] w-1/2 rounded-sm bg-[lab(91.996%_-0.0000298023_0.0000119209)] dark:bg-[lab(17.06%_0_0)]" />
                  </div>

                  <span className="h-[3px] w-5 rounded-full bg-[lab(91.996%_-0.0000298023_0.0000119209)] dark:bg-[lab(17.06%_0_0)]" />
                  <span className="h-[3px] w-8 rounded-full bg-[lab(91.996%_-0.0000298023_0.0000119209)] dark:bg-[lab(17.06%_0_0)]" />
                  <span className="h-[3px] w-3 rounded-full bg-[lab(91.996%_-0.0000298023_0.0000119209)] dark:bg-[lab(17.06%_0_0)]" />
                </div>
              </div>
            )}

            <div className="flex w-full min-w-0 items-center justify-between">
              <div className="flex min-w-0 flex-col">
                <TextMorph className="font-medium ">{item.title}</TextMorph>

                <TextMorph className="text-gray-200 font-medium leading-6 tracking-[-0.1px] dark:text-gray-100">
                  {item.date}
                </TextMorph>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
