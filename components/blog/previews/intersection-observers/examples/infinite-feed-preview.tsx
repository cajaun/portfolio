"use client";

import { useEffect, useRef, useState } from "react";
import PreviewCard from "@/components/blog/previews/shared/preview-card";
import { buildFeedBatch } from "../data/posts";
import { FeedPost } from "../shared/feed-post";

export function InfiniteFeedPreview() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const canLoadMoreRef = useRef(false);
  const isResettingRef = useRef(false);
  const [posts, setPosts] = useState(() => buildFeedBatch(0, 4));
  const [loading, setLoading] = useState(false);
  const [hasLoadedMore, setHasLoadedMore] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const sentinel = sentinelRef.current;

    if (!root || !sentinel) {
      return;
    }

    const handleScroll = () => {
      if (isResettingRef.current) {
        if (root.scrollTop <= 1) {
          isResettingRef.current = false;
        }

        return;
      }

      if (root.scrollTop > 24) {
        canLoadMoreRef.current = true;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (
          !entry?.isIntersecting ||
          !canLoadMoreRef.current ||
          loading ||
          hasLoadedMore
        ) {
          return;
        }

        setLoading(true);

        window.setTimeout(() => {
          setPosts((current) => [...current, ...buildFeedBatch(4, 2)]);
          setHasLoadedMore(true);
          setLoading(false);
        }, 700);
      },
      {
        root,
        threshold: 0.2,
        rootMargin: "0px 0px 20% 0px",
      },
    );

    root.addEventListener("scroll", handleScroll, { passive: true });
    observer.observe(sentinel);

    return () => {
      root.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [hasLoadedMore, loading]);

  return (
    <PreviewCard
      full
      scrollable
      scrollContainerRef={rootRef}
      footer={
        <div className="flex w-full flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              const root = rootRef.current;
              isResettingRef.current = true;
              canLoadMoreRef.current = false;
              setLoading(false);
              setHasLoadedMore(false);
              setPosts(buildFeedBatch(0, 4));

              window.requestAnimationFrame(() => {
                root?.scrollTo({ top: 0, behavior: "smooth" });
              });
            }}
            className="flex h-9 items-center justify-center rounded-lg  bg-preview-surface px-3 text-sm font-medium tracking-[-0.01em] text-preview-text shadow-custom transition-transform duration-200 active:scale-[0.98] dark:border-preview-dark-border dark:bg-preview-dark-surface dark:text-preview-dark-text"
          >
            Reset feed
          </button>
          <button
            type="button"
            onClick={() => {
              const node = rootRef.current;
              if (node) {
                canLoadMoreRef.current = true;
                node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
              }
            }}
            className="flex h-9 items-center justify-center rounded-lg bg-preview-surface px-3 text-sm font-medium tracking-[-0.01em] text-preview-text shadow-custom transition-transform duration-200 active:scale-[0.98] dark:bg-preview-dark-surface dark:text-preview-dark-text"
          >
            Trigger load
          </button>
        </div>
      }
      footnote={
        <div className="mt-4 flex w-full  select-none items-center justify-center text-center">
          <p className="text-center text-[13px] text-preview-text-muted dark:text-preview-dark-text-muted">
            Scroll down to see posts enter the viewport
          </p>
        </div>
      }
    >
      <div className="w-full bg-preview-surface px-4 sm:px-12 py-4 dark:bg-preview-dark-stage">
        <div className="w-full space-y-6">
          {posts.map((post, index) => (
            <FeedPost
              key={post.id}
              gridSize={([2, 3, 4] as const)[index % 3]}
            />
          ))}

          <div ref={sentinelRef} className="flex justify-center px-4 sm:px-0">
            <div className="flex min-h-7 max-w-full select-none items-center justify-center rounded-md bg-preview-surface-muted px-3 py-1 text-center text-sm font-medium text-preview-text-muted shadow-custom dark:border-preview-dark-border dark:bg-preview-dark-surface dark:text-preview-dark-text-muted sm:whitespace-nowrap">
              {loading
                ? "Loading next posts..."
                : hasLoadedMore
                  ? "Text sentinel reached. One extra batch loaded."
                  : "The text sentinel waits near the bottom."}
            </div>
          </div>
        </div>
      </div>
    </PreviewCard>
  );
}
