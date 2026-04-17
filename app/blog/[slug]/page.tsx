import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";
import { getBlogPostSummaries, getBlogPosts, getPost } from "@/data/blog";
import { SITE } from "@/data/site";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  props: PageProps,
): Promise<Metadata | undefined> {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) return;

  const {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;

  const ogImage = image
    ? `${SITE.url}${image}`
    : `${SITE.url}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${SITE.url}/blog/${post.slug}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Blog(props: PageProps) {
  const { slug } = await props.params;
  const [post, posts] = await Promise.all([
    getPost(slug),
    getBlogPostSummaries(),
  ]);

  if (!post) {
    notFound();
  }

  const PostContent = post.Component;
  const postIndex = posts.findIndex((entry) => entry.slug === slug);
  const nextPost = postIndex > 0 ? posts[postIndex - 1] : null;
  const previousPost =
    postIndex >= 0 && postIndex < posts.length - 1
      ? posts[postIndex + 1]
      : null;
  const hasAdjacentPosts = Boolean(previousPost || nextPost);

  return (
    <>
      <section
        id="blog"
        className="mx-auto mb-14 flex w-full max-w-screen-sm flex-1 flex-col px-4 pb-8 pt-20 dark:text-white"
      >
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.metadata.title,
              datePublished: post.metadata.publishedAt,
              dateModified: post.metadata.publishedAt,
              description: post.metadata.summary,
              image: post.metadata.image
                ? `${SITE.url}${post.metadata.image}`
                : `${SITE.url}/og?title=${encodeURIComponent(
                    post.metadata.title,
                  )}`,
              url: `${SITE.url}/blog/${post.slug}`,
              author: {
                "@type": "Person",
                name: SITE.name,
              },
            }),
          }}
        />
        <Header />
        <div
          className="mb-16 animate-slide-down-fade px-2"
          style={{ animationDelay: "180ms" }}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-medium">{post.metadata.title}</h2>
          </div>

          <div className="mt-4">
            <p className="text-gray-200 font-medium leading-6 tracking-[-0.1px] dark:text-gray-100">
              {post.metadata.summary}
            </p>
          </div>
        </div>

        <article className="blog-content prose dark:prose-invert ">
          <PostContent />
        </article>
      </section>
      {hasAdjacentPosts ? (
        <section className="mx-auto  w-full max-w-screen-sm px-4">
          <div
            className="animate-slide-down-fade px-2  dark:border-[#2C2C2B]"
            style={{ animationDelay: "360ms" }}
          >
            <div className="flex flex-col pb-4 gap-6 md:flex-row md:justify-between md:gap-10">
              {previousPost && (
                <div className="md:min-h-[3.5rem] min-w-0 flex-1">
                  <Link
                    href={`/blog/${previousPost.slug}`}
                    className="group block w-full  rounded-xl transition-opacity duration-300 hover:opacity-70"
                  >
                    <p className="text-sm font-medium text-gray-200 dark:text-gray-100">
                      Previous
                    </p>
                    <p className="text-sm font-medium text-black dark:text-white truncate">
                      {previousPost.title}
                    </p>
                  </Link>
                </div>
              )}

              {nextPost && (
                <div className="md:min-h-[3.5rem] ml-auto text-right min-w-0 flex-1">
                  <Link
                    href={`/blog/${nextPost.slug}`}
                    className="group block w-full rounded-xl transition-opacity duration-300 hover:opacity-70"
                  >
                    <p className="text-sm font-medium text-gray-200 dark:text-gray-100">
                      Next
                    </p>
                    <p className="text-sm font-medium text-black dark:text-white truncate">
                      {nextPost.title}
                    </p>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}
      <Footer />
    </>
  );
}
