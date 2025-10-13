import type { Metadata } from "next";
import type { CSSProperties } from "react";

import { getPage } from "lib/shopify";
import { notFound } from "next/navigation";
import { CompanyPage } from "@/components/landing-page/CompanyPage";
import { ProseReveal } from "@/components/blog/ProseReveal";
import { mixWithBlack, mixWithWhite, saturateHex } from "@/lib/color";

export async function generateMetadata(props: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = await getPage(params.page);

  if (!page) return notFound();

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.bodySummary,
    openGraph: {
      publishedTime: page.createdAt,
      modifiedTime: page.updatedAt,
      type: "article",
    },
  };
}

export default async function Page(props: {
  params: Promise<{ page: string }>;
}) {
  const params = await props.params;
  const page = await getPage(params.page);

  if (!page) return notFound();

  // Brand-muted accents matching blog detail page
  const baseBrand = "#1D431D";
  const accentBg = mixWithWhite(baseBrand, 92);
  const accentBorder = saturateHex(mixWithBlack(baseBrand, 72), 24);
  const accentText = saturateHex(mixWithBlack(baseBrand, 60), 32);
  const pageVars = {
    "--page-bg": accentBg,
    "--page-border": accentBorder,
    "--page-text": accentText,
  } as CSSProperties;

  return (
    <CompanyPage title={page.title}>
      <div className="flex flex-col gap-6 md:gap-8 w-full max-w-[1170px] mx-auto">
        {/* Header with accent */}
        <div className="flex flex-col gap-4 md:gap-5 items-center md:items-start">
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-12 rounded-full bg-[var(--page-text)]" style={pageVars} />
            <h1 className="text-2xl md:text-4xl font-black leading-[120%] text-[#101010] uppercase font-playfair-display-sc">
              {page.title}
            </h1>
            <span className="h-[2px] w-12 rounded-full bg-[var(--page-text)]" style={pageVars} />
          </div>
          {page.bodySummary && (
            <div className="relative pl-4 md:pl-5 border-l-2 border-[var(--page-text)] max-w-[72ch]" style={pageVars}>
              <p className="text-base md:text-lg font-normal leading-[160%] text-[#101010]/90 italic">
                {page.bodySummary}
              </p>
            </div>
          )}
        </div>

        {/* Content card */}
        <div
          className="w-full rounded-3xl overflow-hidden border-[0.5px] border-[var(--page-border)] bg-[var(--page-bg)] shadow-[0_6px_24px_rgba(0,0,0,0.08)] p-6 md:p-8 lg:p-12 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
          style={pageVars}
        >
          <ProseReveal
            html={page.body}
            className="prose w-full max-w-[72ch] mx-auto text-base md:text-[17px] leading-[1.75] md:leading-[1.8] text-black prose-headings:font-bold prose-headings:text-black prose-headings:mt-8 prose-headings:mb-4 prose-h1:text-2xl prose-h2:text-[22px] md:prose-h2:text-[24px] prose-h3:text-lg prose-h4:text-base prose-h5:text-sm prose-h6:text-xs prose-a:text-black prose-a:underline prose-a:hover:text-neutral-300 prose-strong:text-black prose-strong:font-semibold prose-ol:mt-6 prose-ol:mb-6 prose-ol:list-decimal prose-ol:pl-6 prose-ul:mt-6 prose-ul:mb-6 prose-ul:list-disc prose-ul:pl-6 prose-img:w-full prose-img:max-h-[400px] prose-img:object-contain prose-img:rounded-2xl prose-img:my-8 prose-p:mb-5 md:prose-p:mb-6 prose-p:leading-[1.75] md:prose-p:leading-[1.8]"
          />
        </div>
      </div>
    </CompanyPage>
  );
}
