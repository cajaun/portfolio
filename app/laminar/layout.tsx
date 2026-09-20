import type { ReactNode } from "react";
import Footer from "@/components/ui/footer";
import LaminarSidebar from "@/components/laminar/sidebar";
import LaminarRightSidebar from "@/components/laminar/right-sidebar";

export default function LaminarLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[672px] lg:grid lg:max-w-[1222px] lg:grid-cols-[275px_minmax(0,672px)_275px]">
      <LaminarSidebar />
      <div className="mx-auto w-full max-w-[672px] min-w-0">
        <main className="mb-14 flex w-full flex-1 flex-col pb-8 pt-20 dark:text-white">
          {children}
        </main>
        <Footer />
      </div>
      <LaminarRightSidebar />
    </div>
  );
}
