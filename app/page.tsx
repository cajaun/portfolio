import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import HomeSections from "@/components/home/home-sections";
import { getBlogPostSummaries } from "@/data/blog";

export default async function Home() {
  const posts = await getBlogPostSummaries();

  return (
    <>
      <main className="mx-auto mb-14 flex w-full max-w-screen-sm flex-1 flex-col pb-8 pt-20">
        <div className="px-4">
          <Header />
        </div>
        <HomeSections posts={posts} />
      </main>
      <Footer />
    </>
  );
}
