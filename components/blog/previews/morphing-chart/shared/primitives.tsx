import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function FooterRow({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-2">
      {children}
    </div>
  );
}

export function PreviewFootnote({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 flex w-full select-none items-center justify-center text-center">
      <p className="text-center text-[13px] text-preview-text-muted dark:text-preview-dark-text-muted">
        {children}
      </p>
    </div>
  );
}

export function Stage({ children }: { children: ReactNode }) {
  return <div className="bg-preview-surface-muted dark:bg-preview-dark-stage">{children}</div>;
}

export function MetricBadge({
  children,
  active = false,
}: {
  children: ReactNode;
  active?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium",
        active
          ? "border-[#D9D9D9] bg-[#D9D9D9] text-[#111318]"
          : "border-preview-border bg-preview-surface text-preview-text-muted dark:border-preview-dark-border-strong dark:bg-preview-dark-surface dark:text-preview-dark-text-muted",
      )}
    >
      {children}
    </span>
  );
}
