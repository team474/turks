'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

interface MiniGradientFadeProps {
  gradient: string;
  className?: string;
}

export function MiniGradientFade({ gradient, className }: MiniGradientFadeProps) {
  const prefersReducedMotion = useReducedMotion()
  return (
    <div className={`pointer-events-none absolute inset-0 ${className ?? ''}`} style={{ zIndex: 0 }}>
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={gradient}
          className="absolute inset-0"
          style={{ backgroundImage: gradient, backgroundSize: '300% 300%', backgroundRepeat: 'no-repeat' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: prefersReducedMotion ? 0.15 : 0.6, ease: [0.16, 1, 0.3, 1] } }}
        />
      </AnimatePresence>
    </div>
  )
}


