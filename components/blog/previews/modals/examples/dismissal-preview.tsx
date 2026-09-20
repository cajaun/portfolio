"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import PreviewCard from "@/components/blog/previews/shared/preview-card";
import {
  Chrome,
  PreviewModalShell,
  SkeletonLine,
  Stage,
  SurfaceButton,
  fadeTransition,
  layoutTransition,
} from "../shared/primitives";

export function ModalDismissalPreview() {
  const [open, setOpen] = useState(true);

  return (
    <PreviewCard
      full
      footer={
        <div className="flex w-full items-center justify-center">
          <SurfaceButton active={!open} onClick={() => setOpen(true)}>
            Open dialog
          </SurfaceButton>
        </div>
      }
      footnote={
        <div className="mt-4 flex w-full select-none items-center justify-center text-center">
          <p className="text-center text-[13px] text-gray-200 dark:text-preview-dark-paragraph">
            The backdrop closes the dialog. The surface keeps the click inside
          </p>
        </div>
      }
    >
      <Stage>
        <Chrome className="relative">
          <div className="flex h-12 items-center justify-between border-b border-preview-border bg-preview-surface-muted px-4 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-muted">
            <SkeletonLine className="h-4 w-28" />
            <div className="h-8 w-20 rounded-full border border-preview-border bg-preview-surface-active dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-active" />
          </div>
          <div className="grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_15rem]">
            <div className="space-y-3">
              <div className="rounded-xl border border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-muted">
                <SkeletonLine className="h-4 w-40" />
                <SkeletonLine className="mt-2 h-3 w-44" />
              </div>
              <div className="h-[12rem] rounded-xl border border-dashed border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-muted">
                <SkeletonLine className="h-3 w-36" />
                <SkeletonLine className="mt-2 h-3 w-44" />
                <SkeletonLine className="mt-2 h-3 w-28" />
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

          <AnimatePresence initial={false} mode="wait">
            {open ? (
              <motion.div
                key="dismissal-backdrop"
                className="absolute inset-0 flex items-center justify-center bg-black/15 px-4 py-8 dark:bg-black/55"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={fadeTransition}
                onClick={() => setOpen(false)}
              >
                <motion.div
                  className="w-full max-w-[22rem]"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Dismissal preview dialog"
                  initial={{ scale: 0.96, y: 8 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.96, y: 8 }}
                  transition={layoutTransition}
                  onClick={(event) => event.stopPropagation()}
                >
                  <PreviewModalShell
                    title="Share this file"
                    description="Click outside the surface to dismiss it."
                  />
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </Chrome>
      </Stage>
    </PreviewCard>
  );
}
