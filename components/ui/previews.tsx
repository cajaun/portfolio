import { ReactNode } from "react";

type PreviewProps = {
  children: ReactNode;
  footer?: ReactNode;
  full?: boolean;
};

export default function PreviewCard({
  children,
  footer,
  full = false,
}: PreviewProps) {
  return (
    <div className={`preview-card `}>
      <div
        className={`
    ${full ? "preview-card-inner-full" : "preview-card-inner"}
    ${full && !footer ? "px-4 py-16" : ""}
  `}
      >
        {children}
      </div>
      {footer ? (
        <div className="border-t border-[#EBEBEB] bg-[#FCFCFC] px-4 py-3 dark:border-[#2C2C2B] dark:bg-[lab(8.708%_0_0)]">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
