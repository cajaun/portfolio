"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PreviewCard from "@/components/blog/previews/shared/preview-card";
import { cn } from "@/lib/utils";
import {
  Chrome,
  FooterRow,
  PreviewFootnote,
  SkeletonBlock,
  SkeletonLine,
  Stage,
  SurfaceButton,
  Toolbar,
  fadeTransition,
  layoutTransition,
  previewCardBase,
  previewCardHighlight,
} from "../shared/primitives";


type MediaLoadMode = "pending" | "loaded";

const mediaBlockHeight: Record<MediaLoadMode, string> = {
  pending: "2.75rem",
  loaded: "8rem",
};

export function AspectRatioPreview() {
  const [mode, setMode] = useState<MediaLoadMode>("pending");
  const loaded = mode === "loaded";

  return (
    <PreviewCard
      full
      wideMobile
      footer={
        <FooterRow>
          <SurfaceButton
            active={mode === "pending"}
            onClick={() => setMode("pending")}
          >
            Before load
          </SurfaceButton>
          <SurfaceButton
            active={mode === "loaded"}
            onClick={() => setMode("loaded")}
          >
            Images loaded
          </SurfaceButton>
        </FooterRow>
      }
      footnote={
        <PreviewFootnote>
          The reserved card keeps its height. The unreserved card pushes content down after load.
        </PreviewFootnote>
      }
    >
      <Stage>
        <Chrome className="max-w-2xl">
          <Toolbar />
          <div className="p-3 sm:p-4">
            <div className="grid h-[43rem] grid-cols-1 gap-3 sm:h-[22rem] sm:grid-cols-2">
              <div
                className={cn(
                  "flex h-[21.125rem] flex-col rounded-xl border p-3 sm:h-auto sm:min-h-0",
                  previewCardBase,
                )}
              >
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-preview-text-muted dark:text-preview-dark-text-muted">
                  No ratio
                </p>
                <motion.div
                  layout
                  transition={layoutTransition}
                  className="rounded-lg bg-preview-border dark:bg-preview-dark-surface-active"
                  style={{ height: mediaBlockHeight[mode] }}
                />
                <div className="mt-4 space-y-2.5">
                  <SkeletonLine className="h-2.5 w-4/5" />
                  <SkeletonLine className="h-2.5 w-3/5" />
                  <SkeletonLine className="h-2.5 w-2/3" />
                </div>
                <SkeletonBlock className="mt-auto h-12" />
              </div>

              <div
                className={cn(
                  "flex h-[21.125rem] flex-col rounded-xl border p-3 sm:h-auto sm:min-h-0",
                  previewCardHighlight,
                )}
              >
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-preview-text-muted dark:text-preview-dark-text-muted">
                  Reserved
                </p>
                <div className="grid h-28 grid-cols-2 gap-2 rounded-lg bg-preview-surface p-2 dark:bg-preview-dark-surface">
                  {[0, 1].map((item) => (
                    <motion.div
                      key={item}
                      initial={false}
                      animate={{
                        opacity: loaded ? 1 : 0.45,
                        scale: loaded ? 1 : 0.96,
                      }}
                      transition={fadeTransition}
                      className="rounded-md bg-preview-border dark:bg-preview-dark-surface-active"
                    />
                  ))}
                </div>
                <div className="mt-4 space-y-2.5">
                  <SkeletonLine className="h-2.5 w-4/5" />
                  <SkeletonLine className="h-2.5 w-3/5" />
                  <SkeletonLine className="h-2.5 w-2/3" />
                </div>
                <SkeletonBlock className="mt-auto h-12" />
              </div>
            </div>
          </div>
        </Chrome>
      </Stage>
    </PreviewCard>
  );
}
