import Header from "@/components/ui/header";
import { TabBar } from "@/components/ui/tabs/tabs";
import { getBlogPosts } from "@/data/blog";
import Link from "next/link";

export const metadata = {
  title: "Blog",
  description: "My thoughts on software development, life, and more.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  const sortedPosts = posts.sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime()
  );

  const postsByYear = sortedPosts.reduce<Record<string, typeof posts>>(
    (acc, post) => {
      const year = new Date(post.metadata.publishedAt).getFullYear().toString();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(post);
      return acc;
    },
    {}
  );

  return (
    <>
    <section className="mx-auto mb-14 flex w-full max-w-screen-sm flex-1 flex-col pb-8 pt-20 dark:text-white">

    <div className = "px-4">
    <Header />
    </div>
  

      <TabBar />

      {Object.entries(postsByYear).map(([year, postsInYear]) => (
        <div key={year} className="animate-slide-down-fade px-4" style={{ animationDelay: "270ms" }}>
          <h2 className="font-bold  px-4 text-lg mb-4 ">{year}</h2>

          {postsInYear.map((post) => (
            <Link
              key={post.slug}
              className="flex flex-col "
              href={`/blog/${post.slug}`}
            >
               <div className="w-full flex justify-between items-center hover:bg-gray-300 transition-colors duration-200 py-4 rounded-xl px-4 text-gray-200 hover:dark:bg-[#191918] hover:text-black hover:dark:text-white dark:text-gray-100">
                <h2 className="font-medium ">{post.metadata.title}</h2>
                <p className=" font-medium">
                  {new Date(post.metadata.publishedAt).toLocaleString(
                    "default",
                    {
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ))}


    </section>

  </>
  );
}
