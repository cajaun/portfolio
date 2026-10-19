"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function ArticleContent({ children }: { children: ReactNode }) {
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const article = articleRef.current;

    if (!article) {
      return;
    }

    Array.from(article.children).forEach((child, index) => {
      (child as HTMLElement).style.setProperty("--i", String(index));
    });
  }, [children]);

  return (
    <article
      ref={articleRef}
      className="blog-content prose dark:prose-invert"
    >
      {children}
    </article>
  );
}
