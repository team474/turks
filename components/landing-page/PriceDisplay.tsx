'use client'

interface PriceDisplayProps {
  amount?: string | number;
  currencyCode?: keyof typeof currencyCodeMap | string;
}

import { currencyCodeMap } from '@/lib/constants'

export function PriceDisplay({ amount, currencyCode }: PriceDisplayProps) {
  const prefix = currencyCode ? (currencyCodeMap as Record<string, string>)[currencyCode] ?? '' : ''
  
  // Remove decimals by parsing the amount and using Math.floor
  const displayAmount = amount ? Math.floor(Number(amount)) : amount
  
  return (
    <p className="text-[28px] sm:text-[40px] leading-[120%] uppercase min-w-[140px] sm:min-w-[200px]">
      <span className="font-bold">{prefix}{displayAmount}</span>
      <span className="font-light">/OZ</span>
    </p>
  )
}


