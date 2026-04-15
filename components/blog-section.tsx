import { getBlogPostSummaries } from "@/data/blog";
import Link from "next/link";

export default async function BlogSection() {
  const posts = await getBlogPostSummaries();

  return (
    <div>
      {posts.map((post) => (
        <Link key={post.slug} href={`/blog/${post.slug}`}>
          <div className="w-full flex justify-between items-center hover:bg-gray-300 transition-colors duration-500 ease-in-out py-4 rounded-xl px-4 text-gray-200 hover:dark:bg-[#2A2A2A] hover:text-black hover:dark:text-white dark:text-gray-100">
            <p className="font-medium">{post.title}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
