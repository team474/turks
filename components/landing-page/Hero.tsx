'use client'

import { redirectToCheckout, updateItemQuantity } from "@/components/cart/actions";
import { useCart } from "@/components/cart/cart-context";
import { Product } from "@/lib/shopify/types";
import { AnimatePresence, motion } from "framer-motion";
// import Image from "next/image";
import { useActionState, useEffect, useState, useTransition } from "react";
import { StrainMetaCard } from "@/components/landing-page/StrainMetaCard";
import { StrainSelector } from "@/components/landing-page/StrainSelector";
import { heroFade, heroStagger, heroChild } from "@/lib/animation";
import { useMemo, useRef } from "react";
import { useProductMeta } from "@/lib/hooks/useProductMeta";
import { gradientAround } from "@/lib/color";
// import { GradientFade } from "@/components/landing-page/GradientFade";
import { ProductImageGallery } from "@/components/landing-page/ProductImageGallery";
import { QuantityControl } from "@/components/landing-page/QuantityControl";
import { PriceDisplay } from "@/components/landing-page/PriceDisplay";
import { ProductActions } from "@/components/landing-page/ProductActions";
import { motionDurations } from "@/lib/animation";
import { mixWithWhite, mixWithBlack, saturateHex } from "@/lib/color";
import { getStrainFontFamily } from "@/lib/constants";

interface HeroProps {
  product: Product[];
}

