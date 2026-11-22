"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function ArticleContent({ children }: { children: ReactNode }) {
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const article = articleRef.current;

    if (!article) {
      return;
    }

    const children = Array.from(article.children);

    children.forEach((child, index) => {
      (child as HTMLElement).style.setProperty("--i", String(index));
    });

    const root = document.documentElement;
    root.style.setProperty("--article-count", String(children.length));

    return () => {
      root.style.removeProperty("--article-count");
    };
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
