"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ImageCardSkeleton, {
  type ImageCardCount,
} from "@/components/blog/previews/shared/image-card-skeleton";
import PreviewCard from "@/components/blog/previews/shared/preview-card";
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

type MediaPost = {
  id: string;
  author: string;
  handle: string;
  body: string;
  gridSize: ImageCardCount;
  filler?: boolean;
};

const mediaPosts: MediaPost[] = [
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

const videoPosts: MediaPost[] = [
  {
    id: "video-studio-tour",
    author: "Design Camera",
    handle: "@design",
    body: "Only the video with the strongest intersection should play.",
    gridSize: 1,
  },
  {
    id: "video-layout-cuts",
    author: "Layout Cuts",
    handle: "@layout",
    body: "As this card becomes primary, the previous video pauses.",
    gridSize: 1,
  },
  {
    id: "video-motion-notes",
    author: "Motion Notes",
    handle: "@motion",
    body: "A threshold keeps quick edge touches from starting playback.",
    gridSize: 1,
  },
  {
    id: "video-product-clips",
    author: "Product Clips",
    handle: "@product",
    body: "The same observer can pause video when it leaves the feed window.",
    gridSize: 1,
  },
  {
    id: "video-studio-roll",
    author: "Studio Roll",
    handle: "@studio",
    body: "Autoplay is just a visibility rule attached to the media card.",
    gridSize: 1,
  },
  {
    id: "video-final-cut",
    author: "Final Cut",
    handle: "@final",
    body: "When nothing is visible enough, every video stays paused.",
    gridSize: 1,
  },
];

const videoDurationSeconds = 93;
const videoPreviewDurationMs = 45000;
const initialVideoProgress: Record<string, number> = {
  "video-studio-tour": 0,
  "video-layout-cuts": 0.26,
  "video-motion-notes": 0.08,
  "video-product-clips": 0.48,
  "video-studio-roll": 0.18,
  "video-final-cut": 0,
};

function buildInitialVideoProgress() {
  return videoPosts.reduce<Record<string, number>>((progress, post) => {
    progress[post.id] = initialVideoProgress[post.id] ?? 0;
    return progress;
  }, {});
}

function formatVideoTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function buildFeedBatch(start: number, count: number) {
  return Array.from({ length: count }, (_, index) => {
    const seed = feedSeed[(start + index) % feedSeed.length];
    return {
      id: `${start + index}`,
      ...seed,
    };
  });
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
  gridSize,
  title,
  active = false,
}: {
  gridSize: ImageCardCount;
  title?: string;
  active?: boolean;
}) {
  return (
    <article>
      <ImageCardSkeleton
        count={gridSize}
        title={title}
        className={cn(
          "transition-shadow",
          active && "ring-1 ring-preview-border dark:ring-preview-dark-border",
        )}
      />
    </article>
  );
}

