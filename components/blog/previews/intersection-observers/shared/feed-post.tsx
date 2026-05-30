"use client";

import ImageCardSkeleton, {
  type ImageCardCount,
} from "@/components/blog/previews/shared/image-card-skeleton";
import { cn } from "@/lib/utils";

export function FeedPost({
  gridSize,
  title,
  active = false,
}: {
  gridSize: ImageCardCount;
  title?: string;
  active?: boolean;
}) {
  return (
    <article>
      <ImageCardSkeleton
        count={gridSize}
        title={title}
        className={cn(
          "transition-shadow",
          active && "ring-1 ring-preview-border dark:ring-preview-dark-border",
        )}
      />
    </article>
  );
}
