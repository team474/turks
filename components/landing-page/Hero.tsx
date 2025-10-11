'use client'

import { redirectToCheckout, updateItemQuantity } from "@/components/cart/actions";
import { useCart } from "@/components/cart/cart-context";
import { currencyCodeMap } from "@/lib/constants";
import { Product } from "@/lib/shopify/types";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useActionState, useEffect, useState, useTransition } from "react";
import { StrainMetaCard } from "@/components/landing-page/StrainMetaCard";

interface HeroProps {
  product: Product[];
}

export function Hero({ product }: HeroProps) {

  const [, startTransition] = useTransition();

  const [featureProduct, setFeatureProduct] = useState<Product | null>(product[0] || null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [thumbStartIndex, setThumbStartIndex] = useState(0);

  const { addCartItem, cart, updateCartItem } = useCart();
  const [, formAction] = useActionState(updateItemQuantity, null);

  const getMetafieldValue = (product: Product | null, key: string): string | null => {
    if (!product?.metafields) return null;
    const metafield = product.metafields.find(mf => mf.key === key);
    return metafield?.value || null;
  }

  const [featuredItem, setFeaturedItem] = useState<{ name: string; color: string } | null>(
    product[0] ? { name: product[0].title, color: getMetafieldValue(product[0], 'case_color') || '#FFFFFF' } : null
  );

  const images = featureProduct?.images || [];



  const getCartQuantity = (variantId: string) => {
    if (!cart) return 0;
    const cartItem = cart.lines.find(item => item.merchandise.id === variantId);
    return cartItem?.quantity || 0;
  };

  const currentQuantity = featureProduct?.variants[0]
    ? getCartQuantity(featureProduct.variants[0].id)
    : 0;

  const allStrains = product.map(p => ({
    name: p.title,
    color: getMetafieldValue(p, 'case_color') || '#FFFFFF',
    product: p
  }));

  useEffect(() => {
    if (featuredItem) {
      const selectedProduct = product.find(p => p.title === featuredItem.name);
      if (selectedProduct) {
        setFeatureProduct(selectedProduct);
      }
    }
  }, [featuredItem, product]);

  const handleItemClick = (item: { name: string; color: string; product: Product }) => {
    setFeaturedItem(item);
    setSelectedIndex(0);
    setThumbStartIndex(0);
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

  if (!featureProduct) return null;

  const caseColor = getMetafieldValue(featureProduct, 'case_color');
  const terpenesValue = getMetafieldValue(featureProduct, 'terpenes');
  const effectsValue = getMetafieldValue(featureProduct, 'effects');

  const effectsList = effectsValue ? (JSON.parse(effectsValue) as string[]) : [];
  const terpenesList = terpenesValue ? (JSON.parse(terpenesValue) as string[]) : [];

  // Helpers to build a 3-stop gradient around the case color
  function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    if (!hex) return null;
    let h = hex.trim();
    if (h[0] === '#') h = h.slice(1);
    if (h.length === 3) {
      h = h.split('').map((c) => c + c).join('');
    }
    if (h.length !== 6) return null;
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
    return { r, g, b };
  }

  function rgbToHex(r: number, g: number, b: number): string {
    const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  function mixWithWhite(hex: string, percent: number): string {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const p = Math.max(0, Math.min(100, percent)) / 100;
    const r = rgb.r + (255 - rgb.r) * p;
    const g = rgb.g + (255 - rgb.g) * p;
    const b = rgb.b + (255 - rgb.b) * p;
    return rgbToHex(r, g, b);
  }

  function mixWithBlack(hex: string, percent: number): string {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const p = Math.max(0, Math.min(100, percent)) / 100;
    const r = rgb.r * (1 - p);
    const g = rgb.g * (1 - p);
    const b = rgb.b * (1 - p);
    return rgbToHex(r, g, b);
  }

  function gradientAround(hex: string): string {
    const base = hex || '#FFFFFF';
    const light = mixWithWhite(base, 5);
    const dark = mixWithBlack(base, 5);
    // 135deg points toward bottom-right; darkest at bottom-right
    return `linear-gradient(135deg, ${light} 0%, ${base} 50%, ${dark} 100%)`;
  }

  const backgroundGradient = gradientAround(caseColor || '#FFFFFF');


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-6 sm:gap-7.5">
      <div className="flex flex-col items-start gap-3 sm:gap-5">
        <motion.div
          className="relative rounded-2xl sm:rounded-4xl w-full h-[347px] sm:h-[615px]"
          style={{ background: backgroundGradient }}
          animate={{ background: backgroundGradient }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {images[selectedIndex]?.url && (
              <motion.div
                key={images[selectedIndex]?.url || String(selectedIndex)}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="size-full"
              >
                <Image
                  src={images[selectedIndex].url}
                  alt={images[selectedIndex].altText || featureProduct.title}
                  height={images[selectedIndex].height}
                  width={images[selectedIndex].width}
                  className="size-full object-cover"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div className="flex w-full items-center gap-5" layout>
          {images.slice(thumbStartIndex, thumbStartIndex + 3).map((img, index) => {
            const absoluteIndex = thumbStartIndex + index;
            return (
              <motion.button
                key={absoluteIndex}
                onClick={() => {
                  setSelectedIndex(absoluteIndex);
                  // If clicking rightmost visible tile and more images exist, advance window by one
                  if (absoluteIndex === thumbStartIndex + 2 && thumbStartIndex + 3 < images.length) {
                    setThumbStartIndex((s) => s + 1);
                  }
                  // If clicking leftmost visible tile and previous images exist, move window left by one
                  if (absoluteIndex === thumbStartIndex && thumbStartIndex > 0) {
                    setThumbStartIndex((s) => s - 1);
                  }
                }}
                className={`h-[100px] sm:h-[176px] flex-1 rounded-2xl sm:rounded-4xl cursor-pointer overflow-hidden transition-colors duration-200 
              ${selectedIndex === absoluteIndex
                    ? "border-2 border-[#1D431D] ring-2 ring-[#1D431D]"
                    : "border border-[#1D431D]/50"
                  }`}
                layout
                animate={{ scale: selectedIndex === absoluteIndex ? 1.05 : 1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, mass: 0.3 }}
              >
                {img?.url && (
                  <Image
                    src={img.url}
                    alt={img.altText || featureProduct.title}
                    height={img.height}
                    width={img.width}
                    className="size-full object-contain bg-white"
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      <div className="flex flex-col items-start gap-5 sm:gap-7.5">
        <h1 className="text-[26px] sm:text-[42px] font-black leading-[120%] text-[#101010] uppercase font-playfair-display-sc">
          {featuredItem?.name || 'Select a strain'}
        </h1>

        <div className="flex flex-col items-start gap-4 w-full">
          <p className="text-base sm:text-xl font-bold leading-[120%] uppercase text-[#101010]">
            All Strains
          </p>
          <div className="flex items-start gap-2.5 sm:gap-4 flex-wrap">
            {allStrains.map((item, index) => {
              const isSelected = featuredItem?.name === item.name;
              return (
                <button
                  key={index}
                  onClick={() => handleItemClick(item)}
                  style={{ background: item.color }}
                  className={`flex px-3.5 sm:px-4 py-2 sm:py-3 gap-2 sm:gap-3 items-center rounded-full hover:opacity-90 transition-opacity`}
                >
                  <span
                    className={`size-4 sm:size-6 rounded-full ${isSelected ? 'border-[7px] border-gray-800' : ''
                      } bg-white`}
                  />
                  <p className="text-xs sm:text-base font-normal leading-[150%] text-[#202020]">
                    {item.name}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <StrainMetaCard
          name={featuredItem?.name || 'Select a strain'}
          colorHex={caseColor}
          effects={effectsList}
          terpenes={terpenesList}
        />

        <div className="flex flex-col items-start gap-2 sm:gap-4 w-full">
          <p className="text-base sm:text-xl font-bold leading-[120%] uppercase text-[#101010]">
            flavors
          </p>
          {/* <div className="flex items-center gap-3 w-full opacity-0">
            {[1, 2, 3].map((_, index) => (
              <div
                key={index}
                className="flex p-4 flex-col items-center gap-3 flex-1 rounded-2xl bg-[#FFE3EA]"
              >
                <div className="size-10.5 sm:size-13 "></div>
                <p className="text-sm sm:text-base font-normal leading-[150%] text-center text-[#202020]">
                  Apricot
                </p>
              </div>
            ))}
          </div> */}
        </div>

        <div className="flex justify-between items-center w-full">
          <p className="text-[22px] sm:text-[40px] font-bold leading-[120%] uppercase text-[#101010]">
            {currencyCodeMap[featureProduct?.priceRange?.minVariantPrice?.currencyCode as keyof typeof currencyCodeMap] ?? ''}{featureProduct?.priceRange?.minVariantPrice?.amount}/OZ
          </p>

          <div className="flex p-2 sm:p-3 justify-center items-center gap-3 sm:gap-4 rounded-full bg-[#1D431D]">
            <button
              type="button"
              onClick={() => updateQuantity('decrement')}
              className="flex items-center justify-center"
              aria-label="Decrease quantity"
              disabled={currentQuantity === 0}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
              >
                <circle cx="15" cy="15" r="15" fill="white" />
                <rect
                  x="9.16602"
                  y="13.8335"
                  width="11.6667"
                  height="1.75"
                  rx="0.875"
                  fill="#1D431D"
                />
              </svg>
            </button>
            <p className="text-sm sm:text-base text-white font-bold leading-[150%] uppercase min-w-[20px] text-center">
              {currentQuantity.toString().padStart(2, '0')}
            </p>
            <button
              type="button"
              onClick={() => updateQuantity('increment')}
              className="flex items-center justify-center"
              aria-label="Increase quantity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
              >
                <circle cx="15" cy="15" r="15" fill="white" />
                <rect
                  x="9.16602"
                  y="13.8335"
                  width="11.6667"
                  height="1.75"
                  rx="0.875"
                  fill="#1D431D"
                />
                <rect
                  x="16.1641"
                  y="9.16675"
                  width="11.6667"
                  height="1.75"
                  rx="0.875"
                  transform="rotate(90 16.1641 9.16675)"
                  fill="#1D431D"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-start gap-4 w-full">
          <form
            action={addToCartAction}
            className="flex-1"
          >
            <button
              type="submit"
              className="flex w-full px-4 py-3 sm:px-8 sm:py-4 justify-center items-center gap-3 rounded-full bg-[#1D431D] hover:opacity-90 transition-opacity cursor-pointer"
            >
              <p className="text-white text-sm sm:text-base font-bold leading-[150%] uppercase text-center cursor-pointer">
                Add to cart
              </p>
            </button>
          </form>
          <button
            type="button"
            onClick={() => redirectToCheckout()}
            className={`flex px-4 py-3 sm:px-8 sm:py-4 justify-center items-center gap-3 flex-1 rounded-full border border-[#1D431D] cursor-pointer
    ${cart?.lines.length === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-[#1D431D] hover:bg-gray-50 transition-colors'}`}
            disabled={cart?.lines.length === 0}
          >
            <p className="text-sm sm:text-base font-bold leading-[150%] uppercase text-center">
              Checkout
            </p>
          </button>

        </div>
      </div>
    </div>
  );
}