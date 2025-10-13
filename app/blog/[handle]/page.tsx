import { Icon } from "@/components/Icons";
import { getBlogArticle, getBlogArticles } from "@/lib/shopify";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface BlogPostPageProps {
  params: Promise<{
    handle: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { handle } = await params;
  const article = await getBlogArticle(handle);
  const featuredArticles = await getBlogArticles({ first: 5 });

  if (!article) {
    console.log("Article not found, redirecting to 404");
    notFound();
  }

  const publisheddate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-[1170px] mx-auto p-6 lg:p-4 xl:px-0 lg:py-18 flex flex-col gap-10 md:gap-30">
      <div className="relative justify-center items-center gap-3 md:gap-8 flex flex-col">
        <h1 className="text-[26px] md:text-5xl leading-[120%] text-[#101010] uppercase text-center font-vast-shadow">
          {article.title}
        </h1>
        <div className="flex gap-3 z-10">
          <Link
            href={"/"}
            className="text-base font-medium leading-[150%] text-[#101010]"
          >
            Home
          </Link>
          <span className="text-base font-medium leading-[150%] text-[#101010]">
            /
          </span>
          <Link
            href={"/blog"}
            className="text-base font-medium leading-[150%] text-[#101010]"
          >
            Blog
          </Link>
          <span className="text-base font-medium leading-[150%] text-[#101010]">
            /
          </span>
          <p className="text-base font-bold leading-[150%] text-[#101010] line-clamp-1">
            {article.handle}
          </p>
        </div>
        <p className="oi-regular absolute left-1/2 -translate-x-1/2 -bottom-28 md:-bottom-60 md:text-[220px] text-[100px] font-normal leading-[120%] text-[#101010] uppercase text-center opacity-2">
          turk&apos;s
        </p>
        <Icon.leafIcon className="hidden md:flex absolute top-3.5 left-2 lg:top-[24px] sm:left-5 size-12 md:size-18" />
        <Icon.smokeIcon className="hidden md:flex absolute top-2 -right-3 lg:-top-5 sm:right-5 w-14 h-18 md:w-30 md:h-37" />
      </div>

      <div className="flex flex-col lg:flex-row gap-7.5">
        <div className="flex-1 flex flex-col items-start gap-8">
          {article.image && (
            <div className="w-full max-h-[400px] rounded-2xl flex justify-center items-center">
              <Image
                src={article.image.url}
                alt={article.image.altText || article.title}
                width={article.image.width}
                height={article.image.height}
                className="object-cover rounded-2xl"
                priority
              />
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-start gap-1.5">
              <span className="text-sm font-normal leading-[150%] text-[#101010] uppercase">
                {publisheddate(article.publishedAt)}
              </span>
              <h1 className="text-[32px] leading-[120%] uppercase font-vast-shadow text-[#101010]">
                {article.title}
              </h1>
            </div>
            <p className="text-xl font-normal leading-[150%] text-[#101010]">
              {article.excerpt}
            </p>
          </div>

          <div
            className="prose w-full max-w-full text-base leading-7 text-black prose-headings:font-bold prose-headings:text-black prose-h1:text-2xl prose-h2:text-[24px] prose-h3:text-lg prose-h4:text-base prose-h5:text-sm prose-h6:text-xs prose-a:text-black prose-a:underline prose-a:hover:text-neutral-300 prose-strong:text-black prose-ol:mt-4 prose-ol:list-decimal prose-ol:pl-6 prose-ul:mt-4 prose-ul:list-disc prose-ul:pl-6 prose-img:w-full prose-img:max-h-[400px] prose-img:object-contain"
            dangerouslySetInnerHTML={{ __html: article.contentHtml }}
          />
        </div>

        <div className="flex lg:max-w-[370px] w-full h-fit flex-col items-start gap-6 bg-[#E3EAD5] p-5 rounded-[20px]">
          <p className="text-2xl leading-[120%] uppercase font-vast-shadow text-[#101010]">
            Recent Blogs{" "}
          </p>

          <div className="flex flex-col items-start gap-5 w-full">
            {featuredArticles.map((item) => (
              <Link
                key={item.id}
                href={`/blog/${item.handle}`}
                className="flex items-center gap-4 w-full"
              >
                <div className="size-20 rounded-[10px]">
                  <img src={item.image.url} alt={item.image.altText} />
                </div>
                <div className="flex flex-col justify-center gap-4 flex-1">
                  <p className="text-sm font-medium leading-[150%] text-[#101010]">
                    {item.title}
                  </p>
                  <div className="flex justify-between items-center w-full ">
                    <span className="text-sm font-normal leading-[150%] text-[#101010]">
                      {publisheddate(article.publishedAt)}
                    </span>
                    <Icon.goToArrowIcon />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { handle } = await params;
  const article = await getBlogArticle(handle);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.image ? [article.image.url] : [],
    },
  };
}

