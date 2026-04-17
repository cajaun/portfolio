"use client";

import { useEffect, useRef, useState } from "react";
import PreviewCard from "@/components/ui/previews";
import TwitterImageGridPreview from "@/components/ui/twitter-image-grid-preview";
import { AnimatedTabs } from "@/components/ui/tabs/tabs";
import { cn } from "@/lib/utils";

const feedSeed = [
  {
    author: "Maya Chen",
    handle: "@mayadesigns",
    body: "Testing a softer loading state so new posts feel like part of the feed.",
  },
  {
    author: "Noah Price",
    handle: "@noahmotion",
    body: "Intersection observer handles the load boundary without scroll math.",
  },
  {
    author: "Elena Park",
    handle: "@elenaui",
    body: "The same pattern works for feeds, comments, and notifications.",
  },
  {
    author: "Ravi Singh",
    handle: "@ravibuilds",
    body: "When the boundary enters the root, fetch the next batch.",
  },
  {
    author: "Talia Brooks",
    handle: "@taliatype",
    body: "This API removes a lot of homemade visibility code.",
  },
  {
    author: "Jordan Lee",
    handle: "@jordanfeed",
    body: "Observers also help with impressions, autoplay rules, and read progress.",
  },
];

const mediaPosts = [
  {
    id: "studio-tour",
    author: "Design Camera",
    handle: "@design",
    body: "The active post switches once most of the card is inside the feed window.",
    gridSize: 2,
  },
  {
    id: "prototype-loop",
    author: "Motion Notes",
    handle: "@motion",
    body: "This is the same pattern behind autoplay and pause rules in media feeds.",
    gridSize: 3,
  },
  {
    id: "ui-breakdown",
    author: "Product Clips",
    handle: "@product",
    body: "Only one post needs to feel primary at a time, so the observer picks a winner.",
    gridSize: 4,
  },
];

function buildFeedBatch(start: number, count: number) {
  return Array.from({ length: count }, (_, index) => {
    const seed = feedSeed[(start + index) % feedSeed.length];
    return {
      id: `${start + index}`,
      ...seed,
    };
  });
}

function PreviewHeader({ title, badge }: { title: string; badge: string }) {
  return (
    <div className="flex w-full items-center justify-center gap-2 text-center">
      <p className="min-w-0 truncate text-sm font-medium tracking-[-0.01em] text-black dark:text-white">
        {title}
      </p>
      <span className="text-sm text-gray-200 dark:text-gray-100">/</span>
      <p className="min-w-0 truncate text-sm font-medium tracking-[-0.01em] text-gray-200 dark:text-gray-100">
        {badge}
      </p>
    </div>
  );
}

