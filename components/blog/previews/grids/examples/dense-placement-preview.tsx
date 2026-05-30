"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import PreviewCard from "@/components/blog/previews/shared/preview-card";
import { cn } from "@/lib/utils";
import {
  Chrome,
  FooterRow,
  PreviewFootnote,
  SkeletonLine,
  Stage,
  SurfaceButton,
  Toolbar,
  fadeTransition,
  layoutTransition,
  previewCardBase,
  previewCardHighlight,
  useMobilePreview,
} from "../shared/primitives";



type DenseMode = "off" | "on";

const densePositions: Record<DenseMode, Record<number, CSSProperties>> = {
  off: {
    1: { gridColumn: "1 / span 2", gridRow: "1" },
    2: { gridColumn: "1 / span 2", gridRow: "2" },
    3: { gridColumn: "3", gridRow: "2" },
    4: { gridColumn: "1", gridRow: "3" },
    5: { gridColumn: "2", gridRow: "3" },
    6: { gridColumn: "3", gridRow: "3" },
  },
  on: {
    1: { gridColumn: "1 / span 2", gridRow: "1" },
    2: { gridColumn: "1 / span 2", gridRow: "2" },
    3: { gridColumn: "3", gridRow: "1" },
    4: { gridColumn: "3", gridRow: "2" },
    5: { gridColumn: "1", gridRow: "3" },
    6: { gridColumn: "2", gridRow: "3" },
  },
};

const mobileDensePositions: Record<DenseMode, Record<number, CSSProperties>> = {
  off: {
    1: { gridColumn: "1 / span 2", gridRow: "1" },
    2: { gridColumn: "1", gridRow: "2" },
    3: { gridColumn: "1 / span 2", gridRow: "3" },
    4: { gridColumn: "1", gridRow: "4" },
    5: { gridColumn: "2", gridRow: "4" },
    6: { gridColumn: "1", gridRow: "5" },
  },
  on: {
    1: { gridColumn: "1 / span 2", gridRow: "1" },
    2: { gridColumn: "1", gridRow: "2" },
    3: { gridColumn: "2", gridRow: "2" },
    4: { gridColumn: "1 / span 2", gridRow: "3" },
    5: { gridColumn: "1", gridRow: "4" },
    6: { gridColumn: "2", gridRow: "4" },
  },
};

export function DensePlacementPreview() {
  const [dense, setDense] = useState<DenseMode>("off");
  const isMobile = useMobilePreview();

  return (
    <PreviewCard
      full
      wideMobile
      footer={
        <FooterRow>
          <SurfaceButton active={dense === "off"} onClick={() => setDense("off")}>
            Normal flow
          </SurfaceButton>
          <SurfaceButton active={dense === "on"} onClick={() => setDense("on")}>
            Dense
          </SurfaceButton>
        </FooterRow>
      }
      footnote={
        <PreviewFootnote>
          Dense backfills the gap left by a spanning item. Source order diverges from visual order.
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
              className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3"
              style={{
                gridTemplateRows: isMobile
                  ? "repeat(5, minmax(5.25rem, 1fr))"
                  : "repeat(3, minmax(5rem, 1fr))",
              }}
            >
              <motion.div
                aria-hidden="true"
                initial={false}
                animate={{
                  opacity: dense === "off" ? 1 : 0,
                  scale: dense === "off" ? 1 : 0.94,
                }}
                transition={fadeTransition}
                className="pointer-events-none z-0 flex min-h-[5.25rem] items-center justify-center rounded-xl border border-dashed border-preview-border dark:border-preview-dark-border-strong sm:min-h-[5rem]"
                style={
                  isMobile
                    ? { gridColumn: "2", gridRow: "2" }
                    : { gridColumn: "3", gridRow: "1" }
                }
              >
                <span className="text-[11px] font-medium text-preview-text-muted dark:text-preview-dark-text-muted">
                  gap
                </span>
              </motion.div>

              {/* Items keep stable keys so layout changes can animate. */}
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <motion.div
                  key={n}
                  layout
                  transition={layoutTransition}
                  className={cn(
                    "z-10 flex min-h-[5.25rem] flex-col justify-between rounded-xl p-3 sm:min-h-[5rem]",
                    "border",
                    n === 1 ? previewCardHighlight : previewCardBase,
                  )}
                  style={
                    isMobile
                      ? mobileDensePositions[dense][n]
                      : densePositions[dense][n]
                  }
                >
                  <span
                    className={cn(
                      "text-[11px] font-bold tabular-nums",
                      "text-preview-text dark:text-preview-dark-text",
                    )}
                  >
                    {n}
                  </span>
                  <div className="space-y-1.5">
                    <SkeletonLine className="h-2.5 w-3/4" />
                    <SkeletonLine className="h-2.5 w-1/2" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Chrome>
      </Stage>
    </PreviewCard>
  );
}
