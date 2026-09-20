import type { Metadata } from "next";
import LaminarDocsArticle from "@/components/laminar/docs-article";
import StylingDocs from "@/components/laminar/docs/styling.mdx";

export const metadata: Metadata = {
  title: "Laminar Styling",
  description: "Styling, alignment, and layout options for Laminar.",
};

export default function LaminarStylingPage() {
  return (
    <LaminarDocsArticle>
      <StylingDocs />
    </LaminarDocsArticle>
  );
}