function ActivePostHeader({
  activePost,
  onChange,
}: {
  activePost: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="w-full sm:w-auto sm:max-w-max">
        <AnimatedTabs
          tabs={mediaPosts.map((post) => ({
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

function FeedPost({
  author,
  handle,
  body,
  gridSize,
  active = false,
}: {
  author: string;
  handle: string;
  body: string;
  gridSize: number;
  active?: boolean;
}) {
  return (
    <article
      className={cn(
        "rounded-[1.1rem] border p-3 transition-colors",
        active
          ? "border-[#EBEBEB] bg-white shadow-custom dark:border-[#2C2C2B] dark:bg-[lab(3.04863%_0_0)]"
          : "border-[#EBEBEB] bg-white dark:border-[#2C2C2B] dark:bg-[lab(3.04863%_0_0)]",
      )}
    >
      <div className="flex  gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#EBEBEB] bg-[#FCFCFC] text-[12px] font-medium tracking-[-0.01em] text-black dark:border-[#2C2C2B] dark:bg-[lab(8.708%_0_0)] dark:text-white mt-2">
          {author
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-1 ">
            <p className="truncate text-sm font-medium text-black dark:text-white">
              {author}
            </p>
            <p className="truncate text-sm text-gray-200 dark:text-gray-100">
              {handle}
            </p>
            <p className="text-sm  text-gray-200 dark:text-gray-100">· 1h</p>
          </div>
          <p className="text-sm  text-black dark:text-white">
            {body}
          </p>
          <div className="hidden sm:block">
            <PostGrid gridSize={gridSize} />
          </div>
          
        </div>
      </div>
    </article>
  );
}

function PostGrid({
  gridSize,
  className,
}: {
  gridSize: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[0.9rem] bg-[lab(94.78%_0_0)] p-[3px]  dark:bg-[lab(17.06%_0_0)]",
        className,
      )}
    >
      <TwitterImageGridPreview totalImages={gridSize} showLabels={false} />
    </div>
  );
}

export function InfiniteFeedPreview() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [posts, setPosts] = useState(() => buildFeedBatch(0, 4));
  const [loading, setLoading] = useState(false);
  const [hasLoadedMore, setHasLoadedMore] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const sentinel = sentinelRef.current;

    if (!root || !sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry?.isIntersecting || loading || hasLoadedMore) {
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

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasLoadedMore, loading]);

  return (
    <PreviewCard
      full
      scrollable
      scrollContainerRef={rootRef}
      header={
        <PreviewHeader title="Infinite feed" badge={`${posts.length} posts`} />
      }
      footer={
        <div className="flex w-full flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              setLoading(false);
              setHasLoadedMore(false);
              setPosts(buildFeedBatch(0, 4));
              rootRef.current?.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex h-9 items-center justify-center rounded-lg border border-[#EBEBEB] bg-white px-3 text-sm font-medium tracking-[-0.01em] text-black shadow-custom transition-transform duration-200 active:scale-[0.98] dark:border-[#2C2C2B] dark:bg-[lab(3.04863%_0_0)] dark:text-white"
          >
            Reset feed
          </button>
          <button
            type="button"
            onClick={() => {
              const node = rootRef.current;
              if (node) {
                node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
              }
            }}
            className="flex h-9 items-center justify-center rounded-lg bg-[lab(12.304%_-0.00000745058_0)] px-3 text-sm font-medium tracking-[-0.01em] text-white transition-transform duration-200 active:scale-[0.98] dark:bg-white dark:text-black"
          >
            Trigger load
          </button>
        </div>
      }
      footnote={
        <div className="mt-4 flex w-full  select-none items-center justify-center text-center">
          <p className="text-center text-[13px] text-gray-200 dark:text-gray-100">
            Scroll down to see posts enter the viewport
          </p>
        </div>
      }
    >
      <div className="w-full bg-[lab(94.78%_0_0)] px-4 sm:px-12 py-4 dark:bg-[lab(17.06%_0_0)]">
        <div className="w-full space-y-3">
          {posts.map((post, index) => (
            <FeedPost
              key={post.id}
              author={post.author}
              handle={post.handle}
              body={post.body}
              gridSize={([2, 3, 4] as const)[index % 3]}
            />
          ))}

          <div ref={sentinelRef} className="flex justify-center">
            <div className="flex h-7 select-none items-center justify-center whitespace-nowrap rounded-md bg-[var(--color-preview-bg,#ffffff)] px-2  text-sm font-medium shadow-custom dark:bg-[lab(3.04863%_0_0)]">
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

export function ActivePostPreview() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const postRefs = useRef<(HTMLElement | null)[]>([]);
  const [activePost, setActivePost] = useState(mediaPosts[0].id);

  const scrollToPost = (postId: string) => {
    const postIndex = mediaPosts.findIndex((post) => post.id === postId);
    const nextNode = postRefs.current[postIndex];

    if (nextNode && rootRef.current) {
      const rootRect = rootRef.current.getBoundingClientRect();
      const nodeRect = nextNode.getBoundingClientRect();
      const nextTop =
        rootRef.current.scrollTop + (nodeRect.top - rootRect.top) - 12;

      rootRef.current.scrollTo({
        top: Math.max(nextTop, 0),
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const nextActive = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (nextActive) {
          setActivePost((nextActive.target as HTMLElement).dataset.postId!);
        }
      },
      {
        root,
        threshold: [0.4, 0.7, 0.9],
        rootMargin: "0px 0px -15% 0px",
      },
    );

    postRefs.current.forEach((node) => {
      if (node) {
        observer.observe(node);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <PreviewCard
      full
      scrollable
      scrollContainerRef={rootRef}
      headerClassName="px-0"
      header={
        <ActivePostHeader
          activePost={activePost}
          onChange={(postId) => scrollToPost(postId)}
        />
      }
      footer={
        <div className="flex w-full flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() =>
              rootRef.current?.scrollTo({ top: 0, behavior: "smooth" })
            }
            className="flex h-9 items-center justify-center rounded-lg border border-[#EBEBEB] bg-white px-3 text-sm font-medium tracking-[-0.01em] text-black shadow-custom transition-transform duration-200 active:scale-[0.98] dark:border-[#2C2C2B] dark:bg-[lab(3.04863%_0_0)] dark:text-white"
          >
            Restart feed
          </button>
          <button
            type="button"
            onClick={() => {
              const currentIndex = mediaPosts.findIndex(
                (post) => post.id === activePost,
              );
              const nextIndex = Math.min(
                currentIndex + 1,
                mediaPosts.length - 1,
              );
              scrollToPost(mediaPosts[nextIndex].id);
            }}
            className="flex h-9 items-center justify-center rounded-lg bg-[lab(12.304%_-0.00000745058_0)] px-3 text-sm font-medium tracking-[-0.01em] text-white transition-transform duration-200 active:scale-[0.98] dark:bg-white dark:text-black"
          >
            Next active post
          </button>
        </div>
      }
      footnote={
        <div className="mt-4 flex w-full select-none items-center justify-center text-center">
          <p className="text-center text-[13px] text-gray-200 dark:text-gray-100">
            Scroll down to watch the active post update
          </p>
        </div>
      }
    >
      <div className="w-full bg-[lab(94.78%_0_0)] px-4 py-4 sm:px-12 dark:bg-[lab(17.06%_0_0)]">
        <div className="w-full">
          <div className="space-y-3">
            {mediaPosts.map((post, index) => {
              const isActive = activePost === post.id;

              return (
                <div
                  key={post.id}
                  ref={(node) => {
                    postRefs.current[index] = node;
                  }}
                  data-post-id={post.id}
                >
                  <FeedPost
                    author={post.author}
                    handle={post.handle}
                    body={post.body}
                    gridSize={post.gridSize}
                    active={isActive}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PreviewCard>
  );
}
