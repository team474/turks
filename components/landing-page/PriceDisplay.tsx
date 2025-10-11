'use client'

interface PriceDisplayProps {
  amount?: string | number;
  currencyCode?: keyof typeof currencyCodeMap | string;
}

import { currencyCodeMap } from '@/lib/constants'

export function PriceDisplay({ amount, currencyCode }: PriceDisplayProps) {
  const prefix = currencyCode ? (currencyCodeMap as Record<string, string>)[currencyCode] ?? '' : ''
  return (
    <p className="text-[22px] sm:text-[40px] font-bold leading-[120%] uppercase text-[#101010]">
      {prefix}{amount}/OZ
    </p>
  )
}


