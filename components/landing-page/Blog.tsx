import { getBlogArticles, getMetaObject } from "@/lib/shopify";
import { MetaObject } from "@/lib/shopify/types";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { mixWithBlack, mixWithWhite, saturateHex } from "@/lib/color";
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
  // Muted, brand-forward accent variables (inspired by StrainMetaCard but toned down)
  const baseBrand = "#1D431D";
  const blogAccentBg = mixWithWhite(baseBrand, 92);
  const blogAccentBorder = saturateHex(mixWithBlack(baseBrand, 72), 24);
  const blogAccentText = saturateHex(mixWithBlack(baseBrand, 60), 32);
  const accentVars = {
    "--blog-accent-bg": blogAccentBg,
    "--blog-accent-border": blogAccentBorder,
    "--blog-accent-text": blogAccentText,
  } as CSSProperties;

  return (
    <div className="flex flex-col items-center gap-6 md:gap-12" style={accentVars}>
      <div className="w-full max-w-[1170px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-4 md:gap-6">
        <div className="flex flex-col gap-3 md:gap-5">
          <h2 className="text-[26px] md:text-5xl font-black leading-[120%] text-[#101010] uppercase text-center md:text-left font-playfair-display-sc">
            {mainHeader}
          </h2>
          <p className="text-center md:text-left text-base md:text-xl font-normal leading-[150%] text-[#101010] max-w-[650px]">
            {subHeader}
          </p>
        </div>
        <div className="justify-self-center md:justify-self-end">
          <Button
            title="All posts"
            link="/blog"
            className="gap-4 border-2"
            style={{
              background: blogAccentBg,
              borderColor: blogAccentBorder,
              color: blogAccentText,
            }}
          />
        </div>
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
            <CarouselItem key={item.id}>
              <Reveal>
                <Link href={`/blog/${item.handle}`} className="block">
                  <article className="group relative mx-auto w-full max-w-[1170px] rounded-3xl border bg-[var(--blog-accent-bg)] border-[var(--blog-accent-border)] overflow-hidden shadow-[0_6px_24px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
                    {/* Grid layout for md+; mobile uses overlay style */}
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      {/* Image area */}
                      <div className="relative h-[280px] sm:h-[340px] md:h-auto md:min-h-[420px]">
                        {item.image?.url ? (
                          <>
                            <Image
                              src={item.image.url}
                              alt={item.image.altText || item.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                              priority={false}
                            />
                            {/* Mobile gradient for contrast */}
                            <div className="md:hidden absolute inset-0 pointer-events-none" aria-hidden>
                              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                            </div>
                          </>
                        ) : (
                          <div className="absolute inset-0 bg-[var(--blog-accent-bg)]" />
                        )}
                      </div>

                      {/* Text panel */}
                      <div className="relative md:flex md:items-center">
                        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 md:static md:p-8 lg:p-12 flex flex-col gap-3 sm:gap-4 md:gap-6">
                          <div className="md:bg-transparent md:backdrop-blur-0 bg-[var(--blog-accent-bg)]/85 backdrop-blur-sm md:rounded-none rounded-2xl md:border-0 border border-[var(--blog-accent-border)] md:p-0 p-4">
                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-[120%] text-[#101010] line-clamp-2">
                              {item.title}
                            </h3>
                            <p className="mt-2 text-base md:text-lg font-normal leading-[150%] text-[#101010]/90 line-clamp-3">
                              {item.excerpt}
                            </p>
                            <div className="mt-5">
                              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border bg-[var(--blog-accent-bg)] text-[var(--blog-accent-text)] border-[var(--blog-accent-border)] shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-0.5">
                                <span className="text-sm md:text-base font-extrabold uppercase tracking-wide">Read More</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  className="size-5 md:size-6 transition-transform duration-300 group-hover:translate-x-1"
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
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              </Reveal>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Outside arrows */}
        <CarouselPrevious className="bg-[var(--blog-accent-bg)] text-[var(--blog-accent-text)] border-[var(--blog-accent-border)]" />
        <CarouselNext className="bg-[var(--blog-accent-bg)] text-[var(--blog-accent-text)] border-[var(--blog-accent-border)]" />

      </Carousel>
    </div>
  );
}
