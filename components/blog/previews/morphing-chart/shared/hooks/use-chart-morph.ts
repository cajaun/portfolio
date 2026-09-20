import { animate, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useMemo } from "react";
import {
  buildSmoothPath,
  buildChartPoints,
  CHART_HEIGHT,
  VIEWBOX_WIDTH,
} from "../chart-model";

const CROSSHAIR_RADIUS = 6;
const LIVE_DOT_COLLAPSE_DISTANCE = CROSSHAIR_RADIUS * 8;

const motionTransition = {
  duration: 0.25,
  ease: [0.22, 0.75, 0.28, 1] as const,
};

export function useChartMorph(values: number[], graphWidth: number) {
  const path = useMemo(() => buildSmoothPath(values, graphWidth), [graphWidth, values]);
  const endpointY = useMemo(() => {
    const points = buildChartPoints(values, graphWidth);

    return points[points.length - 1]?.y ?? 0;
  }, [graphWidth, values]);
  const fillPath = `${path} L ${graphWidth} ${CHART_HEIGHT} L 0 ${CHART_HEIGHT} Z`;
  const animatedPath = useMotionValue(path);
  const animatedFillPath = useMotionValue(fillPath);
  const animatedGraphWidth = useMotionValue(graphWidth);
  const animatedEndpointY = useMotionValue(endpointY);
  const animatedLiveClipWidth = useTransform(animatedGraphWidth, (width) =>
    Math.min(VIEWBOX_WIDTH, width + CROSSHAIR_RADIUS),
  );
  const endpointRadius = useTransform(animatedGraphWidth, (width) => {
    const distanceToEdge = VIEWBOX_WIDTH - width;
    const scale = Math.max(
      0,
      Math.min(1, distanceToEdge / LIVE_DOT_COLLAPSE_DISTANCE),
    );

    return CROSSHAIR_RADIUS * scale;
  });

  useEffect(() => {
    const pathAnimation = animate(animatedPath, path, motionTransition);
    const fillAnimation = animate(animatedFillPath, fillPath, motionTransition);
    const widthAnimation = animate(animatedGraphWidth, graphWidth, motionTransition);
    const endpointAnimation = animate(animatedEndpointY, endpointY, motionTransition);

    return () => {
      pathAnimation.stop();
      fillAnimation.stop();
      widthAnimation.stop();
      endpointAnimation.stop();
    };
  }, [
    animatedFillPath,
    animatedGraphWidth,
    animatedEndpointY,
    animatedPath,
    endpointY,
    fillPath,
    graphWidth,
    path,
  ]);

  return {
    animatedPath,
    animatedFillPath,
    animatedGraphWidth,
    animatedLiveClipWidth,
    animatedEndpointY,
    endpointRadius,
  };
}
