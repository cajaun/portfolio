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
  layoutTransition,
  previewCardHighlight,
  useMobilePreview,
} from "../shared/primitives";


export function IntrinsicEdgesPreview() {
  const [wide, setWide] = useState(false);
  const isMobile = useMobilePreview();

  return (
    <PreviewCard
      full
      wideMobile
      footer={
        <FooterRow>
          <SurfaceButton active={!wide} onClick={() => setWide(false)}>
            Short content
          </SurfaceButton>
          <SurfaceButton active={wide} onClick={() => setWide(true)}>
            Long content
          </SurfaceButton>
        </FooterRow>
      }
      footnote={
        <PreviewFootnote>
          Edges hug their content. The middle absorbs whatever space is left.
        </PreviewFootnote>
      }
    >
      <Stage>
        <Chrome>
          <Toolbar />
          <div className="p-3 sm:p-4">
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "max-content minmax(0, 1fr) max-content",
              }}
            >
              {/* Left edge — hugs content */}
              <motion.div
                layout
                transition={layoutTransition}
                className="flex min-h-[4.5rem] flex-row items-center gap-2 rounded-xl border border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-muted sm:min-h-0 sm:flex-col sm:items-stretch"
              >
                <SkeletonLine className="h-3 w-16 sm:w-14" />
                <SkeletonLine className="h-3 w-12 sm:w-10" />
                <SkeletonLine className="h-3 w-14 sm:w-12" />
              </motion.div>

              {/* Middle — absorbs remaining width, content varies */}
              <motion.div
                layout
                transition={layoutTransition}
                className={cn(
                  "flex min-h-[8.5rem] flex-col gap-2 rounded-xl border p-3 sm:min-h-0",
                  previewCardHighlight,
                )}
              >
                <SkeletonLine
                  className={cn(
                    "h-3 transition-[width] duration-500 ease-in-out",
                    wide ? "w-full" : "w-1/2 sm:w-1/3",
                  )}
                />
                <SkeletonLine
                  className={cn(
                    "h-3 transition-[width] duration-500 ease-in-out",
                    wide ? "w-4/5" : "w-2/5 sm:w-1/4",
                  )}
                />
                <SkeletonBlock
                  className={cn(
                    "mt-auto h-12 transition-[width] duration-500 ease-in-out sm:mt-2 sm:h-10",
                    wide ? "w-full" : "w-2/3",
                  )}
                />
              </motion.div>

              {/* Right edge — hugs content */}
              <motion.div
                layout
                transition={layoutTransition}
                className="grid min-h-[4.5rem] grid-cols-3 gap-2 rounded-xl border border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-muted sm:flex sm:min-h-0 sm:flex-col"
              >
                <SkeletonBlock className="h-8 w-full sm:h-7 sm:w-16" />
                <SkeletonBlock className="h-8 w-full sm:h-7 sm:w-16" />
                <SkeletonBlock className="h-8 w-full sm:h-7 sm:w-16" />
              </motion.div>
            </div>
          </div>
        </Chrome>
      </Stage>
    </PreviewCard>
  );
}