function VideoPost({
  post,
  active = false,
  progress,
}: {
  post: MediaPost;
  active?: boolean;
  progress: number;
}) {
  const remainingSeconds = Math.max(
    Math.ceil(videoDurationSeconds * (1 - progress)),
    1,
  );

  return (
    <article
      className={cn(
        "mx-auto w-full max-w-sm overflow-hidden rounded-[1.4rem] bg-preview-surface shadow-custom transition-shadow dark:bg-preview-dark-surface",
        active && "ring-1 ring-preview-border dark:ring-preview-dark-border",
      )}
    >
      <div className="flex h-11 items-center gap-2 border-b border-preview-border bg-preview-surface-muted px-4 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-muted">
        <div className="size-7 rounded-full bg-preview-border dark:bg-preview-dark-surface-active" />
        <p className="truncate text-[13px] font-medium tracking-[-0.01em] text-preview-text dark:text-preview-dark-text">
          {post.author}
        </p>
      </div>
      <div className="flex flex-col gap-2 px-4 pb-2 pt-3">
        <div className="h-2.5 w-full rounded-full bg-preview-border dark:bg-preview-dark-surface-active" />
        <div className="h-2.5 w-4/5 rounded-full bg-preview-border dark:bg-preview-dark-surface-active" />
      </div>
      <div className="px-3 pb-3">
        <div
          className={cn(
            "relative overflow-hidden rounded-xl border transition-colors duration-300",
            active
              ? "border-preview-border bg-preview-surface-active dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-active"
              : "border-dashed border-preview-border bg-preview-surface-muted dark:border-preview-dark-border-strong dark:bg-preview-dark-stage",
          )}
          style={{ height: "clamp(10rem, 54vw, 13rem)" }}
        >
          <div className="absolute inset-x-4 top-4 flex items-center justify-between">
            <div className="h-2.5 w-20 rounded-full bg-preview-border dark:bg-preview-dark-surface-active" />
            {!active ? (
              <div className="rounded-full border border-preview-border bg-preview-surface px-2 py-1 text-[11px] font-medium text-preview-text-muted dark:border-preview-dark-border-strong dark:bg-preview-dark-surface dark:text-preview-dark-text-muted">
                Paused
              </div>
            ) : null}
          </div>
          {!active ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex size-12 items-center justify-center rounded-full border border-preview-border bg-preview-surface transition-colors duration-300 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface">
                <div className="flex items-center gap-1">
                  <span className="h-4 w-1.5 rounded-full bg-preview-text-muted dark:bg-preview-dark-text-muted" />
                  <span className="h-4 w-1.5 rounded-full bg-preview-text-muted dark:bg-preview-dark-text-muted" />
                </div>
              </div>
            </div>
          ) : null}
          <div className="absolute inset-x-4 bottom-4">
            {active ? (
              <div className="mb-1.5 flex justify-start">
                <div className="rounded-md bg-black/60 px-2 py-1 text-[12px] font-medium tabular-nums tracking-[-0.01em] text-white shadow-custom dark:bg-black/55 dark:text-preview-dark-text">
                  {formatVideoTime(remainingSeconds)}
                </div>
              </div>
            ) : null}
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-preview-border dark:bg-preview-dark-surface">
              <motion.div
                className="h-full w-full origin-left rounded-full bg-preview-text-muted opacity-70 dark:bg-preview-dark-text-muted"
                initial={false}
                animate={{ scaleX: progress }}
                transition={{ duration: 0.18, ease: "linear" }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-10 items-center gap-4 border-t border-preview-border px-4 dark:border-preview-dark-border-strong">
        <div className="h-3 w-8 rounded-full bg-preview-border dark:bg-preview-dark-surface-active" />
        <div className="h-3 w-8 rounded-full bg-preview-border dark:bg-preview-dark-surface-active" />
        <div className="ml-auto h-3 w-8 rounded-full bg-preview-border dark:bg-preview-dark-surface-active" />
      </div>
    </article>
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
            className="flex h-9 items-center justify-center rounded-lg  bg-preview-surface px-3 text-sm font-medium tracking-[-0.01em] text-preview-text shadow-custom transition-transform duration-200 active:scale-[0.98] dark:border-preview-dark-border dark:bg-preview-dark-surface dark:text-preview-dark-text"
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
            className="flex h-9 items-center justify-center rounded-lg bg-preview-surface px-3 text-sm font-medium tracking-[-0.01em] text-preview-text shadow-custom transition-transform duration-200 active:scale-[0.98] dark:bg-preview-dark-surface dark:text-preview-dark-text"
          >
            Next active post
          </button>
        </div>
      }
      footnote={
        <div className="mt-4 flex w-full select-none items-center justify-center text-center">
          <p className="text-center text-[13px] text-preview-text-muted dark:text-preview-dark-text-muted">
            Scroll down to watch the active post update
          </p>
        </div>
      }
    >
      <div className="w-full bg-preview-surface px-4 py-4 sm:px-12 dark:bg-preview-dark-stage">
        <div className="w-full">
          <div className="space-y-6">
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
                    gridSize={post.gridSize}
                    title={post.filler ? undefined : post.author}
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

export function VideoPlaybackPreview() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const postRefs = useRef<(HTMLElement | null)[]>([]);
  const ratiosRef = useRef(new Map<string, number>());
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [videoProgress, setVideoProgress] = useState(() =>
    buildInitialVideoProgress(),
  );

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).dataset.videoId;

          if (!id) {
            return;
          }

          ratiosRef.current.set(
            id,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        });

        const nextVideo = [...ratiosRef.current.entries()]
          .filter(([, ratio]) => ratio >= 0.55)
          .sort((a, b) => b[1] - a[1])[0]?.[0];

        setActiveVideoId(nextVideo ?? null);
      },
      {
        root,
        threshold: [0, 0.25, 0.55, 0.75, 0.9],
        rootMargin: "-10% 0px -20% 0px",
      },
    );

    postRefs.current.forEach((node) => {
      if (node) {
        observer.observe(node);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!activeVideoId) {
      return;
    }

    let lastTick = window.performance.now();

    const timer = window.setInterval(() => {
      const now = window.performance.now();
      const delta = now - lastTick;
      lastTick = now;

      setVideoProgress((current) => {
        const currentProgress =
          current[activeVideoId] ?? initialVideoProgress[activeVideoId] ?? 0;
        const nextProgress =
          (currentProgress + delta / videoPreviewDurationMs) % 1;

        return {
          ...current,
          [activeVideoId]: nextProgress,
        };
      });
    }, 250);

    return () => window.clearInterval(timer);
  }, [activeVideoId]);

  const scrollToVideo = (index: number) => {
    const root = rootRef.current;
    const node = postRefs.current[index];

    if (!root || !node) {
      return;
    }

    const rootRect = root.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
    const nextTop = root.scrollTop + nodeRect.top - rootRect.top - 16;

    root.scrollTo({
      top: Math.max(nextTop, 0),
      behavior: "smooth",
    });
  };

  const activeVideoIndex = activeVideoId
    ? videoPosts.findIndex((post) => post.id === activeVideoId)
    : -1;

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
              setActiveVideoId(null);
              ratiosRef.current.clear();
              setVideoProgress(buildInitialVideoProgress());
              rootRef.current?.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex h-9 items-center justify-center rounded-lg bg-preview-surface px-3 text-sm font-medium tracking-[-0.01em] text-preview-text shadow-custom transition-transform duration-200 active:scale-[0.98] dark:bg-preview-dark-surface dark:text-preview-dark-text"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => {
              const targetIndex =
                activeVideoIndex >= 0
                  ? Math.min(activeVideoIndex + 1, videoPosts.length - 1)
                  : 0;

              scrollToVideo(targetIndex);
            }}
            className="flex h-9 items-center justify-center rounded-lg bg-preview-surface px-3 text-sm font-medium tracking-[-0.01em] text-preview-text shadow-custom transition-transform duration-200 active:scale-[0.98] dark:bg-preview-dark-surface dark:text-preview-dark-text"
          >
            Next video
          </button>
        </div>
      }
      footnote={
        <div className="mt-4 flex w-full select-none items-center justify-center text-center">
          <p className="text-center text-[13px] text-preview-text-muted dark:text-preview-dark-text-muted">
            Only the most visible video skeleton plays; the rest pause
          </p>
        </div>
      }
    >
      <div className="w-full bg-preview-surface px-4 py-4 sm:px-12 dark:bg-preview-dark-stage">
        <div className="w-full space-y-6">
          {videoPosts.map((post, index) => {
            const active = activeVideoId === post.id;
            const progress =
              videoProgress[post.id] ?? initialVideoProgress[post.id] ?? 0;

            return (
              <div
                key={post.id}
                ref={(node) => {
                  postRefs.current[index] = node;
                }}
                data-video-id={post.id}
              >
                <VideoPost post={post} active={active} progress={progress} />
              </div>
            );
          })}
          <div className="flex justify-center px-4 sm:px-0">
            <div className="flex min-h-7 max-w-full select-none items-center justify-center rounded-md bg-preview-surface-muted px-3 py-1 text-center text-sm font-medium text-preview-text-muted shadow-custom dark:border-preview-dark-border dark:bg-preview-dark-surface dark:text-preview-dark-text-muted sm:whitespace-nowrap">
              {activeVideoId
                ? "The visible video is playing."
                : "Scroll until a video crosses the play threshold."}
            </div>
          </div>
        </div>
      </div>
    </PreviewCard>
  );
}
