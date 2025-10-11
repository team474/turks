'use client'

interface ProductActionsProps {
  onAddToCart: () => Promise<void> | void;
  onCheckout: () => void;
  checkoutDisabled?: boolean;
}

export function ProductActions({ onAddToCart, onCheckout, checkoutDisabled }: ProductActionsProps) {
  return (
    <div className="flex items-start gap-4 w-full">
      <form action={onAddToCart} className="flex-1">
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
        onClick={onCheckout}
        className={`flex px-4 py-3 sm:px-8 sm:py-4 justify-center items-center gap-3 flex-1 rounded-full border border-[#1D431D] cursor-pointer ${checkoutDisabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-[#1D431D] hover:bg-gray-50 transition-colors'}`}
        disabled={checkoutDisabled}
      >
        <p className="text-sm sm:text-base font-bold leading-[150%] uppercase text-center">
          Checkout
        </p>
      </button>
    </div>
  )
}


