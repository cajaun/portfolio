"use client";

import { useState } from "react";
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
  useMobilePreview,
} from "../shared/primitives";


type GapMode = "none" | "tight" | "loose";

export function GapPreview() {
  const [gap, setGap] = useState<GapMode>("tight");
  const isMobile = useMobilePreview();

  const gapValue: Record<GapMode, string> = {
    none: "0px",
    tight: "0.75rem",
    loose: "1.75rem",
  };

  return (
    <PreviewCard
      full
      wideMobile
      footer={
        <FooterRow>
          <SurfaceButton active={gap === "none"} onClick={() => setGap("none")}>
            No gap
          </SurfaceButton>
          <SurfaceButton active={gap === "tight"} onClick={() => setGap("tight")}>
            Balanced
          </SurfaceButton>
          <SurfaceButton active={gap === "loose"} onClick={() => setGap("loose")}>
            Loose
          </SurfaceButton>
        </FooterRow>
      }
      footnote={
        <PreviewFootnote>
          Gap is the container&apos;s property. The cards do not know it exists.
        </PreviewFootnote>
      }
    >
      <Stage>
        <Chrome>
          <Toolbar />
          <div className="p-3 sm:p-4">
            <div
              className="grid h-[24rem] grid-cols-2 content-center transition-[gap] duration-300 ease-out sm:h-[13.75rem] sm:grid-cols-3"
              style={{
                gap: gapValue[gap],
                gridTemplateRows: isMobile
                  ? "repeat(3, minmax(6.25rem, 1fr))"
                  : "repeat(2, 6rem)",
              }}
            >
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "flex min-h-[6.25rem] flex-col gap-2 bg-preview-surface-muted p-3 dark:bg-preview-dark-stage sm:min-h-[6rem]",
                    gap !== "none" && "rounded-xl border border-preview-border dark:border-preview-dark-border-strong",
                  )}
                >
                  <SkeletonLine className="h-3 w-3/4" />
                  <SkeletonLine className="h-3 w-1/2" />
                  <SkeletonBlock className="mt-auto h-5 w-full" />
                </div>
              ))}
            </div>
          </div>
        </Chrome>
      </Stage>
    </PreviewCard>
  );
}
