"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { CSSProperties } from "react";
import PreviewCard from "@/components/blog/previews/shared/preview-card";
import {
  AnimatedCardSkeleton,
  Chrome,
  FooterRow,
  PreviewFootnote,
  Stage,
  SurfaceButton,
  Toolbar,
  layoutTransition,
  useMobilePreview,
} from "../shared/primitives";

type Pattern = "regular" | "bento" | "mosaic" | "masonry";

const patterns: { id: Pattern; label: string }[] = [
  { id: "regular", label: "Regular" },
  { id: "bento", label: "Bento" },
  { id: "mosaic", label: "Mosaic" },
  { id: "masonry", label: "Masonry" },
];

const cards = ["card-1", "card-2", "card-3", "card-4", "card-5", "card-6"];

type CardPositions = Record<number, CSSProperties>;

const cardPositions: Record<
  Pattern,
  { mobile: CardPositions; desktop: CardPositions }
> = {
  regular: {
    mobile: {},
    desktop: {},
  },
  bento: {
    mobile: {
      0: { gridColumn: "1 / span 2", gridRow: "1 / span 2" },
      1: { gridColumn: "1", gridRow: "3" },
      2: { gridColumn: "2", gridRow: "3" },
      3: { gridColumn: "1", gridRow: "4" },
      4: { gridColumn: "2", gridRow: "4" },
      5: { gridColumn: "1 / span 2", gridRow: "5" },
    },
    desktop: {
      0: { gridColumn: "1 / span 2", gridRow: "1 / span 2" },
      1: { gridColumn: "3 / span 2", gridRow: "1" },
      2: { gridColumn: "3 / span 2", gridRow: "2" },
      3: { gridColumn: "1", gridRow: "3" },
      4: { gridColumn: "2", gridRow: "3" },
      5: { gridColumn: "3 / span 2", gridRow: "3" },
    },
  },
  mosaic: {
    mobile: {
      0: { gridColumn: "1 / span 2", gridRow: "1" },
      1: { gridColumn: "1", gridRow: "2" },
      2: { gridColumn: "2", gridRow: "2" },
      3: { gridColumn: "1", gridRow: "3" },
      4: { gridColumn: "2", gridRow: "3" },
      5: { gridColumn: "1 / span 2", gridRow: "4" },
    },
    desktop: {
      0: { gridColumn: "1 / span 2", gridRow: "1" },
      1: { gridColumn: "3", gridRow: "1" },
      2: { gridColumn: "1", gridRow: "2" },
      3: { gridColumn: "2", gridRow: "2" },
      4: { gridColumn: "3", gridRow: "2" },
      5: { gridColumn: "1 / span 3", gridRow: "3" },
    },
  },
  masonry: {
    mobile: {
      0: { gridColumn: "1", gridRow: "1 / span 4" },
      1: { gridColumn: "2", gridRow: "1 / span 3" },
      2: { gridColumn: "1", gridRow: "5 / span 3" },
      3: { gridColumn: "2", gridRow: "4 / span 4" },
      4: { gridColumn: "1", gridRow: "8 / span 4" },
      5: { gridColumn: "2", gridRow: "8 / span 3" },
    },
    desktop: {
      0: { gridColumn: "1", gridRow: "1 / span 4" },
      1: { gridColumn: "2", gridRow: "1 / span 3" },
      2: { gridColumn: "3", gridRow: "1 / span 5" },
      3: { gridColumn: "1", gridRow: "5 / span 3" },
      4: { gridColumn: "2", gridRow: "4 / span 4" },
      5: { gridColumn: "3", gridRow: "6 / span 3" },
    },
  },
};

function getGridStyle(pattern: Pattern, mobile: boolean): CSSProperties {
  const columns = mobile ? "repeat(2, minmax(0, 1fr))" : "repeat(3, minmax(0, 1fr))";

  if (pattern === "bento") {
    return {
      gridTemplateColumns: mobile
        ? "repeat(2, minmax(0, 1fr))"
        : "repeat(4, minmax(0, 1fr))",
      gridTemplateRows: mobile
        ? "repeat(5, minmax(5.5rem, 1fr))"
        : "repeat(3, minmax(0, 1fr))",
    };
  }

  if (pattern === "masonry") {
    return {
      gridTemplateColumns: columns,
      gridAutoRows: mobile ? "1.25rem" : "1rem",
    };
  }

  return {
    gridTemplateColumns: columns,
    gridAutoRows: mobile ? "5.75rem" : "5rem",
  };
}

function getCardStyle(
  pattern: Pattern,
  index: number,
  mobile: boolean,
): CSSProperties {
  return cardPositions[pattern][mobile ? "mobile" : "desktop"][index] ?? {};
}

export function GridPatternOverviewPreview() {
  const [pattern, setPattern] = useState<Pattern>("regular");
  const isMobile = useMobilePreview();

  return (
    <PreviewCard
      full
      wideMobile
      footer={
        <FooterRow>
          {patterns.map((option) => (
            <SurfaceButton
              key={option.id}
              active={pattern === option.id}
              onClick={() => setPattern(option.id)}
            >
              {option.label}
            </SurfaceButton>
          ))}
        </FooterRow>
      }
      footnote={
        <PreviewFootnote>
          The cards stay the same. Only the placement rule changes
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
              className="grid h-[31rem] content-center grid-cols-2 gap-2.5 sm:h-[20rem] sm:grid-cols-3 sm:gap-3"
              style={getGridStyle(pattern, isMobile)}
            >
              {cards.map((card, index) => (
                <AnimatedCardSkeleton
                  key={card}
                  className={
                    pattern === "masonry" || pattern === "bento"
                      ? "min-h-0"
                      : "min-h-[6rem] sm:min-h-0"
                  }
                  style={getCardStyle(pattern, index, isMobile)}
                />
              ))}
            </motion.div>
          </div>
        </Chrome>
      </Stage>
    </PreviewCard>
  );
}
