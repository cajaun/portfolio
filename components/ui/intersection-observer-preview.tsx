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
    id: "filler-1",
    author: "System",
    handle: "@system",
    body: "Scroll down to reach the next active post in the feed.",
    gridSize: 3,
    filler: true,
  },
  {
    id: "filler-2",
    author: "System",
    handle: "@system",
    body: "Keep scrolling, the next main post is coming up soon.",
    gridSize: 4,
    filler: true,
  },
  {
    id: "prototype-loop",
    author: "Motion Notes",
    handle: "@motion",
    body: "This is the same pattern behind autoplay and pause rules in media feeds.",
    gridSize: 3,
  },
  {
    id: "filler-3",
    author: "System",
    handle: "@system",
    body: "Another scroll boundary before the final active post appears.",
    gridSize: 2,
    filler: true,
  },
  {
    id: "filler-4",
    author: "System",
    handle: "@system",
    body: "Almost there, the last main post is just below.",
    gridSize: 3,
    filler: true,
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
      header={
        <PreviewHeader title="Infinite feed" badge={`${posts.length} posts`} />
      }
      footer={
        <div className="flex w-full flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              isResettingRef.current = true;
              canLoadMoreRef.current = false;
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
                canLoadMoreRef.current = true;
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
  const mainPostIds = useRef(
    new Set(mediaPosts.filter((post) => !post.filler).map((post) => post.id)),
  );

  const scrollToPost = (postId: string) => {
    const postIndex = mediaPosts.findIndex((post) => post.id === postId);
    const nextNode = postRefs.current[postIndex];

    if (nextNode && rootRef.current) {
      const rootRect = rootRef.current.getBoundingClientRect();
      const nodeRect = nextNode.getBoundingClientRect();
      const isMobile = window.innerWidth < 640;
      const nodeTop = rootRef.current.scrollTop + (nodeRect.top - rootRect.top);
      
      // On mobile, center the post in the viewport; on desktop, just add small padding
      const nextTop = isMobile
        ? nodeTop - (rootRect.height / 2) + (nodeRect.height / 2)
        : nodeTop - 12;

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

    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    let frame = 0;

    const updateActivePost = () => {
      const rootRect = root.getBoundingClientRect();
      const mainNodes = postRefs.current.filter(
        (node): node is HTMLElement =>
          Boolean(node?.dataset.postId && mainPostIds.current.has(node.dataset.postId)),
      );

      if (mainNodes.length === 0) {
        return;
      }

      const isAtBottom =
        root.scrollTop + root.clientHeight >= root.scrollHeight - 2;

      if (isAtBottom) {
        setActivePost(mainNodes[mainNodes.length - 1].dataset.postId!);
        return;
      }

      const rootCenter = rootRect.top + rootRect.height / 2;
      const nextActive = mainNodes
        .map((node) => {
          const rect = node.getBoundingClientRect();
          const visibleTop = Math.max(rect.top, rootRect.top);
          const visibleBottom = Math.min(rect.bottom, rootRect.bottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);

          return {
            node,
            visibleHeight,
            centerDistance: Math.abs(rect.top + rect.height / 2 - rootCenter),
          };
        })
        .filter((entry) => entry.visibleHeight > 0)
        .sort((a, b) => {
          if (b.visibleHeight !== a.visibleHeight) {
            return b.visibleHeight - a.visibleHeight;
          }

          return a.centerDistance - b.centerDistance;
        })[0];

      if (nextActive) {
        setActivePost(nextActive.node.dataset.postId!);
      }
    };

    const scheduleActivePostUpdate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateActivePost);
    };

    const observer = new IntersectionObserver(
      () => scheduleActivePostUpdate(),
      {
        root,
        threshold: isMobile ? [0, 0.05, 0.1] : [0.1, 0.25, 0.5, 0.75, 0.9],
        rootMargin: isMobile ? "-5% 0px -40% 0px" : "-10% 0px -20% 0px",
      },
    );

    postRefs.current.forEach((node) => {
      if (node) {
        observer.observe(node);
      }
    });

    root.addEventListener("scroll", scheduleActivePostUpdate, {
      passive: true,
    });
    scheduleActivePostUpdate();

    return () => {
      window.cancelAnimationFrame(frame);
      root.removeEventListener("scroll", scheduleActivePostUpdate);
      observer.disconnect();
    };
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
              const mainPosts = mediaPosts.filter((p) => !p.filler);
              const currentMainIndex = mainPosts.findIndex(
                (post) => post.id === activePost,
              );
              const nextMainIndex = Math.min(
                currentMainIndex + 1,
                mainPosts.length - 1,
              );
              scrollToPost(mainPosts[nextMainIndex].id);
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
