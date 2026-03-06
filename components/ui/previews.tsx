import { ReactNode } from "react";

type PreviewProps = {
  children: ReactNode;
  full?: boolean;
};

export default function PreviewCard({ children, full = false }: PreviewProps) {
  return (
    <div className="preview-card ">
      <div className={full ? "preview-card-inner-full px-6 py-16" : "preview-card-inner"}>
        {children}
      </div>
    </div>
  );
}