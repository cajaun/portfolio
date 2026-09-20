"use client";

import { useState } from "react";
import PreviewCard from "@/components/blog/previews/shared/preview-card";
import {
  CHART_DATA_BY_PALETTE,
  CHART_DATA_BY_SOURCE,
  type ChartPaletteKey,
  type ChartPoint,
  type RangeType,
} from "../chart-model";
import {
  CHART_PALETTES,
  DEFAULT_CHART_PALETTE,
  type ChartPalette,
} from "../chart-palette";
import { PreviewFootnote, Stage } from "../primitives";
import { ChartFillFooter, type FillMode } from "./chart-fill-footer";
import { ChartPlot } from "./chart-plot";
import { ChartRangeFooter } from "./chart-range-footer";

function ChartOnlyPreview({
  initialRange = "1M",
  palette = DEFAULT_CHART_PALETTE,
  data,
  showFill = false,
  footnote = "The cursor, future line and endpoint share one path",
}: {
  initialRange?: RangeType;
  palette?: ChartPalette;
  data?: Record<RangeType, number[]>;
  showFill?: boolean;
  footnote?: string;
}) {
  const [range, setRange] = useState<RangeType>(initialRange);
  const [cursor, setCursor] = useState<ChartPoint | null>(null);
  const values = (data ?? CHART_DATA_BY_SOURCE.Revenue.chartDataSets)[range];

  return (
    <PreviewCard
      full
      footer={
        <ChartRangeFooter
          selected={range}
          onSelect={(nextRange) => {
            setCursor(null);
            setRange(nextRange);
          }}
        />
      }
      footnote={<PreviewFootnote>{footnote}</PreviewFootnote>}
    >
      <Stage>
        <div className="mx-auto w-full max-w-[620px]">
          <ChartPlot
            values={values}
            range={range}
            cursor={cursor}
            onCursorChange={setCursor}
            onCursorEnd={() => setCursor(null)}
            showFill={showFill}
            palette={palette}
          />
        </div>
      </Stage>
    </PreviewCard>
  );
}

export function MorphingChartPreview({
  footnote,
}: {
  footnote?: string;
}) {
  return <ChartOnlyPreview footnote={footnote} />;
}

export function MorphingChartLayerPreview({
  footnote = "The stroke and area morph from one path",
}: {
  footnote?: string;
}) {
  return (
    <ChartOnlyPreview
      initialRange="1W"
      showFill
      footnote={footnote}
    />
  );
}

export function MorphingChartFillPreview({
  footnote = "The area layer follows the line geometry",
}: {
  footnote?: string;
}) {
  const [fillMode, setFillMode] = useState<FillMode>("on");
  const [cursor, setCursor] = useState<ChartPoint | null>(null);
  const range: RangeType = "1W";
  const values = CHART_DATA_BY_SOURCE.Revenue.chartDataSets[range];

  return (
    <PreviewCard
      full
      footer={
        <ChartFillFooter selected={fillMode} onSelect={setFillMode} />
      }
      footnote={
        <PreviewFootnote>{footnote}</PreviewFootnote>
      }
    >
      <Stage>
        <div className="mx-auto w-full max-w-[620px]">
          <ChartPlot
            values={values}
            range={range}
            cursor={cursor}
            onCursorChange={setCursor}
            onCursorEnd={() => setCursor(null)}
            showFill={fillMode === "on"}
          />
        </div>
      </Stage>
    </PreviewCard>
  );
}

export function MorphingChartExamplePreview({
  example,
  initialRange = "1M",
  showFill = true,
  footnote,
}: {
  example: ChartPaletteKey;
  initialRange?: RangeType;
  showFill?: boolean;
  footnote?: string;
}) {
  return (
    <ChartOnlyPreview
      initialRange={initialRange}
      palette={CHART_PALETTES[example]}
      data={CHART_DATA_BY_PALETTE[example]}
      showFill={showFill}
      footnote={
        footnote ??
        "One series shape carries every range"
      }
    />
  );
}
