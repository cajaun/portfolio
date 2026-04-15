import type { WorkTabId } from "@/data/work";

const previewStyles: Record<WorkTabId, string[]> = {
  articles: [
    "mt-0.5 h-[3px] w-4 rounded-full bg-[lab(91.996%_-0.0000298023_0.0000119209)] dark:bg-[lab(17.06%_0_0)]",
    "mt-1 h-[3px] w-8 rounded-full bg-[lab(91.996%_-0.0000298023_0.0000119209)] dark:bg-[lab(17.06%_0_0)]",
    "h-[3px] w-6 rounded-full bg-[lab(91.996%_-0.0000298023_0.0000119209)] dark:bg-[lab(17.06%_0_0)]",
    "mt-1 h-[3px] w-5 rounded-full bg-[lab(91.996%_-0.0000298023_0.0000119209)] dark:bg-[lab(17.06%_0_0)]",
    "h-[3px] w-3 rounded-full bg-[lab(91.996%_-0.0000298023_0.0000119209)] dark:bg-[lab(17.06%_0_0)]",
  ],
  components: [
    "h-5 rounded-sm bg-[lab(91.996%_-0.0000298023_0.0000119209)] dark:bg-[lab(17.06%_0_0)]",
    "h-[3px] w-5 rounded-full bg-[lab(91.996%_-0.0000298023_0.0000119209)] dark:bg-[lab(17.06%_0_0)]",
    "h-[3px] w-8 rounded-full bg-[lab(91.996%_-0.0000298023_0.0000119209)] dark:bg-[lab(17.06%_0_0)]",
    "h-[3px] w-3 rounded-full bg-[lab(91.996%_-0.0000298023_0.0000119209)] dark:bg-[lab(17.06%_0_0)]",
  ],
  projects: [],
};

export default function WorkItemPreview({ tabId }: { tabId: WorkTabId }) {
  return (
    <div className="relative flex h-13 w-11 shrink-0 select-none items-center justify-center overflow-hidden rounded-md bg-[lab(100%_0_0)] shadow-custom dark:bg-[lab(3.04863%_0_0)]">
      {tabId === "projects" ? (
        <div className="flex h-full w-full flex-col gap-1 p-1.5">
          <span className="mt-0.5 h-[3px] w-4 rounded-full bg-[lab(91.996%_-0.0000298023_0.0000119209)] dark:bg-[lab(17.06%_0_0)]" />
          <div className="flex items-center justify-between gap-x-1">
            <div className="h-[11px] w-1/2 rounded-sm bg-[lab(91.996%_-0.0000298023_0.0000119209)] dark:bg-[lab(17.06%_0_0)]" />
            <div className="h-[11px] w-1/2 rounded-sm bg-[lab(91.996%_-0.0000298023_0.0000119209)] dark:bg-[lab(17.06%_0_0)]" />
          </div>
          <span className="h-[3px] w-5 rounded-full bg-[lab(91.996%_-0.0000298023_0.0000119209)] dark:bg-[lab(17.06%_0_0)]" />
          <span className="h-[3px] w-8 rounded-full bg-[lab(91.996%_-0.0000298023_0.0000119209)] dark:bg-[lab(17.06%_0_0)]" />
          <span className="h-[3px] w-3 rounded-full bg-[lab(91.996%_-0.0000298023_0.0000119209)] dark:bg-[lab(17.06%_0_0)]" />
        </div>
      ) : (
        <div className="flex h-full w-full flex-col items-start justify-center gap-1 p-1.5">
          <div className="flex h-full w-full flex-col justify-start gap-1">
            {previewStyles[tabId].map((className) => (
              <span key={className} className={className} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
