"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const layoutTransition = {
  type: "spring" as const,
  stiffness: 420,
  damping: 34,
  mass: 0.8,
};

export const fadeTransition = {
  duration: 0.18,
  ease: "easeOut" as const,
};

export function SkeletonLine({
  className,
}: {
  className: string;
}) {
  return (
    <div
      className={`rounded-full bg-black/[0.06] dark:bg-preview-dark-skeleton ${className}`}
    />
  );
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
        "overflow-hidden rounded-[1.4rem] bg-preview-surface shadow-custom dark:bg-preview-dark-surface",
        className ?? "max-w-xl",
      )}
    >
      {children}
    </div>
  );
}

export function PreviewModalShell({
  title,
  description,
  compact = false,
}: {
  title: string;
  description: string;
  compact?: boolean;
}) {
  return (
    <div className="w-full max-w-[22rem] rounded-[1.25rem] bg-preview-surface p-4 text-preview-text shadow-custom dark:bg-preview-dark-surface-muted dark:text-preview-dark-text dark:shadow-[0_20px_60px_rgba(0,0,0,0.42)]">
      <p className="text-[15px] font-medium tracking-[-0.02em]">{title}</p>
      <p className="mt-1 text-[13px] leading-[1.4] text-gray-200 dark:text-preview-dark-paragraph">
        {description}
      </p>
      <div className="mt-4 rounded-xl border border-preview-border bg-preview-surface-muted p-3 dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-raised">
        <SkeletonLine className="h-3.5 w-24" />
        <SkeletonLine className="mt-2 h-3 w-36" />
        <SkeletonLine className="mt-1.5 h-3 w-28" />
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-preview-border pt-4 dark:border-preview-dark-border-strong">
        <div className="h-9 w-24 rounded-xl border border-preview-border bg-preview-surface-muted dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-raised" />
        <div
          className={cn(
            "h-9 rounded-xl border border-preview-border bg-preview-surface-active dark:border-preview-dark-border-strong dark:bg-preview-dark-surface-active",
            compact ? "w-16" : "w-20",
          )}
        />
      </div>
    </div>
  );
}
