import { ReactNode, RefObject } from "react";
import { cn } from "@/lib/utils";

type PreviewProps = {
  children: ReactNode;
  header?: ReactNode;
  headerClassName?: string;
  footer?: ReactNode;
  footnote?: ReactNode;
  full?: boolean;
  scrollable?: boolean;
  scrollContainerRef?: RefObject<HTMLDivElement>;
  video?: boolean;
};

export default function PreviewCard({
  children,
  header,
  headerClassName,
  footer,
  footnote,
  full = false,
  scrollable = false,
  scrollContainerRef,
  video = false,
}: PreviewProps) {
  return (
    <>
      <div className={`preview-card `}>
        {header ? (
          <div
            className={cn(
              "flex h-[61px] items-center border-b border-preview-border bg-preview-surface-muted px-4 text-preview-text dark:border-preview-dark-border dark:bg-preview-dark-surface-muted dark:text-white",
              headerClassName,
            )}
          >
            {header}
          </div>
        ) : null}
        <div
          ref={scrollContainerRef}
          className={`
    ${full ? "preview-card-inner-full" : "preview-card-inner"}
    ${full && !footer && !header ? (video ? "px-4 py-8" : "px-4 py-16") : ""}
    ${scrollable ? "h-[28rem] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden" : ""}
  `}
          style={
            scrollable
              ? {
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }
              : undefined
          }
        >
          {children}
        </div>
        {footer ? (
          <div className="flex h-[61px] items-center border-t border-preview-border bg-preview-surface-muted px-4 dark:border-preview-dark-border dark:bg-preview-dark-surface-muted">
            {footer}
          </div>
        ) : null}
      </div>
      {footnote ? footnote : null}
    </>
  );
}
