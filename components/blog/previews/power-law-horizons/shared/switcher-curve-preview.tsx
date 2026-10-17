"use client";

import { useState } from "react";
import PreviewCard from "@/components/blog/previews/shared/preview-card";
import {
  VIEWBOX_WIDTH,
  type ChartPoint,
  type RangeType,
} from "@/components/blog/previews/morphing-chart/shared/chart-model";
import { ChartPlot } from "@/components/blog/previews/morphing-chart/shared/components/chart-plot";
import { PreviewFootnote } from "@/components/blog/previews/morphing-chart/shared/primitives";
import type { CurveVariant } from "../data/curve-types";
import { ChartSwitcherFooter } from "./chart-switcher-footer";

function getAnnotationLabel(progress: number, variant: CurveVariant) {
  return variant.annotations.reduce(
    (currentLabel, annotation) =>
      progress >= annotation.at ? annotation.label : currentLabel,
    variant.annotations[0]?.label ?? "",
  );
}

export function SwitcherCurvePreview({
  variants,
  footnote,
  tabListLabel,
  showFill = false,
}: {
  variants: CurveVariant[];
  footnote: string;
  tabListLabel: string;
  showFill?: boolean;
}) {
  const [selected, setSelected] = useState(variants[0].id);
  const [cursor, setCursor] = useState<ChartPoint | null>(null);
  const [cursorLabel, setCursorLabel] = useState<string | undefined>();
  const activeVariant =
    variants.find((variant) => variant.id === selected) ?? variants[0];
  const range: RangeType = "1W";

  const selectVariant = (id: string) => {
    setCursor(null);
    setCursorLabel(undefined);
    setSelected(id);
  };

  const handleCursorChange = (point: ChartPoint) => {
    setCursor(point);
    setCursorLabel(
      getAnnotationLabel(point.x / VIEWBOX_WIDTH, activeVariant),
    );
  };

  return (
    <PreviewCard
      full
      innerClassName="!p-0"
      footer={
        <ChartSwitcherFooter
          variants={variants}
          selected={selected}
          onSelect={selectVariant}
          label={tabListLabel}
        />
      }
      footnote={<PreviewFootnote>{footnote}</PreviewFootnote>}
    >
      <div className="mx-auto w-full max-w-[620px]">
        <ChartPlot
          values={activeVariant.values}
          range={range}
          cursor={cursor}
          onCursorChange={handleCursorChange}
          onCursorEnd={() => setCursor(null)}
          cursorLabel={cursorLabel}
          showFill={showFill || activeVariant.showFill === true}
        />
      </div>
    </PreviewCard>
  );
}
