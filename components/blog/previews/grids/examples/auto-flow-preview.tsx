"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import PreviewCard from "@/components/blog/previews/shared/preview-card";
import {
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


type FlowDir = "row" | "column";

const autoFlowPositions: Record<FlowDir, Record<number, CSSProperties>> = {
  row: {
    1: { gridColumn: "1", gridRow: "1" },
    2: { gridColumn: "2", gridRow: "1" },
    3: { gridColumn: "3", gridRow: "1" },
    4: { gridColumn: "1", gridRow: "2" },
    5: { gridColumn: "2", gridRow: "2" },
    6: { gridColumn: "3", gridRow: "2" },
  },
  column: {
    1: { gridColumn: "1", gridRow: "1" },
    2: { gridColumn: "1", gridRow: "2" },
    3: { gridColumn: "2", gridRow: "1" },
    4: { gridColumn: "2", gridRow: "2" },
    5: { gridColumn: "3", gridRow: "1" },
    6: { gridColumn: "3", gridRow: "2" },
  },
};

const mobileAutoFlowPositions: Record<FlowDir, Record<number, CSSProperties>> =
  {
    row: {
      1: { gridColumn: "1", gridRow: "1" },
      2: { gridColumn: "2", gridRow: "1" },
      3: { gridColumn: "1", gridRow: "2" },
      4: { gridColumn: "2", gridRow: "2" },
      5: { gridColumn: "1", gridRow: "3" },
      6: { gridColumn: "2", gridRow: "3" },
    },
    column: {
      1: { gridColumn: "1", gridRow: "1" },
      2: { gridColumn: "1", gridRow: "2" },
      3: { gridColumn: "1", gridRow: "3" },
      4: { gridColumn: "2", gridRow: "1" },
      5: { gridColumn: "2", gridRow: "2" },
      6: { gridColumn: "2", gridRow: "3" },
    },
  };

export function AutoFlowPreview() {
  const [flow, setFlow] = useState<FlowDir>("row");
  const isMobile = useMobilePreview();

  return (
    <PreviewCard
      full
      wideMobile
      footer={
        <FooterRow>
          <SurfaceButton active={flow === "row"} onClick={() => setFlow("row")}>
            Row
          </SurfaceButton>
          <SurfaceButton active={flow === "column"} onClick={() => setFlow("column")}>
            Column
          </SurfaceButton>
        </FooterRow>
      }
      footnote={
        <PreviewFootnote>
          The numbers show source order. Flow direction decides where each number lands.
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
                  ? "repeat(3, minmax(6rem, 1fr))"
                  : "repeat(2, minmax(5.5rem, 1fr))",
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <motion.div
                  key={n}
                  layout
                  transition={layoutTransition}
                  className="flex min-h-[6rem] flex-col justify-between rounded-xl border border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-stage sm:min-h-[5.5rem]"
                  style={
                    isMobile
                      ? mobileAutoFlowPositions[flow][n]
                      : autoFlowPositions[flow][n]
                  }
                >
                  <span className="text-[11px] font-bold tabular-nums text-preview-text dark:text-preview-dark-text">
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
