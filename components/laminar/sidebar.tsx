"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getLaminarDocHref,
  getLaminarDocPath,
  LAMINAR_NAV_GROUPS,
} from "./docs-nav";

export default function LaminarSidebar() {
  const pathname = usePathname();
  const docPath = getLaminarDocPath(pathname);

  return (
    <aside className="sticky top-0 hidden h-screen w-[275px] flex-col border-r border-preview-border bg-[#FCFCFC] dark:border-preview-dark-border dark:bg-[#101010] lg:flex">
      <div className="border-b border-preview-border px-6 pb-5 pt-6 dark:border-preview-dark-border">
        <div className="">
          <Link
            href="/"
            className="text-[20px] font-semibold leading-none transition-opacity hover:opacity-70"
          >
            Laminar
          </Link>
          <span className="text-[14px] font-medium leading-5 text-gray-200 dark:text-gray-100">
            by{" "}
            <Link
              href="https://cajaun.com"
              className="transition-colors hover:text-black dark:hover:text-white"
            >
              Cajaun
            </Link>
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-6 py-6">
        {LAMINAR_NAV_GROUPS.map((group, groupIndex) => (
          <div key={group.title}>
            <p className="mb-2 text-[15px] font-semibold text-black dark:text-white">
              {group.title}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.path}>
                  <Link
                    href={getLaminarDocHref(item.path, pathname)}
                    data-active={item.path === docPath ? "true" : "false"}
                    className="flex h-8 w-[calc(100%+0.75rem)] -ml-2 items-center rounded-md px-2 text-[14px] font-medium text-gray-200 transition-colors hover:bg-gray-300 hover:text-black data-[active=true]:bg-gray-300 data-[active=true]:text-black dark:text-gray-100 hover:dark:bg-[#2A2A2A] hover:dark:text-white data-[active=true]:dark:bg-[#2A2A2A] data-[active=true]:dark:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            {groupIndex < LAMINAR_NAV_GROUPS.length - 1 ? (
              <div
                aria-hidden="true"
                className="mx-auto mb-5 mt-5 h-px w-[90%] bg-preview-border dark:bg-preview-dark-border"
              />
            ) : null}
          </div>
        ))}
      </nav>
    </aside>
  );
}
