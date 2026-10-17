"use client";

import {
  animate,
  motion,
  useMotionValue,
  type MotionValue,
} from "framer-motion";
import { useEffect } from "react";

const INDICATOR_TRANSITION = {
  duration: 0.2,
  ease: [0.26, 0, 0.11, 1] as const,
};

type CodeBoxProps = {
  index: number;
  value: string;
  active: boolean;
  indicatorBorderColor: MotionValue<string>;
  onPress: (index: number) => void;
};

export function CodeBox({
  index,
  value,
  active,
  indicatorBorderColor,
  onPress,
}: CodeBoxProps) {
  const digitY = useMotionValue(value ? 0 : 20);
  const digitOpacity = useMotionValue(value ? 1 : 0);
  const placeholderOpacity = useMotionValue(value ? 0 : 1);

  useEffect(() => {
    const digitYAnimation = animate(digitY, value ? 0 : 20, {
      duration: 0.2,
      ease: "easeOut",
    });
    const digitOpacityAnimation = animate(digitOpacity, value ? 1 : 0, {
      duration: 0.2,
      ease: "easeOut",
    });
    const placeholderAnimation = animate(
      placeholderOpacity,
      value ? 0 : 1,
      { duration: 0.2, ease: "easeOut" },
    );

    return () => {
      digitYAnimation.stop();
      digitOpacityAnimation.stop();
      placeholderAnimation.stop();
    };
  }, [digitOpacity, digitY, placeholderOpacity, value]);

  return (
    <motion.div className="relative shrink-0">
      <button
        type="button"
        aria-label={`Code digit ${index + 1}`}
        onClick={() => onPress(index)}
        className="relative flex h-10 w-8 items-center justify-center rounded-xl border border-preview-border bg-preview-surface-muted text-preview-text outline-none transition-colors duration-200 hover:bg-preview-surface-active focus-visible:ring-2 focus-visible:ring-preview-border sm:h-[54px] sm:w-12 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-muted dark:text-preview-dark-text dark:hover:bg-preview-dark-surface-active dark:focus-visible:ring-preview-dark-border-strong"
      >
        {active ? (
          <motion.span
            layoutId="verification-code-indicator"
            className="pointer-events-none absolute inset-0 z-10 rounded-xl border-2"
            style={{
              borderColor: indicatorBorderColor,
            }}
            transition={INDICATOR_TRANSITION}
          />
        ) : null}
        <motion.span
          aria-hidden="true"
          className="absolute text-[18px] font-medium leading-none tracking-[-0.01em] text-preview-text dark:text-preview-dark-text sm:text-[20px]"
          style={{
            y: digitY,
            opacity: digitOpacity,
          }}
        >
          {value}
        </motion.span>
        <motion.span
          aria-hidden="true"
          className="absolute text-[18px] font-medium leading-none tracking-[-0.01em] text-preview-text-muted dark:text-preview-dark-text-muted sm:text-[20px]"
          style={{ opacity: placeholderOpacity }}
        >
          0
        </motion.span>
      </button>
    </motion.div>
  );
}
