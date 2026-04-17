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

export const PROJECT_ITEMS: WorkItem[] = [
  {
    title: "Laminar",
    date: "April 03, 2026",
    href: "/",
    external: true,
  },
  {
    title: "Morpheus",
    date: "February 27, 2026",
    href: "/",
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
