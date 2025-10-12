import { getBlogArticles, getMetaObject } from "@/lib/shopify";
import { MetaObject } from "@/lib/shopify/types";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Reveal } from "@/components/animation/Reveal";
import { Button } from "./Button";

export async function Blog() {
  let header: MetaObject | undefined;
  try {
    header = await getMetaObject("blog", "landing_page_section_headers");
  } catch {
    header = undefined;
  }

  const articles = await getBlogArticles();

  const mainHeader = header?.fields.find(
    (field) => field.key === "main_header"
  )?.value;
  const subHeader = header?.fields.find(
    (field) => field.key === "sub_header"
  )?.value;
  return (
    <div className="flex flex-col items-center gap-6 md:gap-12">
      <div className="flex max-w-[1170px] mx-auto flex-col justify-center items-center gap-3 md:gap-5">
        <h2 className="text-[26px] md:text-5xl font-black leading-[120%] text-[#101010] uppercase text-center font-playfair-display-sc">
          {mainHeader}
        </h2>
        <p className="text-center text-base md:text-xl font-normal leading-[150%] text-[#101010] max-w-[550px]">
          {subHeader}
        </p>
      </div>
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="pt-2 pb-4 md:pb-8">
          {articles.map((item) => (
            <CarouselItem
              key={item.id}
              className="md:basis-1/2 lg:basis-1/3 max-w-fit"
            >
              <Reveal>
                <Link href={`/blog/${item.handle}`} className="block">
                  <div className="flex max-w-[360px] md:max-w-[460px] flex-col items-start gap-4 md:gap-7.5 group">
                    <div className="h-[300px] md:h-[380px] w-full rounded-3xl bg-[#E3EAD5] overflow-hidden border border-[var(--cta-border)]">
                      <Image
                        src={item.image.url}
                        alt={item.image.altText || item.title}
                        width={460}
                        height={380}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex flex-col items-start gap-4 md:gap-5">
                      <div className="flex flex-col items-start gap-2.5 md:gap-4">
                        <p className="text-lg md:text-2xl font-semibold leading-[120%] uppercase text-[#101010] group-hover:text-[#1D431D] transition-colors line-clamp-2">
                          {item.title}
                        </p>
                        <p className="text-base md:text-lg font-normal leading-[150%] text-[#101010] line-clamp-3">
                          {item.excerpt}
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
              </Reveal>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="mt-2 sm:mt-3 w-full flex items-center justify-between gap-3">
          <CarouselPrevious className="static top-auto left-auto right-auto translate-y-0 rotate-0 h-12 sm:h-14 px-6 sm:px-7 rounded-2xl border bg-[var(--cta-bg)] text-[var(--cta-border)] border-[var(--cta-border)] shadow-[0_4px_14px_0_rgba(0,0,0,0.10)]" />
          <Button
            title="All posts"
            link="/blog"
            className="gap-4 border-2"
          />
          <CarouselNext className="static top-auto left-auto right-auto translate-y-0 rotate-0 h-12 sm:h-14 px-6 sm:px-7 rounded-2xl border bg-[var(--cta-bg)] text-[var(--cta-border)] border-[var(--cta-border)] shadow-[0_4px_14px_0_rgba(0,0,0,0.10)]" />
        </div>
      </Carousel>
    </div>
  );
}
