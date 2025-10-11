'use client'

interface ProductActionsProps {
  onAddToCart: () => Promise<void> | void;
  onCheckout: () => void;
  checkoutDisabled?: boolean;
  ctaBg?: string;
  ctaBorder?: string;
  checkoutBg?: string;
}

export function ProductActions({ onAddToCart, onCheckout, checkoutDisabled, ctaBg, ctaBorder, checkoutBg }: ProductActionsProps) {
  return (
    <div className="flex items-start gap-4 w-full">
      <form action={onAddToCart} className="flex-1">
        <button
          type="submit"
          className="flex w-full px-4 py-3 sm:px-8 sm:py-4 justify-center items-center gap-3 rounded-full cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:brightness-105"
          style={{ backgroundColor: ctaBg, border: ctaBorder ? `1px solid ${ctaBorder}` : undefined, color: ctaBorder }}
        >
          <p className="text-sm sm:text-base font-bold leading-[150%] uppercase text-center cursor-pointer" style={{ color: ctaBorder }}>
            Add to cart
          </p>
        </button>
      </form>
      <button
        type="button"
        onClick={onCheckout}
        className={`flex px-4 py-3 sm:px-8 sm:py-4 justify-center items-center gap-3 flex-1 rounded-full cursor-pointer transition-all duration-200 ease-out ${checkoutDisabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'hover:-translate-y-0.5 hover:shadow-md hover:brightness-105'}`}
        style={{ backgroundColor: checkoutBg ?? ctaBg, border: ctaBorder ? `1px solid ${ctaBorder}` : undefined, color: ctaBorder }}
        disabled={checkoutDisabled}
      >
        <p className="text-sm sm:text-base font-bold leading-[150%] uppercase text-center">
          Checkout
        </p>
      </button>
    </div>
  )
}