export function Hero({ product }: HeroProps) {

  const [, startTransition] = useTransition();

  const [selectedName, setSelectedName] = useState<string | null>(product[0]?.title ?? null);
  const featureProduct = useMemo(() => (selectedName ? product.find((p) => p.title === selectedName) ?? null : null), [product, selectedName]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [thumbStartIndex, setThumbStartIndex] = useState(0);

  const { addCartItem, cart, updateCartItem } = useCart();
  const [, formAction] = useActionState(updateItemQuantity, null);

  // metafield access is handled via useProductMeta and memoized allStrains

  const images = useMemo(() => featureProduct?.images || [], [featureProduct]);
  const allStrains = useMemo(() => (
    product.map(p => ({
      name: p.title,
      color: (p.metafields?.find(mf => mf.key === 'case_color')?.value) || '#FFFFFF',
      product: p
    }))
  ), [product]);
  
  // Get the strain index for font selection
  const strainIndex = useMemo(() => {
    return allStrains.findIndex(s => s.name === selectedName);
  }, [allStrains, selectedName]);
  
  const fontFamily = getStrainFontFamily(strainIndex >= 0 ? strainIndex : 0);
  // const prefersReducedMotion = useReducedMotion();

  const { caseColor, effects, terpenes, concentration } = useProductMeta(featureProduct);



  const getCartQuantity = (variantId: string) => {
    if (!cart) return 0;
    const cartItem = cart.lines.find(item => item.merchandise.id === variantId);
    return cartItem?.quantity || 0;
  };

  const currentQuantity = featureProduct?.variants[0]
    ? getCartQuantity(featureProduct.variants[0].id)
    : 0;

  // allStrains memoized above

  const handleSelectByName = (name: string) => {
    setSelectedName(name);
    setSelectedIndex(0);
    setThumbStartIndex(0);
  };

  // Debounced onSelect to serialize transitions
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [queuedSelection, setQueuedSelection] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const BLEND_MS = Math.round((motionDurations.normal + 0.05) * 1000);
  const scheduleProcess = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (queuedSelection) {
        const next = queuedSelection;
        setQueuedSelection(null);
        handleSelectByName(next);
        scheduleProcess();
      } else {
        setIsTransitioning(false);
        timerRef.current = null;
      }
    }, BLEND_MS);
  };
  const onSelectDebounced = (name: string) => {
    if (isTransitioning) {
      setQueuedSelection(name);
      return;
    }
    setIsTransitioning(true);
    handleSelectByName(name);
    scheduleProcess();
  };

  // Ensure we always show the first image when the featured product changes
  useEffect(() => {
    setSelectedIndex(0);
    setThumbStartIndex(0);
  }, [featureProduct?.id]);

  // Keep the selected thumbnail in view within the 3-tile window
  useEffect(() => {
    const maxStart = Math.max(0, images.length - 3);
    if (selectedIndex < thumbStartIndex) {
      setThumbStartIndex(selectedIndex);
    } else if (selectedIndex > thumbStartIndex + 2) {
      setThumbStartIndex(Math.min(selectedIndex - 2, maxStart));
    }
  }, [selectedIndex, images.length, thumbStartIndex]);

  const addToCartAction = async () => {
    if (!featureProduct || !featureProduct.variants[0]) return;

    const varient = featureProduct.variants[0];
    const merchandiseId = featureProduct.variants[0].id;
    const existingQty = getCartQuantity(merchandiseId);

    if (existingQty > 0) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('open-cart'));
      }
      return;
    }


    const targetQty = existingQty + 1;

    startTransition(() => {
      addCartItem(varient, featureProduct);
    });
    const updateItemQuantityAction = formAction.bind(null, {
      merchandiseId,
      quantity: targetQty,
    });
    await updateItemQuantityAction();
  };


  const updateQuantity = (change: 'increment' | 'decrement') => {
    if (!featureProduct || !featureProduct.variants[0]) return;

    const varient = featureProduct.variants[0];
    const merchandiseId = featureProduct.variants[0].id;
    const currentQty = getCartQuantity(merchandiseId);

    if (change === 'increment') {
      startTransition(() => {
        addCartItem(varient, featureProduct);
        formAction({ merchandiseId, quantity: currentQty + 1 });
      });
    } else if (change === 'decrement' && currentQty > 0) {
      startTransition(() => {
        updateCartItem(merchandiseId, 'minus');
      });
    }
  };

  // avoid early-return before hooks to keep hook order consistent

  // Helpers to build a 3-stop gradient around the case color
  const backgroundGradient = gradientAround(caseColor || '#FFFFFF', 15);
  const base = caseColor || '#1D431D';
  const ctaBg = mixWithWhite(base, 20);
  const ctaBorder = saturateHex(mixWithBlack(base, 68), 38);
  const checkoutBg = saturateHex(mixWithBlack(base, 20), 35); // Lighter background
  const checkoutText = saturateHex(mixWithBlack(base, 85), 50); // Darker text for contrast
  const iconSaturated = saturateHex(mixWithBlack(base, 30), 38);
  
  // Convert base color to rgba with low opacity for section background
  const hexToRgba = (hex: string, alpha: number): string => {
    const rgb = mixWithWhite(hex, 0); // Just to validate/normalize the hex
    const match = rgb.match(/^#([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/);
    if (!match || !match[1] || !match[2] || !match[3]) return `rgba(255, 255, 255, ${alpha})`;
    const r = parseInt(match[1], 16);
    const g = parseInt(match[2], 16);
    const b = parseInt(match[3], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  const sectionBg = hexToRgba(base, 0.12); // 12% opacity of the product color

  // Sync CSS variables so other buttons (About, CTA) match the hero button colors
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const el = document.getElementById('cta-color-scope') || document.documentElement;
    if (!el) return;
    el.style.setProperty('--cta-bg', ctaBg);
    el.style.setProperty('--cta-border', ctaBorder);
    el.style.setProperty('--checkout-bg', checkoutBg);
  }, [ctaBg, ctaBorder, checkoutBg]);


  if (!featureProduct) return null;

  return (
    <motion.div
      variants={heroStagger}
      className="grid grid-cols-1 lg:grid-cols-2 items-start gap-6 sm:gap-7.5"
      style={{ willChange: 'transform, opacity' }}
    >
      {/* Title - shows above image on mobile, stays in right column on desktop */}
      <motion.h1 variants={heroChild} className="text-[34px] sm:text-[42px] leading-[120%] uppercase lg:whitespace-nowrap lg:hidden text-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={selectedName || 'none'} variants={heroFade} initial="initial" animate="animate" exit="exit" className="inline-block" style={{ fontFamily, color: ctaBorder }}>
            {selectedName || 'Select a strain'}
          </motion.span>
        </AnimatePresence>
      </motion.h1>

      <motion.div variants={heroChild} className="flex flex-col items-start gap-3 sm:gap-5">
        <ProductImageGallery
          images={images as { url: string; altText?: string | null; width: number; height: number }[]}
          selectedIndex={selectedIndex}
          onSelectIndex={(i) => setSelectedIndex(i)}
          gradientOverlay={backgroundGradient}
          borderColorHex={caseColor || '#1D431D'}
        />
      </motion.div>

      <div className="flex flex-col items-center sm:items-start gap-5 sm:gap-7.5">
        {/* Title - hidden on mobile, shows on desktop */}
        <motion.h1 variants={heroChild} className="hidden lg:block text-[26px] sm:text-[42px] leading-[120%] uppercase lg:whitespace-nowrap">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={selectedName || 'none'} variants={heroFade} initial="initial" animate="animate" exit="exit" className="inline-block text-center sm:text-left" style={{ fontFamily, color: ctaBorder }}>
              {selectedName || 'Select a strain'}
            </motion.span>
          </AnimatePresence>
        </motion.h1>

        <motion.div variants={heroChild} className="-mt-2 sm:-mt-3">
          <StrainSelector
            items={allStrains.map(({ name, color }) => ({ name, color }))}
            selectedName={selectedName}
            onSelect={onSelectDebounced}
            titleColor={ctaBorder}
          />
        </motion.div>

        <motion.div variants={heroChild} className="w-full">
          <StrainMetaCard
            name={selectedName || 'Select a strain'}
            colorHex={caseColor}
            effects={effects}
            terpenes={terpenes}
            description={featureProduct?.descriptionHtml || featureProduct?.description || ''}
            concentration={concentration}
          />
        </motion.div>

        {/* Combined Price, Quantity & Actions Container */}
        <motion.div 
          variants={heroChild} 
          className="w-full rounded-2xl sm:rounded-3xl border-2 p-4 sm:p-6 flex flex-col gap-4"
          style={{ borderColor: ctaBorder, backgroundColor: sectionBg }}
        >
          <div className="flex justify-between items-center w-full gap-3">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={`${featureProduct?.priceRange?.minVariantPrice?.currencyCode}-${featureProduct?.priceRange?.minVariantPrice?.amount}`} variants={heroFade} initial="initial" animate="animate" exit="exit">
                <div style={{ color: ctaBorder }}>
                  <PriceDisplay amount={featureProduct?.priceRange?.minVariantPrice?.amount} currencyCode={featureProduct?.priceRange?.minVariantPrice?.currencyCode} />
                </div>
              </motion.div>
            </AnimatePresence>
            <QuantityControl value={currentQuantity} onIncrement={() => updateQuantity('increment')} onDecrement={() => updateQuantity('decrement')} bgColor={ctaBg} borderColor={ctaBorder} iconColor={iconSaturated} textColor={ctaBorder} />
          </div>
          
          <ProductActions onAddToCart={addToCartAction} onCheckout={() => redirectToCheckout()} checkoutDisabled={cart?.lines.length === 0} ctaBg={ctaBg} ctaBorder={ctaBorder} checkoutBg={checkoutBg} checkoutText={checkoutText} />
        </motion.div>
      </div>
    </motion.div>
  );
}