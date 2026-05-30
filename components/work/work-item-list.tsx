import Link from "next/link";
import { TextMorph } from "torph/react";
import { AnimatedBackground } from "@/components/ui/animated-background";
import type { WorkItem, WorkTabId } from "@/data/work";
import WorkItemPreview from "./work-item-preview";

type WorkItemListProps = {
  tabId: WorkTabId;
  items: WorkItem[];
};

export default function WorkItemList({ tabId, items }: WorkItemListProps) {
  return (
    <div className="px-6">
      <AnimatedBackground
        enableHover
        singleBackground
        containerClassName="flex flex-col gap-2"
        className="pointer-events-none rounded-xl bg-gray-300 dark:bg-[#2A2A2A]"
        transition={{
          type: "spring",
          bounce: 0.2,
          duration: 0.3,
        }}
      >
        {items.map((item) => (
          <Link
            key={`${tabId}-${item.title}`}
            data-id={`${tabId}-${item.title}`}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            className="group -mx-2 block overflow-hidden rounded-xl p-2"
          >
            <div className="relative flex min-w-0 items-center gap-4">
              <WorkItemPreview tabId={tabId} />

              <div className="flex w-full min-w-0 items-center justify-between">
                <div className="flex min-w-0 flex-1 flex-col">
                  <TextMorph className="block max-w-full truncate font-medium">
                    {item.title}
                  </TextMorph>
                  <TextMorph className="font-medium leading-6 tracking-[-0.1px] text-gray-200 dark:text-gray-100">
                    {item.date}
                  </TextMorph>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </AnimatedBackground>
    </div>
  );
}
