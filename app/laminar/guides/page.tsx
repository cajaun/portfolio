import type { Metadata } from "next";
import LaminarDocsArticle from "@/components/laminar/docs-article";
import GuidesDocs from "@/components/laminar/docs/guides.mdx";

export const metadata: Metadata = {
  title: "Laminar Guides",
  description: "Guides for using Laminar in common interface patterns.",
};

export default function LaminarGuidesPage() {
  return (
    <LaminarDocsArticle>
      <GuidesDocs />
    </LaminarDocsArticle>
  );
}
