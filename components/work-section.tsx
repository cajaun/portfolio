"use client";

import { useState } from "react";
import { AnimatedTabs } from "./ui/tabs/tabs";
import type { PostSummary } from "@/data/blog";
import {
  COMPONENT_ITEMS,
  PROJECT_ITEMS,
  WORK_TABS,
  type WorkItem,
  type WorkTabId,
} from "@/data/work";
import WorkItemList from "./work/work-item-list";

type WorkSectionProps = {
  posts: PostSummary[];
};

function getItemsForTab(activeTab: WorkTabId, posts: PostSummary[]): WorkItem[] {
  switch (activeTab) {
    case "articles":
      return posts.map((post) => ({
        title: post.title,
        date: post.publishedAt,
        href: `/blog/${post.slug}`,
      }));
    case "components":
      return COMPONENT_ITEMS;
    case "projects":
      return PROJECT_ITEMS;
    default:
      return [];
  }
}

export default function WorkSection({ posts }: WorkSectionProps) {
  const [activeTab, setActiveTab] = useState<WorkTabId>("articles");
  const items = getItemsForTab(activeTab, posts);

  return (
    <div className="flex flex-col">
      <AnimatedTabs
        tabs={WORK_TABS}
        onChange={(tabId) => setActiveTab(tabId as WorkTabId)}
      />
      <WorkItemList tabId={activeTab} items={items} />
    </div>
  );
}
