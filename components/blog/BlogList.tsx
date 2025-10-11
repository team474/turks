import { BlogArticle } from "@/lib/shopify/types";
import Link from "next/link";

interface BlogListProps {
  articles: BlogArticle[];
}

export function BlogList({ articles }: BlogListProps) {
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-gray-600">No blog articles found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {articles.map((article) => {
        return (
          <Link
            key={article.id}
            href={`/blog/${article.handle}`}
            className="block"
          >
            <div className="flex max-w-[295px] md:max-w-[370px] flex-col items-start gap-4 md:gap-7.5 group h-full justify-between">
              <div className="h-[215px] md:h-[270px] w-full rounded-3xl bg-[#E3EAD5] overflow-hidden ">
                <img
                  src={article.image.url}
                  alt={article.image.altText || article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex flex-col items-start gap-4 md:gap-5">
                <div className="flex flex-col items-start gap-2.5 md:gap-4">
                  <p className="text-lg md:text-2xl font-semibold leading-[120%] uppercase text-[#101010] group-hover:text-[#1D431D] transition-colors line-clamp-2">
                    {article.title}
                  </p>
                  <p className="text-base md:text-lg font-normal leading-[150%] text-[#101010] line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                <span className="w-full h-px bg-[#EEE]"></span>

                <div className="flex items-center gap-3 text-sm md:text-base font-bold leading-[150%] uppercase text-[#1D431D] group-hover:text-[#2D5A2D] transition-colors">
                  Read More{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="size-4 md:size-6 group-hover:translate-x-1 transition-transform"
                  >
                    <path
                      d="M14 16L18 12M18 12L14 8M18 12L6 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
