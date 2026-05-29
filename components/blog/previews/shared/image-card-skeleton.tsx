"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type ImageCardCount = 1 | 2 | 3 | 4;
type ImageCardItem = 1 | 2 | 3 | 4;

const imageCardItems: ImageCardItem[] = [1, 2, 3, 4];
const imageCardFrameHeight = "13rem";

const layoutTransition = {
  type: "spring" as const,
  stiffness: 420,
  damping: 34,
  mass: 0.8,
};

const fadeTransition = {
  duration: 0.22,
  ease: "easeOut" as const,
};

const skeletonTone = "bg-black/[0.06] dark:bg-preview-dark-surface-active";

function SkeletonLine({ className }: { className?: string }) {
  return <div className={cn("rounded-full", skeletonTone, className)} />;
}

function getImageCardSlot(
  count: ImageCardCount,
  item: ImageCardItem,
): CSSProperties {
  if (count === 1) {
    return item === 1
      ? { gridColumn: "1 / span 2", gridRow: "1 / span 2", zIndex: 2 }
      : { gridColumn: "2", gridRow: "1 / span 2", zIndex: 1 };
  }

  if (count === 2) {
    return item === 1
      ? { gridColumn: "1", gridRow: "1 / span 2", zIndex: 2 }
      : { gridColumn: "2", gridRow: "1 / span 2", zIndex: 2 };
  }

  if (count === 3) {
    const slots: Record<ImageCardItem, CSSProperties> = {
      1: { gridColumn: "1", gridRow: "1 / span 2", zIndex: 2 },
      2: { gridColumn: "2", gridRow: "1", zIndex: 2 },
      3: { gridColumn: "2", gridRow: "2", zIndex: 2 },
      4: { gridColumn: "2", gridRow: "2", zIndex: 1 },
    };

    return slots[item];
  }

  const slots: Record<ImageCardItem, CSSProperties> = {
    1: { gridColumn: "1", gridRow: "1", zIndex: 2 },
    2: { gridColumn: "2", gridRow: "1", zIndex: 2 },
    3: { gridColumn: "1", gridRow: "2", zIndex: 2 },
    4: { gridColumn: "2", gridRow: "2", zIndex: 2 },
  };

  return slots[item];
}

export default function ImageCardSkeleton({
  count,
  title,
  className,
}: {
  count: ImageCardCount;
  title?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto max-w-sm overflow-hidden rounded-[1.4rem] bg-preview-surface shadow-custom dark:bg-preview-dark-surface",
        className,
      )}
    >
      <div className="flex h-11 items-center gap-2 border-b border-preview-border bg-preview-surface-muted px-4 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-muted">
        <div className={cn("size-7 rounded-full", skeletonTone)} />
        {title ? (
          <p className="truncate text-[13px] font-medium tracking-[-0.01em] text-preview-text dark:text-preview-dark-text">
            {title}
          </p>
        ) : (
          <SkeletonLine className="h-3 w-20" />
        )}
      </div>
      <div className="flex flex-col gap-2 px-4 pb-2 pt-3">
        <SkeletonLine className="h-2.5 w-full" />
        <SkeletonLine className="h-2.5 w-4/5" />
      </div>
      <div className="px-3 pb-3">
        <motion.div
          layout
          transition={layoutTransition}
          className="grid grid-cols-2 gap-1.5"
          style={{
            gridTemplateRows: "repeat(2, minmax(0, 1fr))",
            height: imageCardFrameHeight,
          }}
        >
          {imageCardItems.map((item) => {
            const visible = item <= count;

            return (
              <motion.div
                key={item}
                layout
                aria-hidden="true"
                initial={false}
                animate={{
                  opacity: visible ? 1 : 0,
                  scale: visible ? 1 : 0.96,
                }}
                transition={{
                  ...layoutTransition,
                  opacity: fadeTransition,
                  scale: fadeTransition,
                }}
                className={cn(
                  "pointer-events-none min-h-0 rounded-xl",
                  skeletonTone,
                )}
                style={getImageCardSlot(count, item)}
              />
            );
          })}
        </motion.div>
      </div>
      <div className="flex h-10 items-center gap-4 border-t border-preview-border px-4 dark:border-preview-dark-border-strong">
        <SkeletonLine className="h-3 w-8" />
        <SkeletonLine className="h-3 w-8" />
        <SkeletonLine className="ml-auto h-3 w-8" />
      </div>
    </div>
  );
}

export type { ImageCardCount };
