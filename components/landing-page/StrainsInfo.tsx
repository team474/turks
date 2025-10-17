'use client'

import { Metafield, Product } from "@/lib/shopify/types";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { mixWithBlack, saturateHex, mixWithWhite, hexToRgb, gradientAround } from "@/lib/color";
import Image from "next/image";
import { Button } from "./Button";
import { useEffect, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { listItemSlow } from "@/lib/animation";
import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogTitle } from "@/components/ui/dialog";

interface infoProps {
  product: Product[];
}

export function StrainsInfo({ product }: infoProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  function transformProductsToStrains(products: Product[]): Array<{
    name: string;
    type: string;
    flavor: string[];
    description: string;
    image: string;
    color: string;
    concentration?: string;
    indica?: string;
    sativa?: string;
  }> {
    return products?.map((product: Product) => {
      // Find metafields with proper type safety
      const caseColorMetafield = product.metafields?.find((mf: Metafield) => mf.key === 'case_color');
      const terpenesMetafield = product.metafields?.find((mf: Metafield) => mf.key === 'terpenes');
      const category = product.metafields?.find((mf: Metafield) => mf.key === 'category');
      const concentration = product.metafields?.find((mf: Metafield) => mf.key === 'concentration')?.value;
      const indica = product.metafields?.find((mf: Metafield) => mf.key === 'indica')?.value;
      const sativa = product.metafields?.find((mf: Metafield) => mf.key === 'sativa')?.value;

      // Parse terpenes from metafield
      let terpenes: string[] = [];
      if (terpenesMetafield?.value) {
        try {
          terpenes = JSON.parse(terpenesMetafield.value) as string[];
        } catch (e) {
          console.warn(`Failed to parse terpenes for ${product.title}:`, e);
        }
      }

      // Get the category value as string, not the entire metafield object
      const productType = category?.value || product.options?.[0]?.values?.[0] || "Default Title";

      // Get featured image or first image as fallback
      const productImage = product.featuredImage?.url || product.images?.[0]?.url || "";

      return {
        name: product.title,
        type: productType, // Now this is a string, not a Metafield object
        flavor: terpenes,
        description: product.description,
        image: productImage,
        color: caseColorMetafield?.value || "#FFFFFF",
        concentration,
        indica,
        sativa,
      };
    });
  }

  const strainsList = transformProductsToStrains(product);

  // Active/centered item colors for CTA and controls
  const activeBase = strainsList?.[activeIndex]?.color || "#1D431D";
  const ctaBg = mixWithWhite(activeBase, 20);
  const ctaText = saturateHex(mixWithBlack(activeBase, 68), 38);
  const ctaStyleVars = {
    "--cta-bg": ctaBg,
    "--cta-border": ctaText,
  } as CSSProperties;

  useEffect(() => {
    const scope = document.querySelector('[data-scope="strains-info"]') as HTMLElement | null;
    const track = scope?.querySelector('[data-slot="carousel-content"] > div') as HTMLElement | null;
    if (!track) return;
    const handler = () => {
      const items = Array.from(track.children) as HTMLElement[];
      const center = window.innerWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      items.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        const elCenter = rect.left + rect.width / 2;
        const dist = Math.abs(elCenter - center);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActiveIndex(best);
    };
    handler();
    const obs = new MutationObserver(handler);
    obs.observe(track, { attributes: true, childList: false });
    window.addEventListener('resize', handler);
    return () => {
      obs.disconnect();
      window.removeEventListener('resize', handler);
    };
  }, [strainsList]);

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full px-3 sm:px-4"
      style={ctaStyleVars}
      data-scope="strains-info"
    >
      <CarouselContent className="pt-2 pb-4 md:pb-8">
        {strainsList && strainsList.map((item, index) => {
          const baseColor = item.color || "#FFFFFF";
          const panelDarker = mixWithBlack(baseColor, 27);
          const panelColor = saturateHex(panelDarker, 30);
          const borderColor = panelColor;
          const textIconDarker = mixWithBlack(baseColor, 68);
          const textIconColor = saturateHex(textIconDarker, 38);
          const arrowBorder = textIconColor;
          const arrowBg = mixWithWhite(baseColor, 70);
          const parsePct = (v?: string) => {
            if (!v) return null;
            const cleaned = v.replace(/[^0-9.]/g, '');
            const num = parseFloat(cleaned);
            return Number.isFinite(num) ? num : null;
          };
          const thc = parsePct(item.concentration);
          let indica = parsePct(item.indica);
          let sativa = parsePct(item.sativa);
          if (indica !== null && (sativa === null || !Number.isFinite(sativa))) sativa = Math.max(0, Math.min(100, 100 - indica));
          if (sativa !== null && (indica === null || !Number.isFinite(indica))) indica = Math.max(0, Math.min(100, 100 - sativa));
          if (indica !== null && sativa !== null) {
            const sum = indica + sativa;
            if (sum > 0 && sum !== 100) {
              indica = (indica / sum) * 100;
              sativa = (sativa / sum) * 100;
            }
          }
          const rgb = hexToRgb(baseColor);
          const overlayBg = rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.18)` : 'rgba(0,0,0,0.18)';
          const overlayText = mixWithBlack(baseColor, 75);
          const chipBg = mixWithWhite(baseColor, 80);
          const chipBorder = mixWithBlack(baseColor, 25);
          return (
            <CarouselItem
              key={index}
              className="sm:basis-1/2 lg:basis-1/3 flex justify-center"
            >
              <motion.div
                variants={listItemSlow}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.25 }}
                key={index}
                style={{
                  background: baseColor,
                  borderColor,
                  "--arrow-border": arrowBorder,
                  "--arrow-bg": arrowBg,
                } as CSSProperties}
                className="group relative flex w-full max-w-none sm:max-w-[420px] md:max-w-[420px] aspect-[3/4] sm:aspect-[4/5] md:aspect-[9/16] p-1.5 sm:p-2 flex-col items-center justify-end shrink-0 gap-2 sm:gap-3 md:gap-4 rounded-3xl border border-solid overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {(thc !== null || indica !== null || sativa !== null) && (
                  <div className="w-full p-3 sm:p-4" style={{ backgroundColor: overlayBg, color: overlayText }}>
                    <div className="flex items-start justify-between gap-3 sm:gap-4 w-full">
                      {thc !== null && (
                        <div className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm sm:text-base font-semibold" style={{ backgroundColor: chipBg, borderColor: chipBorder }}>
                          <span>THC</span>
                          <span>{`${Math.round(thc)}%`}</span>
                        </div>
                      )}
                      {(indica !== null || sativa !== null) && (
                        <div className="inline-flex flex-col items-end gap-1 sm:gap-1.5 ml-auto">
                          <div className="text-xs sm:text-sm whitespace-nowrap opacity-90">
                            {`Indica ${Math.round(indica || 0)}% · Sativa ${Math.round(sativa || 0)}%`}
                          </div>
                          <div className="h-1.5 rounded-full bg-white/40 overflow-hidden w-full">
                            <div className="h-full" style={{ width: `${Math.max(0, Math.min(100, Math.round(indica || 0)))}%`, backgroundColor: mixWithBlack(baseColor, 25) }} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className="relative w-full flex-1 min-h-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 640px, 480px"
                      className="object-cover scale-[1.4] sm:scale-[1.35] md:scale-[1.35] transition-transform duration-300 ease-out group-hover:scale-[1.5] opacity-0"
                      onLoadingComplete={(img) => {
                        img.classList.remove('opacity-0');
                        img.classList.add('opacity-100');
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-[#E3EAD5] flex items-center justify-center rounded-2xl">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                </div>
                <div
                  style={{ background: panelColor, borderColor: textIconColor, borderWidth: 0.5 }}
                  className="flex w-full p-5 sm:p-6 md:p-7 items-start rounded-[20px] border flex-none h-[220px] lg:h-[320px] overflow-hidden"
                >
                  <div className="flex flex-col justify-center items-start gap-2 md:gap-3">
                    <p className="text-xl sm:text-2xl md:text-3xl font-extrabold leading-[115%] uppercase" style={{ color: textIconColor }}>
                      {item.name}
                    </p>
                    <p className="text-base sm:text-lg md:text-xl font-semibold leading-[145%]" style={{ color: textIconColor }}>
                      {item.type}
                    </p>
                    <div>
                      <p className="text-base md:text-lg font-normal leading-[150%] line-clamp-3" style={{ color: textIconColor }}>
                        {item.description}
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            className="mt-2 text-sm font-semibold underline cursor-pointer hover:opacity-80 transition-opacity"
                            style={{ color: textIconColor }}
                          >
                            Read more
                          </button>
                        </DialogTrigger>
                        <DialogContent
                          className="w-[calc(100vw-2rem)] sm:w-[calc(100vw-4rem)] max-w-3xl max-h-[90vh] overflow-y-auto border-2 !rounded-3xl"
                          style={{
                            background: gradientAround(baseColor, 15),
                            borderColor: textIconColor,
                          }}
                          showCloseButton={false}
                        >
                          <div className="relative">
                            <DialogClose
                              className="absolute -top-2 -right-2 rounded-full p-2 transition-all hover:opacity-80 z-10"
                              style={{
                                backgroundColor: textIconColor,
                                color: panelColor,
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                              </svg>
                              <span className="sr-only">Close</span>
                            </DialogClose>
                            
                            {/* Image Section */}
                            {item.image && (
                              <div className="relative w-full h-64 sm:h-80 mb-6 rounded-2xl overflow-hidden" style={{ backgroundColor: baseColor }}>
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  priority
                                  sizes="(max-width: 768px) 100vw, 672px"
                                  className="object-cover scale-[1.35] opacity-0 transition-opacity duration-300"
                                  onLoad={(e) => {
                                    e.currentTarget.classList.remove('opacity-0');
                                    e.currentTarget.classList.add('opacity-100');
                                  }}
                                />
                              </div>
                            )}

                            <DialogTitle asChild>
                              <h2
                                className="text-2xl sm:text-3xl font-bold mb-2 uppercase"
                                style={{ color: textIconColor }}
                              >
                                {item.name}
                              </h2>
                            </DialogTitle>
                            <h3
                              className="text-lg sm:text-xl font-semibold mb-4"
                              style={{ color: textIconColor }}
                            >
                              {item.type}
                            </h3>

                            <div
                              className="text-base sm:text-lg font-normal leading-[150%]"
                              style={{ color: textIconColor }}
                            >
                              {item.description}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </motion.div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <div className="mt-2 sm:mt-3 w-full flex items-center justify-between gap-3">
        <CarouselPrevious className="static top-auto left-auto right-auto translate-y-0 rotate-0 h-12 sm:h-14 px-6 sm:px-7 rounded-2xl border bg-[var(--cta-bg)] text-[var(--cta-border)] border-[var(--cta-border)] shadow-[0_4px_14px_0_rgba(0,0,0,0.10)]" />
        <DynamicCTA bgColor={ctaBg} textColor={ctaText} borderColor={ctaText} />
        <CarouselNext className="static top-auto left-auto right-auto translate-y-0 rotate-0 h-12 sm:h-14 px-6 sm:px-7 rounded-2xl border bg-[var(--cta-bg)] text-[var(--cta-border)] border-[var(--cta-border)] shadow-[0_4px_14px_0_rgba(0,0,0,0.10)]" />
      </div>
    </Carousel>

  );
}

function DynamicCTA({ bgColor, textColor, borderColor }: { bgColor: string; textColor: string; borderColor: string }) {
  const [isSm, setIsSm] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 640px)');
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      const matches = 'matches' in e ? e.matches : (e as MediaQueryList).matches;
      setIsSm(matches);
    };
    handler(mql);
    mql.addEventListener('change', handler as (ev: MediaQueryListEvent) => void);
    return () => mql.removeEventListener('change', handler as (ev: MediaQueryListEvent) => void);
  }, []);

  return (
    <Button
      title={isSm ? 'Strains' : 'All strains'}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="gap-4 border-2"
      style={{
        background: bgColor,
        borderColor,
        color: textColor,
      }}
    />
  );
}
