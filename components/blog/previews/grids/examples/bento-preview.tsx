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
  Stage,
  SurfaceButton,
  Toolbar,
  fadeTransition,
  layoutTransition,
  previewCardBase,
  previewCardHighlight,
  useMobilePreview,
} from "../shared/primitives";


type BentoStep = "equal" | "span" | "compose";
type BentoTileId = "lead" | "metric" | "chart" | "notes" | "tasks" | "status";

const bentoTiles: BentoTileId[] = [
  "lead",
  "metric",
  "chart",
  "notes",
  "tasks",
  "status",
];

const bentoPositions: Record<BentoStep, Record<BentoTileId, CSSProperties>> = {
  equal: {
    lead: { gridColumn: "1 / span 2", gridRow: "1" },
    metric: { gridColumn: "3 / span 2", gridRow: "1" },
    chart: { gridColumn: "1 / span 2", gridRow: "2" },
    notes: { gridColumn: "3 / span 2", gridRow: "2" },
    tasks: { gridColumn: "1 / span 2", gridRow: "3" },
    status: { gridColumn: "3 / span 2", gridRow: "3" },
  },
  span: {
    lead: { gridColumn: "1 / span 2", gridRow: "1 / span 2" },
    metric: { gridColumn: "3 / span 2", gridRow: "1" },
    chart: { gridColumn: "3 / span 2", gridRow: "2" },
    notes: { gridColumn: "1", gridRow: "3" },
    tasks: { gridColumn: "2", gridRow: "3" },
    status: { gridColumn: "3 / span 2", gridRow: "3" },
  },
  compose: {
    lead: { gridColumn: "1 / span 2", gridRow: "1 / span 3" },
    metric: { gridColumn: "3", gridRow: "1" },
    chart: { gridColumn: "4", gridRow: "1" },
    notes: { gridColumn: "3 / span 2", gridRow: "2" },
    tasks: { gridColumn: "3", gridRow: "3" },
    status: { gridColumn: "4", gridRow: "3" },
  },
};

const mobileBentoPositions: Record<
  BentoStep,
  Record<BentoTileId, CSSProperties>
> = {
  equal: {
    lead: { gridColumn: "1", gridRow: "1" },
    metric: { gridColumn: "2", gridRow: "1" },
    chart: { gridColumn: "1", gridRow: "2" },
    notes: { gridColumn: "2", gridRow: "2" },
    tasks: { gridColumn: "1", gridRow: "3" },
    status: { gridColumn: "2", gridRow: "3" },
  },
  span: {
    lead: { gridColumn: "1 / span 2", gridRow: "1 / span 2" },
    metric: { gridColumn: "1", gridRow: "3" },
    chart: { gridColumn: "2", gridRow: "3" },
    notes: { gridColumn: "1", gridRow: "4" },
    tasks: { gridColumn: "2", gridRow: "4" },
    status: { gridColumn: "1 / span 2", gridRow: "5" },
  },
  compose: {
    lead: { gridColumn: "1 / span 2", gridRow: "1 / span 2" },
    metric: { gridColumn: "1", gridRow: "3" },
    chart: { gridColumn: "2", gridRow: "3" },
    notes: { gridColumn: "1 / span 2", gridRow: "4" },
    tasks: { gridColumn: "1", gridRow: "5" },
    status: { gridColumn: "2", gridRow: "5" },
  },
};

function BentoTile({
  id,
  step,
  mobile,
}: {
  id: BentoTileId;
  step: BentoStep;
  mobile: boolean;
}) {
  const isLead = id === "lead";
  const composed = step === "compose";
  const highlighted = isLead && step !== "equal";

  return (
    <motion.div
      layout
      transition={layoutTransition}
      className={cn(
        "relative overflow-hidden rounded-xl border p-2.5 sm:p-3",
        "flex flex-col gap-2",
        highlighted ? previewCardHighlight : previewCardBase,
      )}
      style={mobile ? mobileBentoPositions[step][id] : bentoPositions[step][id]}
    >
      <motion.div
        layout
        transition={layoutTransition}
        className={cn(
          "rounded-full",
          "bg-preview-border dark:bg-preview-dark-surface-active",
          isLead ? "h-3 w-3/5" : "h-2.5 w-2/3",
        )}
      />
      <motion.div
        layout
        transition={layoutTransition}
        className={cn(
          "rounded-full",
          "bg-preview-border dark:bg-preview-dark-surface-active",
          isLead ? "h-3 w-2/5" : "h-2.5 w-1/2",
        )}
      />

      {isLead ? (
        <motion.div
          layout
          transition={layoutTransition}
          className="mt-auto grid grid-cols-4 items-end gap-1.5"
        >
          {[42, 64, 52, 76].map((height) => (
            <motion.div
              key={height}
              initial={false}
              animate={{
                height: step === "equal" ? "1.25rem" : `${height / 16}rem`,
                opacity: step === "equal" ? 0.32 : 1,
              }}
              transition={layoutTransition}
              className={cn(
                "rounded-md",
                "bg-preview-border dark:bg-preview-dark-surface-active",
              )}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={false}
          animate={{
            opacity: composed ? 1 : 0.45,
            scale: composed ? 1 : 0.96,
          }}
          transition={fadeTransition}
          className={cn(
            "mt-auto flex items-center gap-1.5",
            composed ? "opacity-100" : "opacity-50",
          )}
        >
          <div className="h-5 flex-1 rounded-md bg-preview-border dark:bg-preview-dark-surface-active" />
          <div className="h-5 w-7 rounded-md bg-preview-border dark:bg-preview-dark-surface-active" />
        </motion.div>
      )}
    </motion.div>
  );
}

export function BentoExamplesPreview() {
  const [step, setStep] = useState<BentoStep>("equal");
  const isMobile = useMobilePreview();

  return (
    <PreviewCard
      full
      wideMobile
      footer={
        <FooterRow>
          <SurfaceButton active={step === "equal"} onClick={() => setStep("equal")}>
            Equal grid
          </SurfaceButton>
          <SurfaceButton active={step === "span"} onClick={() => setStep("span")}>
            Lead spans
          </SurfaceButton>
          <SurfaceButton active={step === "compose"} onClick={() => setStep("compose")}>
            Compose
          </SurfaceButton>
        </FooterRow>
      }
      footnote={
        <PreviewFootnote>
          Bento is a plain grid where one tile has earned more space.
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
              className="grid h-[31rem] grid-cols-2 gap-2.5 sm:h-[16rem] sm:grid-cols-4 sm:gap-3"
              style={{
                gridTemplateRows: isMobile
                  ? "repeat(5, minmax(5.5rem, 1fr))"
                  : "repeat(3, minmax(0, 1fr))",
              }}
            >
              {bentoTiles.map((tile) => (
                <BentoTile
                  key={tile}
                  id={tile}
                  step={step}
                  mobile={isMobile}
                />
              ))}
            </motion.div>
          </div>
        </Chrome>
      </Stage>
    </PreviewCard>
  );
}
