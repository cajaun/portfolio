"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PreviewCard from "@/components/blog/previews/shared/preview-card";
import {
  AnimatedCardSkeleton,
  Chrome,
  FooterRow,
  PreviewFootnote,
  SkeletonLine,
  Stage,
  SurfaceButton,
  Toolbar,
  layoutTransition,
  useMobilePreview,
} from "../shared/primitives";


type FloorMode = "none" | "floor";

export function FloorPreview() {
  const [mode, setMode] = useState<FloorMode>("floor");
  const isMobile = useMobilePreview();
  const columns =
    mode === "floor"
      ? "repeat(auto-fit, minmax(8rem, 1fr))"
      : "repeat(3, minmax(0, 1fr))";

  return (
    <PreviewCard
      full
      wideMobile
      footer={
        <FooterRow>
          <SurfaceButton active={mode === "none"} onClick={() => setMode("none")}>
            No floor
          </SurfaceButton>
          <SurfaceButton active={mode === "floor"} onClick={() => setMode("floor")}>
            With floor
          </SurfaceButton>
        </FooterRow>
      }
      footnote={
        <PreviewFootnote>
          The container stays fixed. The floor decides whether cards shrink or wrap.
        </PreviewFootnote>
      }
    >
      <Stage>
        <Chrome>
          <Toolbar />
          <div className="p-3 sm:p-4">
            <div className="mx-auto w-full max-w-[24rem] rounded-2xl border border-dashed border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-stage">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-preview-text-muted dark:text-preview-dark-text-muted">
                  Fixed container
                </p>
                <SkeletonLine className="h-2.5 w-20" />
              </div>
              <motion.div
                layout
                transition={layoutTransition}
                className="grid h-[26rem] content-start gap-2.5 sm:h-[19rem] sm:gap-3"
                style={{
                  gridTemplateColumns: columns,
                  gridAutoRows: isMobile ? "6.25rem" : "5.5rem",
                }}
              >
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <AnimatedCardSkeleton
                    key={i}
                    className="min-h-[6.25rem] sm:h-[5.5rem] sm:min-h-0"
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </Chrome>
      </Stage>
    </PreviewCard>
  );
}
