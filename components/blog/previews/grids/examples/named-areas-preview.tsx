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
  layoutTransition,
  previewCardBase,
  previewCardHighlight,
  useMobilePreview,
} from "../shared/primitives";


type AreaMode = "dashboard" | "article";
type AreaTileId = "header" | "nav" | "main" | "aside" | "footer";

const areaTiles: AreaTileId[] = [
  "header",
  "nav",
  "main",
  "aside",
  "footer",
];

const areaLabels: Record<AreaTileId, string> = {
  header: "Header",
  nav: "Nav",
  main: "Main",
  aside: "Aside",
  footer: "Footer",
};

const areaPositions: Record<AreaMode, Record<AreaTileId, CSSProperties>> = {
  dashboard: {
    header: { gridColumn: "1 / span 4", gridRow: "1" },
    nav: { gridColumn: "1", gridRow: "2 / span 3" },
    main: { gridColumn: "2 / span 2", gridRow: "2 / span 3" },
    aside: { gridColumn: "4", gridRow: "2 / span 3" },
    footer: { gridColumn: "1 / span 4", gridRow: "5" },
  },
  article: {
    header: { gridColumn: "1 / span 4", gridRow: "1" },
    main: { gridColumn: "1 / span 3", gridRow: "2 / span 3" },
    aside: { gridColumn: "4", gridRow: "2 / span 2" },
    nav: { gridColumn: "4", gridRow: "4" },
    footer: { gridColumn: "1 / span 4", gridRow: "5" },
  },
};

const mobileAreaPositions: Record<AreaMode, Record<AreaTileId, CSSProperties>> =
  {
    dashboard: {
      header: { gridColumn: "1 / span 2", gridRow: "1" },
      nav: { gridColumn: "1", gridRow: "2 / span 2" },
      main: { gridColumn: "2", gridRow: "2 / span 2" },
      aside: { gridColumn: "1 / span 2", gridRow: "4" },
      footer: { gridColumn: "1 / span 2", gridRow: "5" },
    },
    article: {
      header: { gridColumn: "1 / span 2", gridRow: "1" },
      main: { gridColumn: "1 / span 2", gridRow: "2 / span 2" },
      aside: { gridColumn: "1", gridRow: "4" },
      nav: { gridColumn: "2", gridRow: "4" },
      footer: { gridColumn: "1 / span 2", gridRow: "5" },
    },
  };

function AreaTile({
  id,
  mode,
  mobile,
}: {
  id: AreaTileId;
  mode: AreaMode;
  mobile: boolean;
}) {
  const main = id === "main";

  return (
    <motion.div
      layout
      transition={layoutTransition}
      className={cn(
        "flex min-h-0 flex-col gap-2 rounded-xl border p-2.5 sm:p-3",
        main ? previewCardHighlight : previewCardBase,
      )}
      style={mobile ? mobileAreaPositions[mode][id] : areaPositions[mode][id]}
    >
      <span
        className={cn(
          "text-[11px] font-semibold uppercase tracking-wide",
          "text-preview-text-muted dark:text-preview-dark-text-muted",
        )}
      >
        {areaLabels[id]}
      </span>
      <div className="mt-auto space-y-1.5">
        <SkeletonLine className="h-2.5" />
        <SkeletonLine className="h-2.5 w-2/3" />
      </div>
    </motion.div>
  );
}

export function NamedAreasPreview() {
  const [mode, setMode] = useState<AreaMode>("dashboard");
  const isMobile = useMobilePreview();

  return (
    <PreviewCard
      full
      wideMobile
      footer={
        <FooterRow>
          <SurfaceButton
            active={mode === "dashboard"}
            onClick={() => setMode("dashboard")}
          >
            Dashboard map
          </SurfaceButton>
          <SurfaceButton
            active={mode === "article"}
            onClick={() => setMode("article")}
          >
            Article map
          </SurfaceButton>
        </FooterRow>
      }
      footnote={
        <PreviewFootnote>
          The role names stay put. The area map changes where those roles land.
        </PreviewFootnote>
      }
    >
      <Stage>
        <Chrome className="max-w-2xl">
          <Toolbar />
          <div className="p-3 sm:p-4">
            <motion.div
              layout
              transition={layoutTransition}
              className="grid h-[31.5rem] grid-cols-2 gap-2.5 sm:h-[26rem] sm:grid-cols-4 sm:gap-3"
              style={{
                gridTemplateRows: isMobile
                  ? "4.5rem 7rem 7rem 5.75rem 4.5rem"
                  : "4.75rem repeat(3, minmax(0, 1fr)) 4.75rem",
              }}
            >
              {areaTiles.map((tile) => (
                <AreaTile
                  key={tile}
                  id={tile}
                  mode={mode}
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
