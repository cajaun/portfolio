import type { Metadata } from "next";
import LaminarDocsArticle from "@/components/laminar/docs-article";
import MotionDocs from "@/components/laminar/docs/motion.mdx";

export const metadata: Metadata = {
  title: "Laminar Motion",
  description: "Animation presets, duration, and stagger options for Laminar.",
};

export default function LaminarMotionPage() {
  return (
    <LaminarDocsArticle>
      <MotionDocs />
    </LaminarDocsArticle>
  );
}
