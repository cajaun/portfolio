import type { ReactNode } from "react";

export default function LaminarDocsArticle({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <article className="laminar-docs prose max-w-none dark:prose-invert">
      {children}
    </article>
  );
}
