"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  formatVideoTime,
  videoDurationSeconds,
  type MediaPost,
} from "../data/posts";

export function VideoPost({
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
