"use client";

import { useState } from "react";
import PreviewCard from "@/components/blog/previews/shared/preview-card";
import { cn } from "@/lib/utils";
import {
  Chrome,
  PreviewModalShell,
  SkeletonLine,
  Stage,
  SurfaceButton,
} from "../shared/primitives";

export function ModalShiftPreview() {
  const [stableLock, setStableLock] = useState(true);

  return (
    <PreviewCard
      full
      footer={
        <div className="flex w-full flex-wrap items-center justify-center gap-2">
          <SurfaceButton
            active={!stableLock}
            onClick={() => setStableLock(false)}
          >
            Naive lock
          </SurfaceButton>
          <SurfaceButton active={stableLock} onClick={() => setStableLock(true)}>
            Stable lock
          </SurfaceButton>
        </div>
      }
      footnote={
        <div className="mt-4 flex w-full select-none items-center justify-center text-center">
          <p className="text-center text-[13px] text-gray-200 dark:text-preview-dark-paragraph">
            Reserve the scrollbar gap so the page does not shift when scroll locks.
          </p>
        </div>
      }
    >
      <Stage>
        <Chrome className="relative max-w-xl">
          <div className="flex h-12 items-center justify-between border-b border-preview-border bg-preview-surface-muted px-4 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-muted">
            <SkeletonLine className="h-4 w-28" />
            <div className="h-8 w-20 rounded-full border border-preview-border bg-preview-surface-active dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-active" />
          </div>
          <div className="overflow-hidden">
            <div
              className={cn(
                "grid gap-4 p-4 transition-transform duration-300 md:grid-cols-[minmax(0,1fr)_15rem]",
                stableLock ? "translate-x-0" : "-translate-x-3",
              )}
            >
              <div className="space-y-3">
                <div className="rounded-xl border border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-muted">
                  <SkeletonLine className="h-4 w-40" />
                  <SkeletonLine className="mt-2 h-3 w-44" />
                </div>
                <div className="relative h-[12rem] overflow-hidden rounded-xl border border-dashed border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-muted">
                  <div className="mb-3 flex h-9 items-center rounded-lg border border-preview-border bg-preview-surface px-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface">
                    <SkeletonLine className="h-3 w-24" />
                  </div>
                  <div className="space-y-2">
                    <SkeletonLine className="h-3 w-36" />
                    <SkeletonLine className="h-3 w-44" />
                    <SkeletonLine className="h-3 w-28" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-muted">
                <SkeletonLine className="h-4 w-24" />
                <SkeletonLine className="mt-2 h-3 w-32" />
                <div className="mt-4 space-y-2">
                  <div className="h-10 rounded-lg border border-preview-border bg-preview-surface dark:border-preview-dark-border-strong dark:bg-preview-dark-surface" />
                  <div className="h-10 rounded-lg border border-preview-border bg-preview-surface dark:border-preview-dark-border-strong dark:bg-preview-dark-surface" />
                </div>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center bg-black/15 px-4 py-8 transition-colors duration-300 dark:bg-black/35",
              stableLock
                ? "backdrop-blur-[1px]"
                : "bg-black/5 dark:bg-black/15",
            )}
          >
            <div className="w-full max-w-[22rem]">
              <PreviewModalShell
                title="Share this file"
                description="Rendered above the page through a portal."
              />
            </div>
          </div>
        </Chrome>
      </Stage>
    </PreviewCard>
  );
}
