'use client'

import { Metafield, Product } from "@/lib/shopify/types";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { mixWithBlack, saturateHex, mixWithWhite } from "@/lib/color";
import Image from "next/image";
import { Button } from "./Button";
import { useEffect, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { listItemSlow } from "@/lib/animation";

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
  }> {
    return products?.map((product: Product) => {
      // Find metafields with proper type safety
      const caseColorMetafield = product.metafields?.find((mf: Metafield) => mf.key === 'case_color');
      const terpenesMetafield = product.metafields?.find((mf: Metafield) => mf.key === 'terpenes');
      const category = product.metafields?.find((mf: Metafield) => mf.key === 'category');

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
        color: caseColorMetafield?.value || "#FFFFFF"
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
                <div className="relative w-full flex-1 min-h-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 640px, 480px"
                      className="object-contain scale-[1.35] sm:scale-[1.2] md:scale-[1.25] transition-transform duration-300 ease-out group-hover:scale-125 opacity-0"
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
                    <p className="text-base md:text-lg font-normal leading-[150%]" style={{ color: textIconColor }}>
                      {item.description}
                    </p>
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
