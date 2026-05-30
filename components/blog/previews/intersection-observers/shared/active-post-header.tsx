"use client";

import { AnimatedTabs } from "@/components/ui/tabs/tabs";
import { mediaPosts } from "../data/posts";

export function ActivePostHeader({
  activePost,
  onChange,
}: {
  activePost: string;
  onChange: (id: string) => void;
}) {
  const mainPosts = mediaPosts.filter((post) => !post.filler);
  return (
    <div className="flex w-full items-center justify-center">
      <div className="w-full sm:w-auto sm:max-w-max">
        <AnimatedTabs
          tabs={mainPosts.map((post) => ({
            id: post.id,
            name: post.author,
          }))}
          activeTabId={activePost}
          withBottomMargin={false}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
