import { BlogList } from "@/components/blog/BlogList";
import { Icon } from "@/components/Icons";
import { CompanyPage } from "@/components/landing-page/CompanyPage";
import { getBlogArticlesByBlog } from "@/lib/shopify";
// no accent container needed here; cards already handle styling

export default async function BlogPage() {
  //   const featuredArticles = await getBlogArticles({ first: 3 });

  const allArticles = await getBlogArticlesByBlog("flower", 50); // Get up to 50 articles

  return (
    <CompanyPage title="Blog">
      <div className="relative flex flex-col items-center gap-6 md:gap-12">
        {/* Decorative icons */}
        <Icon.leafIcon className="absolute top-0 right-5 size-13 z-0 pointer-events-none opacity-80 hidden md:flex" />
        <Icon.pipeIcon className="absolute -top-5 left-5 w-20 z-0 pointer-events-none opacity-80 hidden md:flex" />

        <div className="w-full max-w-[1170px] mx-auto">
          <BlogList articles={allArticles} />
        </div>
      </div>
    </CompanyPage>
  );
}

