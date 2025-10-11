'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { colorBlend } from '@/lib/animation'
import Image from 'next/image'
import { fadeOnly } from '@/lib/animation'
import { useEffect, useState } from 'react'
import { GradientFade } from '@/components/landing-page/GradientFade'
import { MiniGradientFade } from '@/components/landing-page/MiniGradientFade'
import { mixWithBlack } from '@/lib/color'

interface GalleryImage {
  url: string
  altText?: string | null
  width: number
  height: number
}

interface ProductImageGalleryProps {
  images: GalleryImage[]
  selectedIndex: number
  onSelectIndex: (index: number) => void
  gradientOverlay?: string
  borderColorHex?: string
}

export function ProductImageGallery({ images, selectedIndex, onSelectIndex, gradientOverlay, borderColorHex }: ProductImageGalleryProps) {
  const prefersReducedMotion = useReducedMotion()
  const [thumbStartIndex, setThumbStartIndex] = useState(0)
  // Keyboard navigation can be added on interactive elements (e.g., buttons) to avoid a11y violations

  useEffect(() => {
    const maxStart = Math.max(0, images.length - 3)
    if (selectedIndex < thumbStartIndex) {
      setThumbStartIndex(selectedIndex)
    } else if (selectedIndex > thumbStartIndex + 2) {
      setThumbStartIndex(Math.min(selectedIndex - 2, maxStart))
    }
  }, [selectedIndex, images.length, thumbStartIndex])

  // Prefetch adjacent images to reduce flash on slow networks
  useEffect(() => {
    if (typeof window === 'undefined') return
    const preload = (i: number) => {
      const img = images[i]
      if (img?.url) {
        const el = new window.Image()
        el.src = img.url
      }
    }
    if (selectedIndex - 1 >= 0) preload(selectedIndex - 1)
    if (selectedIndex + 1 < images.length) preload(selectedIndex + 1)
  }, [selectedIndex, images])
  return (
    <div className="flex flex-col items-start gap-3 sm:gap-5 w-full">
      <motion.div
        className="relative rounded-2xl sm:rounded-4xl w-full h-[347px] sm:h-[615px] overflow-hidden border"
        style={{ background: gradientOverlay }}
        animate={{ borderColor: mixWithBlack(borderColorHex || '#1D431D', 50) }}
        transition={{ duration: colorBlend, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* gradient applied statically via background above */}
        <AnimatePresence mode="sync" initial={false}>
          {images[selectedIndex]?.url && (
            <motion.div
              key={images[selectedIndex]?.url || String(selectedIndex)}
              variants={fadeOnly}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              transition={{ duration: colorBlend, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src={images[selectedIndex].url}
                alt={images[selectedIndex].altText || ''}
                height={images[selectedIndex].height}
                width={images[selectedIndex].width}
                className="size-full object-cover"
                priority
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="flex w-full items-center gap-3 sm:gap-5">
        <button
          type="button"
          aria-label="Previous thumbnails"
          className="px-2 py-1 rounded-md border border-[#1D431D]/30 text-[#1D431D] disabled:opacity-40"
          onClick={() => setThumbStartIndex((s) => Math.max(0, s - 1))}
          disabled={thumbStartIndex === 0}
        >
          ‹
        </button>
        <motion.div className="flex w-full items-center gap-5" layout>
          {images.slice(thumbStartIndex, thumbStartIndex + 3).map((img, i) => {
            const absoluteIndex = thumbStartIndex + i
            const isSelected = selectedIndex === absoluteIndex
            const baseBorder = borderColorHex || '#1D431D'
            const tileBorder = isSelected ? mixWithBlack(baseBorder, 50) : mixWithBlack(baseBorder, 25)
            return (
              <motion.button
                key={absoluteIndex}
                onClick={() => onSelectIndex(absoluteIndex)}
                className={`relative h-[100px] sm:h-[176px] flex-1 rounded-2xl sm:rounded-4xl overflow-hidden cursor-pointer transition-colors duration-200 ${isSelected ? 'border-2' : 'border'}`}
                style={{ borderColor: tileBorder }}
                layout
                animate={{ scale: isSelected ? 1.05 : 1 }}
                whileHover={{ scale: prefersReducedMotion ? 1 : 1.03 }}
                whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, mass: 0.3 }}
              >
                <>
                <MiniGradientFade gradient={gradientOverlay || ''} />
                {img?.url && (
                  <Image
                    src={img.url}
                    alt={img.altText || ''}
                    height={img.height}
                    width={img.width}
                    className="absolute inset-0 size-full object-contain z-[1]"
                  />
                )}
                </>
              </motion.button>
            )
          })}
        </motion.div>
        <button
          type="button"
          aria-label="Next thumbnails"
          className="px-2 py-1 rounded-md border border-[#1D431D]/30 text-[#1D431D] disabled:opacity-40"
          onClick={() => setThumbStartIndex((s) => Math.min(Math.max(0, images.length - 3), s + 1))}
          disabled={thumbStartIndex >= Math.max(0, images.length - 3)}
        >
          ›
        </button>
      </div>
    </div>
  )
}


