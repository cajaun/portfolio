import { getBlogPosts } from "@/data/blog";
import Link from "next/link";

type PostMetadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
};

type Post = {
  slug: string;
  metadata: PostMetadata;
  source: string;
};

export default async function BlogSection() {

  const postsRaw = await getBlogPosts();


  const posts = postsRaw.map((post) => ({
    ...post,
    metadata: {
      title: String(post.metadata.title),
      publishedAt: String(post.metadata.publishedAt),
      summary: String(post.metadata.summary),
      image: post.metadata.image ? String(post.metadata.image) : undefined,
    },
  })) as Post[];

  const sortedPosts = posts.sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime()
  );

  return (
    <div>
      {sortedPosts.map((post) => (
        <Link key={post.slug} href={`/blog/${post.slug}`} passHref>
         <div className="w-full flex justify-between items-center hover:bg-gray-300 transition-colors duration-200 py-4 rounded-xl px-4 text-gray-200 hover:dark:bg-[#191918] hover:text-black hover:dark:text-white dark:text-gray-100" >
            <p className="font-medium">{post.metadata.title}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
