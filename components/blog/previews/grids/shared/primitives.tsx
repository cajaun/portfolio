"use client";

import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const layoutTransition = {
  type: "spring" as const,
  stiffness: 420,
  damping: 34,
  mass: 0.8,
};

export const fadeTransition = {
  duration: 0.22,
  ease: "easeOut" as const,
};

export const previewCardBase =
  "border-preview-border bg-preview-surface-muted dark:border-preview-dark-border-strong dark:bg-preview-dark-stage";
export const previewCardHighlight =
  "border-preview-border bg-preview-surface-active dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-muted";

const mobilePreviewQuery = "(max-width: 640px)";

export function useMobilePreview() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(mobilePreviewQuery);
    const update = () => setIsMobile(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  return isMobile;
}

export function SurfaceButton({
  children,
  active = false,
  onClick,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-9 items-center justify-center rounded-lg px-3 text-[13px] font-medium tracking-[-0.01em] transition-transform duration-200 active:scale-[0.98]",
        active
          ? "bg-preview-surface-active text-preview-text shadow-custom dark:bg-preview-dark-surface-muted dark:text-preview-dark-text"
          : "bg-preview-surface text-preview-text shadow-custom dark:border-preview-dark-border-strong dark:bg-preview-dark-stage dark:text-preview-dark-text",
      )}
    >
      {children}
    </button>
  );
}

export function PreviewFootnote({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 flex w-full select-none items-center justify-center text-center">
      <p className="max-w-xl text-center text-[13px] leading-5 text-gray-200 dark:text-preview-dark-paragraph">
        {children}
      </p>
    </div>
  );
}

export function FooterRow({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-2">
      {children}
    </div>
  );
}

export function SkeletonLine({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-full bg-preview-border dark:bg-preview-dark-surface-active",
        className,
      )}
    />
  );
}

export function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg bg-preview-border dark:bg-preview-dark-surface-active",
        className,
      )}
    />
  );
}

export function AnimatedCardSkeleton({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <motion.div
      layout
      transition={layoutTransition}
      className={cn(
        "flex flex-col gap-2 rounded-xl border border-preview-border bg-preview-surface p-2.5 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface sm:p-3",
        className,
      )}
      style={style}
    >
      <SkeletonLine className="h-3 w-3/4" />
      <SkeletonLine className="h-3 w-1/2" />
      <SkeletonBlock className="mt-auto h-6 w-full" />
    </motion.div>
  );
}

export function Stage({ children }: { children: ReactNode }) {
  return (
    <div className="bg-preview-surface-muted px-4 py-4 sm:px-8 sm:py-8 dark:bg-preview-dark-stage">
      {children}
    </div>
  );
}

export function Chrome({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full overflow-hidden rounded-[1.4rem] bg-preview-surface shadow-custom dark:bg-preview-dark-surface",
        className ?? "max-w-xl",
      )}
    >
      {children}
    </div>
  );
}

export function Toolbar() {
  return (
    <div className="flex h-11 items-center justify-between border-b border-preview-border bg-preview-surface-muted px-4 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-muted">
      <SkeletonLine className="h-3.5 w-24" />
      <SkeletonLine className="h-3.5 w-16" />
    </div>
  );
}
