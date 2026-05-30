"use client";

import { useState } from "react";
import ImageCardSkeleton from "@/components/blog/previews/shared/image-card-skeleton";
import PreviewCard from "@/components/blog/previews/shared/preview-card";
import { FooterRow, PreviewFootnote, Stage, SurfaceButton } from "../shared/primitives";


type MosaicCount = 1 | 2 | 3 | 4;

function clampMosaicCount(value: number): MosaicCount {
  return Math.min(4, Math.max(1, value)) as MosaicCount;
}

export function MosaicExamplesPreview() {
  const [count, setCount] = useState<MosaicCount>(1);

  return (
    <PreviewCard
      full
      wideMobile
      footer={
        <FooterRow>
          <SurfaceButton
            onClick={() => setCount((current) => clampMosaicCount(current - 1))}
          >
            Remove image
          </SurfaceButton>
          <SurfaceButton
            onClick={() => setCount((current) => clampMosaicCount(current + 1))}
          >
            Add image
          </SurfaceButton>
        </FooterRow>
      }
      footnote={
        <PreviewFootnote>
          {count} {count === 1 ? "image uses" : "images use"} a count-specific composition rule.
        </PreviewFootnote>
      }
    >
      <Stage>
        <ImageCardSkeleton count={count} />
      </Stage>
    </PreviewCard>
  );
}
