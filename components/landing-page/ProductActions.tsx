'use client'

import { ShinyButton } from "@/components/ui/shiny-button";

interface ProductActionsProps {
  onAddToCart: () => Promise<void> | void;
  onCheckout: () => void;
  checkoutDisabled?: boolean;
  ctaBg?: string;
  ctaBorder?: string;
  checkoutBg?: string;
}

export function ProductActions({ onAddToCart, onCheckout, checkoutDisabled, ctaBg, ctaBorder, checkoutBg }: ProductActionsProps) {
  const shinyStyle: React.CSSProperties & { ['--primary']?: string } = {
    backgroundColor: ctaBg,
    border: ctaBorder ? `1px solid ${ctaBorder}` : undefined,
    color: ctaBorder,
    ['--primary']: ctaBorder || '#101010',
  };
  return (
    <div className="flex items-start gap-4 w-full">
      <form action={onAddToCart} className="flex-1">
        <ShinyButton
          type="submit"
          className="flex w-full px-5 py-4 sm:px-10 sm:py-5 justify-center items-center gap-4 rounded-full cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:brightness-105"
          style={shinyStyle}
        >
          <span className="text-base sm:text-lg font-bold leading-[150%] uppercase text-center whitespace-nowrap" style={{ color: ctaBorder }}>
            Add to cart
          </span>
        </ShinyButton>
      </form>
      <button
        type="button"
        onClick={onCheckout}
        className={`flex px-5 py-4 sm:px-10 sm:py-5 justify-center items-center gap-4 flex-1 rounded-full cursor-pointer transition-all duration-200 ease-out ${checkoutDisabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'hover:-translate-y-0.5 hover:shadow-md hover:brightness-105'}`}
        style={{ backgroundColor: checkoutBg ?? ctaBg, border: ctaBorder ? `1px solid ${ctaBorder}` : undefined, color: ctaBorder }}
        disabled={checkoutDisabled}
      >
        <p className="text-base sm:text-lg font-bold leading-[150%] uppercase text-center whitespace-nowrap">
          Checkout
        </p>
      </button>
    </div>
  )
}


