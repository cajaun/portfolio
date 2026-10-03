"use client";

import { useState } from "react";
import PreviewCard from "@/components/blog/previews/shared/preview-card";
import {
  VIEWBOX_WIDTH,
  type ChartPoint,
  getSmoothPoint,
  type RangeType,
} from "@/components/blog/previews/morphing-chart/shared/chart-model";
import { ChartPlot } from "@/components/blog/previews/morphing-chart/shared/components/chart-plot";
import { PreviewFootnote } from "@/components/blog/previews/morphing-chart/shared/primitives";
import {
  STARTUP_CURVE_PHASES,
  STARTUP_CURVE_TROUGH_CURSOR,
  STARTUP_CURVE_TROUGH_RANGE,
  STARTUP_CURVE_VALUES,
} from "../data/series";

function getPhaseLabel(progress: number, includeTrough: boolean) {
  const phases = includeTrough
    ? STARTUP_CURVE_PHASES
    : STARTUP_CURVE_PHASES.filter(
        (phase) => phase.id !== "trough-of-sorrow",
      );
  const phase = phases.reduce(
    (currentPhase, nextPhase) =>
      progress >= nextPhase.at ? nextPhase : currentPhase,
    phases[0],
  );

  return phase.shortLabel;
}

function getCursorLabel(cursor: ChartPoint | null, includeTrough: boolean) {
  if (!cursor) return undefined;

  return getPhaseLabel(cursor.x / VIEWBOX_WIDTH, includeTrough);
}

export function StartupCurvePreview({
  footnote = "The first idea is only the beginning",
  showFill = false,
  staticPhase,
  staticCursorPhase,
}: {
  footnote?: string;
  showFill?: boolean;
  staticPhase?: string;
  staticCursorPhase?: string;
}) {
  const [cursor, setCursor] = useState<ChartPoint | null>(null);
  const [cursorLabel, setCursorLabel] = useState<string | undefined>();
  const range: RangeType = "1W";
  const staticPhasePoint = staticPhase
    ? STARTUP_CURVE_PHASES.find((phase) => phase.id === staticPhase)
    : null;
  const staticCursorPhasePoint = staticCursorPhase
    ? STARTUP_CURVE_PHASES.find((phase) => phase.id === staticCursorPhase)
    : staticPhasePoint;
  const staticCursor = staticCursorPhasePoint
    ? getSmoothPoint(
        STARTUP_CURVE_VALUES,
        VIEWBOX_WIDTH,
        (staticCursorPhasePoint.id === "trough-of-sorrow"
          ? STARTUP_CURVE_TROUGH_CURSOR
          : staticCursorPhasePoint.at) * VIEWBOX_WIDTH,
      )
    : null;
  const activeCursor = staticCursor ?? cursor;
  const isStatic = Boolean(staticCursor);
  const handleCursorChange = (point: ChartPoint) => {
    setCursor(point);
    setCursorLabel(getCursorLabel(point, showFill));
  };

  return (
    <PreviewCard
      full
      innerClassName="!p-0"
      footnote={<PreviewFootnote>{footnote}</PreviewFootnote>}
    >
      <div className="mx-auto w-full max-w-[620px]">
        <div className="relative">
          <ChartPlot
            values={STARTUP_CURVE_VALUES}
            range={range}
            cursor={activeCursor}
            onCursorChange={isStatic ? () => undefined : handleCursorChange}
            onCursorEnd={isStatic ? () => undefined : () => setCursor(null)}
            cursorLabel={
              isStatic
                ? staticPhasePoint?.shortLabel
                : cursorLabel
            }
            showFill={showFill}
            fillRange={showFill ? STARTUP_CURVE_TROUGH_RANGE : undefined}
            focusRange={isStatic ? STARTUP_CURVE_TROUGH_RANGE : undefined}
            interactive={!isStatic}
          />
        </div>
      </div>
    </PreviewCard>
  );
}
