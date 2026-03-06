import fs from "fs";
import path from "path";
import { ComponentType } from "react";

export type PostMetadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
};

type PostModule = {
  default: ComponentType;
  metadata: PostMetadata;
};

export type Post = {
  slug: string;
  metadata: PostMetadata;
  Component: PostModule["default"];
};

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

export async function getPost(slug: string): Promise<Post | null> {
  const filePath = path.join(process.cwd(), "content", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const postModule = (await import(`@/content/${slug}.mdx`)) as PostModule;

  return {
    slug,
    metadata: postModule.metadata,
    Component: postModule.default,
  };
}

export async function getBlogPosts(): Promise<Post[]> {
  const mdxFiles = getMDXFiles(path.join(process.cwd(), "content"));
  const slugs = mdxFiles.map((file) => path.basename(file, ".mdx"));

  const posts = await Promise.all(slugs.map((slug) => getPost(slug)));
  return posts.filter((post): post is Post => post !== null);
}

export function getBlogPostCount() {
  const contentDir = path.join(process.cwd(), "content");
  const files = fs.readdirSync(contentDir);
  return files.filter((file) => path.extname(file) === ".mdx").length;
}
