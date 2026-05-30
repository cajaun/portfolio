"use client";

import { useEffect, useRef, useState } from "react";
import PreviewCard from "@/components/blog/previews/shared/preview-card";
import {
  buildInitialVideoProgress,
  initialVideoProgress,
  videoPosts,
  videoPreviewDurationMs,
} from "../data/posts";
import { VideoPost } from "../shared/video-post";

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
