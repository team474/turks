import type { Metadata } from "next";

import { getPage } from "lib/shopify";
import { notFound } from "next/navigation";
import { CompanyPage } from "@/components/landing-page/CompanyPage";

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

  return (
    <CompanyPage title={page.title}>
      <div className="flex p-6 items-center gap-8 rounded-2xl bg-[#DBEEC8] z-10">
        <div
          className="prose w-full max-w-full text-base leading-7 text-black prose-headings:font-bold prose-headings:text-black prose-h1:text-2xl prose-h2:text-xl prose-h3:text-xl prose-h4:text-xl prose-h5:text-xl prose-h6:text-lg prose-a:text-black prose-a:underline prose-a:hover:text-neutral-300 prose-strong:text-black prose-ol:mt-4 prose-ol:list-decimal prose-ol:pl-6 prose-ul:mt-4 prose-ul:list-disc prose-ul:pl-6"
          dangerouslySetInnerHTML={{ __html: page.body }}
        />
      </div>
    </CompanyPage>
  );
}
