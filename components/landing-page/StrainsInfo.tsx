'use client'

import { Metafield, Product } from "@/lib/shopify/types";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { mixWithBlack, saturateHex, mixWithWhite } from "@/lib/color";
import Image from "next/image";
import { Button } from "./Button";
import { useEffect, useState, type CSSProperties } from "react";

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
      className="w-full px-4 sm:px-6 md:px-6 lg:px-8"
      style={ctaStyleVars}
      data-scope="strains-info"
    >
      <CarouselContent className="pt-2 pb-6 md:pb-10">
        {strainsList && strainsList.map((item, index) => {
          const baseColor = item.color || "#FFFFFF";
          const panelDarker = mixWithBlack(baseColor, 27);
          const panelColor = saturateHex(panelDarker, 30);
          const borderColor = panelColor;
          const textIconDarker = mixWithBlack(baseColor, 68);
          const textIconColor = saturateHex(textIconDarker, 38);
          return (
            <CarouselItem
              key={index}
              className="sm:basis-1/2 lg:basis-1/3 flex justify-center"
            >
              <div
                key={index}
                style={{ 
                  background: baseColor,
                  borderColor
                }}
                className="group relative flex w-full max-w-none sm:max-w-[400px] md:max-w-[400px] h-[560px] sm:h-[660px] md:h-[760px] p-1.5 sm:p-2 mx-1.5 sm:mx-2 flex-col items-center justify-start shrink-0 gap-0 rounded-3xl border border-solid overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative w-full h-[240px] sm:h-[300px] md:h-[380px]">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 640px, 480px"
                      className="object-contain scale-[1.5] sm:scale-[1.35] md:scale-[1.4] transition-transform duration-300 ease-out group-hover:scale-[1.65] opacity-0 transition-opacity"
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
                  className="flex w-full px-5 py-4 sm:px-6 sm:py-5 md:px-6 md:py-5 items-start rounded-[20px] border"
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
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <div className="mt-2 sm:mt-3 w-full flex items-center justify-between gap-3">
        <CarouselPrevious className="static top-auto left-auto right-auto translate-y-0 rotate-0 h-12 sm:h-14 px-6 sm:px-7 rounded-2xl border bg-[var(--cta-bg)] text-[var(--cta-border)] border-[var(--cta-border)] shadow-[0_4px_14px_0_rgba(0,0,0,0.10)]" />
        <Button
          title="All strains"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="gap-4 border-2"
          style={{
            background: ctaBg,
            borderColor: ctaText,
            color: ctaText,
          }}
        />
        <CarouselNext className="static top-auto left-auto right-auto translate-y-0 rotate-0 h-12 sm:h-14 px-6 sm:px-7 rounded-2xl border bg-[var(--cta-bg)] text-[var(--cta-border)] border-[var(--cta-border)] shadow-[0_4px_14px_0_rgba(0,0,0,0.10)]" />
      </div>
    </Carousel>
    // <div className="flex justify-center items-center gap-7.5 overflow-hidden">

    //   {strainsList.map((item, index) => (
    // <div style={{background: item.color}} key={index} className="flex max-w-[370px] w-full h-full min-h-[650px] p-4 pb-5 gap-4 flex-col items-center shrink-0 rounded-3xl">
    //   <div className="h-[240px] w-full rounded-2xl bg-[#E3EAD5]"></div>
    //   <div className="flex p-2 flex-col items-start gap-6">
    //     <div className="flex flex-col items-start gap-4">
    //       <p className="text-[28px] font-semibold leading-[120%] text-[#101010]">
    //         {item.name}
    //       </p>
    //       <p className="text-lg font-normal leading-[150%] text-[#101010]">
    //         {item.type}
    //       </p>
    //     </div>

    //     <p className="text-lg font-normal leading-[150%] text-[#101010]">
    //       {item.description}
    //     </p>

    //     <div className="flex flex-col items-start gap-2">
    //       <p className="text-base font-normal leading-[150%] text-[#101010]">
    //         Flavor
    //       </p>
    //       <div className="flex items-center gap-2">
    //         {item.flavor.map((item, index) => (
    //           <div key={index}>
    //             <p className="text-base font-normal leading-[150%] text-[#101010]">
    //               {item}
    //             </p>
    //             {index !== 2 && (
    //               <span className="size-1.5 bg-[#101010] rounded-full"></span>
    //             )}
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   </div>
    // </div>
    //   ))}
    // </div>
  );
}
