"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
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

export function PortalLayerPreview() {
  const [mode, setMode] = useState<"local" | "portal">("portal");

  return (
    <PreviewCard
      full
      footer={
        <div className="flex w-full flex-wrap items-center justify-center gap-2">
          <SurfaceButton
            active={mode === "local"}
            onClick={() => setMode("local")}
          >
            Without portal
          </SurfaceButton>
          <SurfaceButton
            active={mode === "portal"}
            onClick={() => setMode("portal")}
          >
            With portal
          </SurfaceButton>
        </div>
      }
      footnote={
        <div className="mt-4 flex w-full select-none items-center justify-center text-center">
          <p className="text-center text-[13px] text-gray-200 dark:text-preview-dark-paragraph">
            The trigger stays in the page. The dialog moves to a cleaner layer.
          </p>
        </div>
      }
    >
      <Stage>
        <LayoutGroup id="portal-layer-preview">
          <Chrome className="relative max-w-xl">
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
                <div className="relative h-[12rem] overflow-hidden rounded-xl border border-dashed border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-muted">
                  <div className="mb-3 flex h-9 items-center rounded-lg border border-preview-border bg-preview-surface px-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface">
                    <SkeletonLine className="h-3 w-24" />
                  </div>
                  <div className="space-y-2">
                    <SkeletonLine className="h-3 w-36" />
                    <SkeletonLine className="h-3 w-44" />
                    <SkeletonLine className="h-3 w-28" />
                  </div>

                  <AnimatePresence initial={false}>
                    {mode === "local" ? (
                      <motion.div
                        key="local-modal"
                        layout
                        className="absolute inset-x-4 bottom-[-2.75rem]"
                        transition={layoutTransition}
                      >
                        <motion.div
                          layoutId="portal-preview-modal"
                          transition={layoutTransition}
                        >
                          <PreviewModalShell
                            title="Share this file"
                            description="Rendered inside the clipped container."
                            compact
                          />
                        </motion.div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
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

            <AnimatePresence initial={false}>
              {mode === "portal" ? (
                <motion.div
                  key="portal-modal"
                  className="absolute inset-0 flex items-center justify-center bg-black/15 px-4 py-8 dark:bg-black/35"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={fadeTransition}
                >
                  <motion.div
                    layoutId="portal-preview-modal"
                    className="w-full max-w-[22rem]"
                    transition={layoutTransition}
                  >
                    <PreviewModalShell
                      title="Share this file"
                      description="Rendered above the page through a portal."
                    />
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="clip-gradient"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-preview-surface to-transparent dark:from-preview-dark-surface"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={fadeTransition}
                />
              )}
            </AnimatePresence>
          </Chrome>
        </LayoutGroup>
      </Stage>
    </PreviewCard>
  );
}
