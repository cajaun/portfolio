import type { Metadata } from "next";
import LaminarDocsArticle from "@/components/laminar/docs-article";
import VariantsDocs from "@/components/laminar/docs/variants.mdx";

export const metadata: Metadata = {
  title: "Laminar Variants",
  description: "Text, number, and slots variants for Laminar.",
};

export default function LaminarVariantsPage() {
  return (
    <LaminarDocsArticle>
      <VariantsDocs />
    </LaminarDocsArticle>
  );
}
