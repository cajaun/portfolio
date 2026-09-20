import { animate, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

export function useFutureFade({
  cursorActive,
  lineColor,
  futureColor,
  futureUsesOpacity,
}: {
  cursorActive: boolean;
  lineColor: string;
  futureColor: string;
  futureUsesOpacity: boolean;
}) {
  const futureFade = useMotionValue(0);
  const futureMarkColor = futureUsesOpacity ? lineColor : futureColor;
  const futureStrokeColor = useTransform(
    futureFade,
    [0, 1],
    [lineColor, futureUsesOpacity ? lineColor : futureColor],
  );
  const futureEndpointColor = useTransform(
    futureFade,
    [0, 1],
    [lineColor, futureColor],
  );
  const futureStrokeOpacity = useTransform(
    futureFade,
    [0, 1],
    futureUsesOpacity ? [1, 0.28] : [1, 1],
  );
  const futureFillOpacity = useTransform(futureFade, [0, 1], [1, 0.24]);
  const outerBorderOpacity = useTransform(futureFade, [0, 1], [0, 0.26]);
  const guideOpacity = useTransform(
    futureFade,
    [0, 1],
    futureUsesOpacity ? [0, 0.28] : [0, 1],
  );

  useEffect(() => {
    const fade = animate(futureFade, cursorActive ? 1 : 0, {
      duration: 0.25,
      ease: cursorActive ? "easeIn" : "easeOut",
    });

    return () => fade.stop();
  }, [cursorActive, futureFade]);

  return {
    futureFade,
    futureMarkColor,
    futureStrokeColor,
    futureEndpointColor,
    futureStrokeOpacity,
    futureFillOpacity,
    outerBorderOpacity,
    guideOpacity,
  };
}
