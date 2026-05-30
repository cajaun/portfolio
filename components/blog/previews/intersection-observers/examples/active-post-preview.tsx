"use client";

import { useEffect, useRef, useState } from "react";
import PreviewCard from "@/components/blog/previews/shared/preview-card";
import { mediaPosts } from "../data/posts";
import { ActivePostHeader } from "../shared/active-post-header";
import { FeedPost } from "../shared/feed-post";

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
      
      // on mobile center the post in the viewport
      //  on desktop just add small padding
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
