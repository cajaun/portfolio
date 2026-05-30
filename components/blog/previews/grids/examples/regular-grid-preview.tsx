"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PreviewCard from "@/components/blog/previews/shared/preview-card";
import {
  Chrome,
  FooterRow,
  PreviewFootnote,
  SkeletonBlock,
  SkeletonLine,
  Stage,
  SurfaceButton,
  Toolbar,
  layoutTransition,
  useMobilePreview,
} from "../shared/primitives";


type RegularGridMode = "six" | "nine" | "wide";

export function RegularGridExamplesPreview() {
  const [mode, setMode] = useState<RegularGridMode>("six");
  const isMobile = useMobilePreview();
  const itemCount = mode === "nine" ? 9 : mode === "wide" ? 8 : 6;
  const columns =
    isMobile
      ? mode === "wide"
        ? "repeat(3, minmax(0, 1fr))"
        : "repeat(2, minmax(0, 1fr))"
      : mode === "wide"
        ? "repeat(4, minmax(0, 1fr))"
        : "repeat(3, minmax(0, 1fr))";

  return (
    <PreviewCard
      full
      wideMobile
      footer={
        <FooterRow>
          <SurfaceButton active={mode === "six"} onClick={() => setMode("six")}>
            Six items
          </SurfaceButton>
          <SurfaceButton active={mode === "nine"} onClick={() => setMode("nine")}>
            Nine items
          </SurfaceButton>
          <SurfaceButton active={mode === "wide"} onClick={() => setMode("wide")}>
            Wider grid
          </SurfaceButton>
        </FooterRow>
      }
      footnote={
        <PreviewFootnote>
          Peer items keep the same role. The grid only changes tracks and count.
        </PreviewFootnote>
      }
    >
      <Stage>
        <Chrome>
          <Toolbar />
          <div className="p-3 sm:p-4">
            <motion.div
              layout
              transition={layoutTransition}
              className="grid h-[34rem] content-start gap-2.5 sm:h-[18.5rem] sm:content-center sm:gap-3"
              style={{
                gridTemplateColumns: columns,
                gridAutoRows: isMobile ? "6.25rem" : "5rem",
              }}
            >
              <AnimatePresence initial={false}>
                {Array.from({ length: itemCount }).map((_, index) => (
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={layoutTransition}
                    className="flex min-h-[6.25rem] flex-col gap-2 rounded-xl border border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-stage sm:h-20 sm:min-h-0"
                  >
                    <SkeletonLine className="h-3 w-3/4" />
                    <SkeletonLine className="h-3 w-1/2" />
                    <SkeletonBlock className="mt-auto h-5 w-full" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </Chrome>
      </Stage>
    </PreviewCard>
  );
}
