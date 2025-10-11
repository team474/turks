import { BlogList } from "@/components/blog/BlogList";
import { Icon } from "@/components/Icons";
import { CompanyPage } from "@/components/landing-page/CompanyPage";
import { getBlogArticlesByBlog } from "@/lib/shopify";

export default async function BlogPage() {
  //   const featuredArticles = await getBlogArticles({ first: 3 });

  const allArticles = await getBlogArticlesByBlog("flower", 50); // Get up to 50 articles

  return (
    <CompanyPage title="Blog" path="Blog">
      <div className="relative flex flex-col items-center gap-6 md:gap-12">
        <div className="flex max-w-[1170px] mx-auto flex-col justify-center items-center gap-3 md:gap-5">
          <h2 className="text-[26px] md:text-5xl font-black leading-[120%] text-[#101010] uppercase text-center font-playfair-display-sc">
            All Blogs
          </h2>
        </div>
        <Icon.leafIcon className="hidden md:flex absolute top-0 right-5 size-13" />
        <Icon.pipeIcon className="hidden md:flex absolute -top-5 left-5 w-20" />
        <BlogList articles={allArticles} />
      </div>
    </CompanyPage>
  );
}

