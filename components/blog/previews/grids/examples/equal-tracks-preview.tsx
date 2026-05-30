"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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


type ColCount = 2 | 3 | 4;

export function EqualTracksPreview() {
  const [cols, setCols] = useState<ColCount>(3);
  const isMobile = useMobilePreview();

  const template: Record<ColCount, string> = {
    2: "repeat(2, minmax(0, 1fr))",
    3: "repeat(3, minmax(0, 1fr))",
    4: "repeat(4, minmax(0, 1fr))",
  };
  const rowHeight = isMobile ? "7.25rem" : "6rem";

  useEffect(() => {
    if (isMobile && cols === 4) {
      setCols(3);
    }
  }, [cols, isMobile]);

  return (
    <PreviewCard
      full
      wideMobile
      footer={
        <FooterRow>
          <SurfaceButton active={cols === 2} onClick={() => setCols(2)}>
            2 columns
          </SurfaceButton>
          <SurfaceButton active={cols === 3} onClick={() => setCols(3)}>
            3 columns
          </SurfaceButton>
          <div className="hidden sm:block">
            <SurfaceButton active={cols === 4} onClick={() => setCols(4)}>
              4 columns
            </SurfaceButton>
          </div>
        </FooterRow>
      }
      footnote={
        <PreviewFootnote>
          Equal tracks split the container width evenly. Every card gets the same share.
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
              className="grid min-h-[23.5rem] content-center gap-2.5 sm:h-[20rem] sm:gap-3"
              style={{
                gridTemplateColumns: template[cols],
                gridAutoRows: rowHeight,
              }}
            >
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <AnimatedCardSkeleton
                  key={i}
                  className="min-h-[7.25rem] sm:h-24 sm:min-h-0"
                />
              ))}
            </motion.div>
          </div>
        </Chrome>
      </Stage>
    </PreviewCard>
  );
}
