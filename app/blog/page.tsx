import { BlogList } from "@/components/blog/BlogList";
import { CompanyPage } from "@/components/landing-page/CompanyPage";
import { getBlogArticlesByBlog } from "@/lib/shopify";
import { Reveal } from "@/components/animation/Reveal";
import { slowUp } from "@/lib/animation";
// no accent container needed here; cards already handle styling

export default async function BlogPage() {
  //   const featuredArticles = await getBlogArticles({ first: 3 });

  const allArticles = await getBlogArticlesByBlog("flower", 50); // Get up to 50 articles

  return (
    <CompanyPage title="Blog">
      <Reveal variants={slowUp} amount={0.05}>
        <BlogList articles={allArticles} />
      </Reveal>
    </CompanyPage>
  );
}

