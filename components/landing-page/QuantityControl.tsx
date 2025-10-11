'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface QuantityControlProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  bgColor?: string;
  borderColor?: string;
  iconColor?: string;
  textColor?: string;
}

export function QuantityControl({ value, onIncrement, onDecrement, bgColor, borderColor, iconColor, textColor }: QuantityControlProps) {
  return (
    <div className="flex p-2 sm:p-3 justify-center items-center gap-3 sm:gap-4 rounded-full transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md" style={{ backgroundColor: bgColor, border: borderColor ? `1px solid ${borderColor}` : undefined, color: iconColor ?? borderColor }}>
      <button
        type="button"
        onClick={onDecrement}
        className="flex items-center justify-center"
        aria-label="Decrease quantity"
        disabled={value === 0}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
          <circle cx="15" cy="15" r="15" fill={iconColor || borderColor || '#000'} stroke={borderColor || '#000'} strokeWidth=".5" />
          <rect x="9.16602" y="13.8335" width="11.6667" height="1.75" rx="0.875" fill={borderColor || '#000'} />
        </svg>
      </button>

      <div className="min-w-[20px] flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={value}
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 1.02 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base font-bold leading-[150%] uppercase text-center"
            style={{ color: textColor ?? borderColor }}
          >
            {value.toString().padStart(2, '0')}
          </motion.p>
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={onIncrement}
        className="flex items-center justify-center"
        aria-label="Increase quantity"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
          <circle cx="15" cy="15" r="15" fill={iconColor || borderColor || '#000'} stroke={borderColor || '#000'} strokeWidth=".5" />
          <rect x="9.16602" y="13.8335" width="11.6667" height="1.75" rx="0.875" fill={borderColor || '#000'} />
          <rect x="16.1641" y="9.16675" width="11.6667" height="1.75" rx="0.875" transform="rotate(90 16.1641 9.16675)" fill={borderColor || '#000'} />
        </svg>
      </button>
    </div>
  );
}


