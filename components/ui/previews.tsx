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
}: PreviewProps) {
  return (
    <>
      <div className={`preview-card `}>
        {header ? (
          <div
            className={cn(
              "flex h-[61px] items-center border-b border-[#EBEBEB] bg-[#FCFCFC] px-4 dark:border-[#2C2C2B] dark:bg-[lab(8.708%_0_0)]",
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
    ${full && !footer && !header ? "px-4 py-16" : ""}
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
          <div className="flex h-[61px] items-center border-t border-[#EBEBEB] bg-[#FCFCFC] px-4 dark:border-[#2C2C2B] dark:bg-[lab(8.708%_0_0)]">
            {footer}
          </div>
        ) : null}
      </div>
      {footnote ? footnote : null}
    </>
  );
}
