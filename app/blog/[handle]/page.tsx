import { Icon } from "@/components/Icons";
import { getBlogArticle, getBlogArticles } from "@/lib/shopify";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProseReveal } from "@/components/blog/ProseReveal";
import { mixWithBlack, mixWithWhite, saturateHex } from "@/lib/color";
import type { CSSProperties } from "react";

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

  // Brand-muted accents
  const baseBrand = "#1D431D";
  const accentBg = mixWithWhite(baseBrand, 92);
  const accentBorder = saturateHex(mixWithBlack(baseBrand, 72), 24);
  const accentText = saturateHex(mixWithBlack(baseBrand, 60), 32);
  const sidebarVars = {
    "--sidebar-bg": accentBg,
    "--sidebar-border": accentBorder,
    "--sidebar-text": accentText,
  } as CSSProperties;

  return (
    <div className="max-w-[1170px] mx-auto p-6 lg:p-4 xl:px-0 lg:py-18 flex flex-col gap-8 md:gap-16">
      <div className="relative justify-center items-center gap-4 md:gap-6 flex flex-col">
        <h1 className="text-[26px] md:text-5xl leading-[120%] text-[#101010] uppercase text-center font-vast-shadow z-10">
          {article.title}
        </h1>
        <span className="h-[2px] w-16 rounded-full bg-[var(--sidebar-text)] z-10" style={sidebarVars} />
        <p className="oi-regular absolute left-1/2 -translate-x-1/2 -bottom-28 md:-bottom-60 md:text-[220px] text-[100px] font-normal leading-[120%] text-[#101010] uppercase text-center opacity-[0.015] md:opacity-[0.02] pointer-events-none select-none z-0">
          turk&apos;s
        </p>
        <Icon.leafIcon className="hidden md:flex absolute top-3.5 left-2 lg:top-[24px] sm:left-5 size-12 md:size-18 z-0 pointer-events-none opacity-80" />
        <Icon.smokeIcon className="hidden md:flex absolute top-2 -right-3 lg:-top-5 sm:right-5 w-14 h-18 md:w-30 md:h-37 z-0 pointer-events-none opacity-80" />
      </div>

      <div className="flex flex-col lg:flex-row gap-7.5">
        <div className="flex-1 flex flex-col items-start gap-6 md:gap-8">
          {article.image && (
            <div className="w-full max-h-[400px] rounded-3xl overflow-hidden border-[0.5px] shadow-[0_6px_24px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 flex justify-center items-center" style={{ borderColor: accentBorder }}>
              <Image
                src={article.image.url}
                alt={article.image.altText || article.title}
                width={article.image.width}
                height={article.image.height}
                className="object-cover w-full h-full transition-transform duration-500 ease-out hover:scale-[1.02]"
                priority
              />
            </div>
          )}

          <div className="flex flex-col gap-4 md:gap-5 w-full">
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-8 rounded-full bg-[var(--sidebar-text)]" style={sidebarVars} />
              <span className="text-sm font-normal leading-[150%] text-[#101010] uppercase tracking-wide">
                {publisheddate(article.publishedAt)}
              </span>
            </div>
            <h2 className="text-2xl md:text-[32px] leading-[120%] uppercase font-vast-shadow text-[#101010]">
              {article.title}
            </h2>
            <div className="relative pl-4 md:pl-5 border-l-2 border-[var(--sidebar-text)]" style={sidebarVars}>
              <p className="text-lg md:text-xl font-normal leading-[160%] text-[#101010]/90 italic">
                {article.excerpt}
              </p>
            </div>
          </div>

          <ProseReveal
            html={article.contentHtml}
            className="prose w-full max-w-[72ch] text-base md:text-[17px] leading-[1.75] md:leading-[1.8] text-black prose-headings:font-bold prose-headings:text-black prose-headings:mt-8 prose-headings:mb-4 prose-h1:text-2xl prose-h2:text-[22px] md:prose-h2:text-[24px] prose-h3:text-lg prose-h4:text-base prose-h5:text-sm prose-h6:text-xs prose-a:text-black prose-a:underline prose-a:hover:text-neutral-300 prose-strong:text-black prose-strong:font-semibold prose-ol:mt-6 prose-ol:mb-6 prose-ol:list-decimal prose-ol:pl-6 prose-ul:mt-6 prose-ul:mb-6 prose-ul:list-disc prose-ul:pl-6 prose-img:w-full prose-img:max-h-[400px] prose-img:object-contain prose-img:rounded-2xl prose-img:my-8 prose-p:mb-5 md:prose-p:mb-6 prose-p:leading-[1.75] md:prose-p:leading-[1.8]"
          />
        </div>

        <div
          className="flex lg:max-w-[370px] w-full h-fit flex-col items-start gap-6 bg-[var(--sidebar-bg)] border-[0.5px] border-[var(--sidebar-border)] p-5 md:p-6 rounded-3xl shadow-[0_6px_24px_rgba(0,0,0,0.08)]"
          style={sidebarVars}
        >
          <p className="text-2xl leading-[120%] uppercase font-vast-shadow text-[#101010]">
            Recent Blogs{" "}
          </p>

          <div className="flex flex-col items-start gap-5 w-full">
            {featuredArticles.map((item) => (
              <Link
                key={item.id}
                href={`/blog/${item.handle}`}
                className="group flex items-center gap-4 w-full p-2 rounded-xl transition-all duration-300 hover:bg-white/50 hover:-translate-y-0.5"
              >
                <div className="size-20 rounded-xl overflow-hidden border-[0.5px] border-[var(--sidebar-border)] shrink-0">
                  <Image src={item.image.url} alt={item.image.altText || item.title} width={80} height={80} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center gap-4 flex-1">
                  <p className="text-sm font-medium leading-[150%] text-[#101010]">
                    {item.title}
                  </p>
                  <div className="flex justify-between items-center w-full ">
                    <span className="text-sm font-normal leading-[150%] text-[#101010]">
                      {publisheddate(article.publishedAt)}
                    </span>
                    <Icon.goToArrowIcon className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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

