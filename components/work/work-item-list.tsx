import Link from "next/link";
import { TextMorph } from "torph/react";
import type { WorkItem, WorkTabId } from "@/data/work";
import WorkItemPreview from "./work-item-preview";

type WorkItemListProps = {
  tabId: WorkTabId;
  items: WorkItem[];
};

export default function WorkItemList({ tabId, items }: WorkItemListProps) {
  return (
    <div className="flex flex-col gap-2 px-6">
      {items.map((item) => (
        <Link
          key={`${tabId}-${item.title}`}
          href={item.href}
          target={item.external ? "_blank" : undefined}
          rel={item.external ? "noopener noreferrer" : undefined}
          className="group -mx-2 flex items-center gap-4 rounded-xl p-2 transition-colors duration-500 ease-in-out hover:bg-gray-300 dark:hover:bg-[#2A2A2A]"
        >
          <WorkItemPreview tabId={tabId} />

          <div className="flex w-full min-w-0 items-center justify-between">
            <div className="flex min-w-0 flex-col">
              <TextMorph className="font-medium">{item.title}</TextMorph>
              <TextMorph className="text-gray-200 font-medium leading-6 tracking-[-0.1px] dark:text-gray-100">
                {item.date}
              </TextMorph>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
