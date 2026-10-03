"use client";

import { useState } from "react";
import PreviewCard from "@/components/blog/previews/shared/preview-card";
import type { ChartPoint } from "@/components/blog/previews/morphing-chart/shared/chart-model";
import { PreviewFootnote, Stage } from "@/components/blog/previews/morphing-chart/shared/primitives";
import { StartupCurvePlot } from "./one-to-n-plot";

export function StartupCurvePreview({
  footnote = "The first idea is only the beginning",
}: {
  footnote?: string;
}) {
  const [cursor, setCursor] = useState<ChartPoint | null>(null);

  return (
    <PreviewCard
      full
      footnote={<PreviewFootnote>{footnote}</PreviewFootnote>}
    >
      <Stage>
        <div className="mx-auto w-full max-w-[620px]">
          <StartupCurvePlot
            cursor={cursor}
            onCursorChange={setCursor}
            onCursorEnd={() => setCursor(null)}
          />
        </div>
      </Stage>
    </PreviewCard>
  );
}
