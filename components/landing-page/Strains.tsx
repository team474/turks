'use client'

import { updateItemQuantity } from "@/components/cart/actions";
import { useCart } from "@/components/cart/cart-context";
import { currencyCodeMap } from "@/lib/constants";
import { Product } from "@/lib/shopify/types";
import Image from "next/image";
import { mixWithWhite, mixWithBlack, saturateHex, hexToRgb } from "@/lib/color";
import { useActionState, useEffect, useState, useTransition, type CSSProperties } from "react";
// import { Icon } from "../Icons";
import { Button } from "./Button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { motion } from "framer-motion";
import { listItemSlow } from "@/lib/animation";
// Removed unused Button import

interface strainProps {
  product: Product[];
}
interface HeaderData {
  mainHeader?: string;
  subHeader?: string;
}

interface HeaderField {
  key: string;
  value: string;
}

export function Strains({ product }: strainProps) {

  const { addCartItem, cart } = useCart();
  const [, formAction] = useActionState(updateItemQuantity, null);
  const [, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [headerData, setHeaderData] = useState<HeaderData>({});
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const response = await fetch('/api/header');
        if (!response.ok) throw new Error('Failed to fetch header');
        const { header } = await response.json();
        
        if (header?.fields) {
          const mainHeader = header.fields.find((f: HeaderField) => f.key === 'main_header')?.value;
          const subHeader = header.fields.find((f: HeaderField) => f.key === 'sub_header')?.value;
          setHeaderData({ mainHeader, subHeader });
        }
      } catch (error) {
        console.error('Error fetching header:', error);
        setHeaderData({
          mainHeader: "Strains",
          subHeader: "Farm raised, indoor grown, hand trimmed."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeaderData();
  }, []);

  // Get current quantity from cart
  const getCartQuantity = (variantId: string) => {
    if (!cart) return 0;
    const cartItem = cart.lines.find(item => item.merchandise.id === variantId);
    return cartItem?.quantity || 0;
  };

  const handleAddToCart = async (strain: Product) => {
    const variant = strain?.variants?.[0];
    if (!variant?.availableForSale) return;

    console.log("Adding to cart:", { strain, variant });

    const merchandiseId = variant.id;
    const existingQty = getCartQuantity(merchandiseId);
    const targetQty = existingQty + 1;

    startTransition(async () => {

      addCartItem(variant, strain);

      try {
        await formAction({
          merchandiseId,
          quantity: targetQty,
        });
        console.log("Server cart updated successfully");
      } catch (error) { 
        console.error("Failed to update server cart:", error);
      }
    });
  };

  // color helpers now imported from lib/color

  const activeBaseColor = (product?.[activeIndex]?.metafields?.[2]?.value as string) || '#1D431D';
  const ctaBg = mixWithWhite(activeBaseColor, 20);
  const ctaText = saturateHex(mixWithBlack(activeBaseColor, 68), 38);

  const ctaStyleVars = {
    "--cta-bg": ctaBg,
    "--cta-border": ctaText,
  } as CSSProperties;

  useEffect(() => {
    const track = document.querySelector('[data-slot="carousel-content"] > div');
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
  }, [product]);

  return (
    <div className="flex flex-col gap-6 md:gap-12 items-center" style={ctaStyleVars}>
      <div className="flex max-w-[1170px] mx-auto flex-col justify-center items-center gap-3 md:gap-5">
        <h2 className="text-[26px] sm:text-5xl leading-[120%] text-[#101010] uppercase text-center font-vast-shadow">
        {isLoading ? "Loading..." : headerData.mainHeader}
        </h2>
        <p className="text-center text-base md:text-xl font-normal leading-[150%] text-[#101010]">
        {isLoading ? "Loading..." : headerData.subHeader}
        </p>
      </div>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full px-3 sm:px-4"
      >
        <CarouselContent className="pt-2 pb-4 md:pb-8">
          {product.map((strain, index) => {
            const getMf = (key: string) => strain?.metafields?.find(mf => mf.key === key)?.value as string | undefined;
            const concentration = getMf('concentration');
            const indicaStr = getMf('indica');
            const sativaStr = getMf('sativa');
            const parsePct = (v?: string) => {
              if (!v) return null;
              const cleaned = v.replace(/[^0-9.]/g, '');
              const num = parseFloat(cleaned);
              return Number.isFinite(num) ? num : null;
            };
            const thc = parsePct(concentration);
            let indica = parsePct(indicaStr);
            let sativa = parsePct(sativaStr);
            if (indica !== null && (sativa === null || !Number.isFinite(sativa))) sativa = Math.max(0, Math.min(100, 100 - indica));
            if (sativa !== null && (indica === null || !Number.isFinite(indica))) indica = Math.max(0, Math.min(100, 100 - sativa));
            if (indica !== null && sativa !== null) {
              const sum = indica + sativa;
              if (sum > 0 && sum !== 100) {
                indica = (indica / sum) * 100;
                sativa = (sativa / sum) * 100;
              }
            }
            const baseColor = (strain?.metafields[2]?.value as string) || '#FFFFFF';
            // Panel and border: darker and more saturated version of base color (50% more than previous)
            const panelDarker = mixWithBlack(baseColor, 27);
            const panelColor = saturateHex(panelDarker, 30);
            const borderColor = panelColor;
            // Text and icon: even darker and more saturated for stronger contrast (50% more than previous)
            const textIconDarker = mixWithBlack(baseColor, 68);
            const textIconColor = saturateHex(textIconDarker, 38);
            const arrowBorder = textIconColor;
            const arrowBg = mixWithWhite(baseColor, 70);
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
                  className="group relative flex w-full max-w-none sm:max-w-[420px] md:max-w-[420px] aspect-[3/4] sm:aspect-[4/5] md:aspect-[4/5] p-1.5 sm:p-2 flex-col items-center justify-end shrink-0 gap-2 sm:gap-3 md:gap-4 rounded-3xl border border-solid overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
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
                  <div className="relative w-full flex-1 min-h-0 py-3 sm:py-4 md:py-6">
                    <Image
                      src={strain?.images[0]?.url ?? ''}
                      alt={strain?.title}
                      loading="lazy"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 640px, 480px"
                      className="object-cover scale-[1.4] sm:scale-[1.35] md:scale-[1.35] transition-transform duration-300 ease-out group-hover:scale-[1.5] opacity-0"
                      onLoadingComplete={(img) => {
                        img.classList.remove('opacity-0');
                        img.classList.add('opacity-100');
                      }}
                    />
                  </div>
                  <div 
                    style={{ background: panelColor, borderColor: textIconColor, borderWidth: 0.5 }}
                    className="flex w-full p-5 sm:p-6 md:p-7 justify-between items-end rounded-[20px] border flex-none h-[132px] sm:h-[152px] md:h-[168px]"
                  >
                    <div className="flex flex-col justify-center items-start gap-4">
                      <p className="text-xl sm:text-2xl md:text-3xl font-extrabold leading-[115%] uppercase" style={{ color: textIconColor }}>
                        {strain?.title}
                      </p>
                      <p className="text-base sm:text-lg md:text-xl font-semibold leading-[145%]" style={{ color: textIconColor }}>
                        {currencyCodeMap[strain?.priceRange?.minVariantPrice?.currencyCode as keyof typeof currencyCodeMap] ?? ''}{strain?.priceRange?.minVariantPrice?.amount}/OZ
                      </p>
                    </div>

                    <button className="flex p-3.5 sm:p-4 md:p-4.5 items-center rounded-full cursor-pointer border-0" style={{ backgroundColor: textIconColor }} onClick={() => handleAddToCart(strain)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 20 20"
                        fill="none"
                        className="size-5 md:size-6"
                      >
                        <path
                          d="M19.4923 4.65625C19.2892 4.42188 19.0509 4.24219 18.7774 4.11719C18.504 3.99219 18.211 3.92969 17.8985 3.92969H7.16416C6.96104 3.92969 6.78526 4.00391 6.63682 4.15234C6.48838 4.30078 6.41416 4.48438 6.41416 4.70312C6.41416 4.90625 6.48838 5.08203 6.63682 5.23047C6.78526 5.37891 6.96104 5.45312 7.16416 5.45312H17.8985C18.0235 5.45312 18.1212 5.48047 18.1915 5.53516C18.2618 5.58984 18.3204 5.63281 18.3673 5.66406C18.3985 5.71094 18.4298 5.77344 18.461 5.85156C18.4923 5.92969 18.5001 6.03125 18.4845 6.15625L17.547 12.8359C17.5001 13.1016 17.379 13.3203 17.1837 13.4922C16.9884 13.6641 16.7579 13.75 16.4923 13.75H5.59385C5.3126 13.75 5.07432 13.6562 4.87901 13.4688C4.6837 13.2812 4.57042 13.0469 4.53917 12.7656L3.57823 1.07031C3.5626 0.898438 3.4962 0.746094 3.37901 0.613281C3.26182 0.480469 3.1251 0.398438 2.96885 0.367188L0.882915 0.015625C0.67979 -0.015625 0.49229 0.0273438 0.320415 0.144531C0.14854 0.261719 0.0469778 0.421875 0.0157278 0.625C-0.0155222 0.84375 0.0274465 1.03906 0.144634 1.21094C0.261822 1.38281 0.421978 1.48438 0.625103 1.51562L2.1251 1.79688L3.03917 12.9062C3.10167 13.5781 3.3751 14.1445 3.85948 14.6055C4.34385 15.0664 4.92198 15.2969 5.59385 15.2969H16.4923C17.1329 15.2969 17.6915 15.082 18.1681 14.6523C18.6446 14.2227 18.9298 13.6953 19.0235 13.0703L19.9845 6.36719C20.0314 6.05469 20.0118 5.75 19.9259 5.45312C19.8399 5.15625 19.6954 4.89062 19.4923 4.65625ZM3.90635 18.4609C3.90635 18.0234 4.05479 17.6562 4.35167 17.3594C4.64854 17.0625 5.00792 16.9141 5.42979 16.9141C5.83604 16.9141 6.1876 17.0625 6.48448 17.3594C6.78135 17.6562 6.92979 18.0234 6.92979 18.4609C6.92979 18.8828 6.78135 19.2461 6.48448 19.5508C6.1876 19.8555 5.83604 20.0078 5.42979 20.0078C5.00792 20.0078 4.64854 19.8555 4.35167 19.5508C4.05479 19.2461 3.90635 18.8828 3.90635 18.4609ZM15.1564 18.4609C15.1564 18.0234 15.3048 17.6562 15.6017 17.3594C15.8985 17.0625 16.2579 16.9141 16.6798 16.9141C17.1017 16.9141 17.4571 17.0625 17.7462 17.3594C18.0353 17.6562 18.1798 18.0234 18.1798 18.4609C18.1798 18.8828 18.0353 19.2461 17.7462 19.5508C17.4571 19.8555 17.1017 20.0078 16.6798 20.0078C16.2579 20.0078 15.8985 19.8555 15.6017 19.5508C15.3048 19.2461 15.1564 18.8828 15.1564 18.4609ZM15.6485 8.45312C15.6485 8.67188 15.5743 8.85547 15.4259 9.00391C15.2774 9.15234 15.1017 9.22656 14.8985 9.22656H12.1329C11.9142 9.22656 11.7345 9.15234 11.5939 9.00391C11.4532 8.85547 11.3829 8.67188 11.3829 8.45312C11.3829 8.25 11.4532 8.07422 11.5939 7.92578C11.7345 7.77734 11.9142 7.70312 12.1329 7.70312H14.8985C15.1017 7.70312 15.2774 7.77734 15.4259 7.92578C15.5743 8.07422 15.6485 8.25 15.6485 8.45312Z"
                          fill="white"
                        />
                      </svg>
                    </button>
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

      
    </div>
  );
}

function DynamicCTA({ bgColor, textColor, borderColor }: { bgColor: string; textColor: string; borderColor: string }) {
  const [isSm, setIsSm] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 640px)');
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      // Support both initial call (MediaQueryList) and change events
      const matches = 'matches' in e ? e.matches : (e as MediaQueryList).matches;
      setIsSm(matches);
    };
    // Initial
    handler(mql);
    // Subscribe
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
