import { ArticlesIcon } from "@/components/ui/icons/articles";
import { ComponentsIcon } from "@/components/ui/icons/components";
import { RocketIcon } from "@/components/ui/icons/rocket";

export type WorkTabId = "articles" | "components" | "projects";

export type WorkItem = {
  title: string;
  date: string;
  href: string;
  external?: boolean;
};

export const WORK_TABS = [
  {
    id: "articles" as const,
    name: "Articles",
    icon: <ArticlesIcon className="size-5" />,
  },
  {
    id: "components" as const,
    name: "Components",
    icon: <ComponentsIcon className="size-5" />,
  },
  {
    id: "projects" as const,
    name: "Projects",
    icon: <RocketIcon className="size-5" />,
  },
] as const;

export const COMPONENT_ITEMS: WorkItem[] = [
  {
    title: "Image Grid Mosaic",
    date: "May 29, 2026",
    href: "/work/image-grid-mosaic",
  },
  {
    title: "Active Post Observer",
    date: "April 17, 2026",
    href: "/work/active-post-observer",
  },
  {
    title: "Modal Portal Layer",
    date: "April 15, 2026",
    href: "/work/modal-portal-layer",
  },
];

export const PROJECT_ITEMS: WorkItem[] = [
  {
    title: "Laminar",
    date: "April 03, 2026",
    href: "https://github.com/cajaun/laminar",
    external: true,
  },
  {
    title: "Morpheus",
    date: "February 27, 2026",
    href: "https://github.com/cajaun/morpheus",
    external: true,
  },
  {
    title: "Varse",
    date: "August 23, 2025",
    href: "https://varse.app",
    external: true,
  },
  {
    title: "RankedOut",
    date: "August 20, 2023",
    href: "https://rankedout.com",
    external: true,
  },
];
