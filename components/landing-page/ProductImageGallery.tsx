'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { heroFadeDuration, motionEasings } from '@/lib/animation'
import Image from 'next/image'
import { fadeOnly } from '@/lib/animation'
import { useEffect, useRef, useState } from 'react'
import { MiniGradientFade } from '@/components/landing-page/MiniGradientFade'
import { mixWithBlack } from '@/lib/color'
import { BorderBeam } from '@/components/ui/border-beam'
import wordmarkSvg from "@/assets/turks-wordmark.svg"

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
  const [isImageTransitioning, setIsImageTransitioning] = useState(false)
  const queuedIndexRef = useRef<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  // Keyboard navigation can be added on interactive elements (e.g., buttons) to avoid a11y violations

  // Image crossfade duration
  const imageFadeDuration = 0.4

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
  const scheduleProcess = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      if (queuedIndexRef.current !== null) {
        const next = queuedIndexRef.current
        queuedIndexRef.current = null
        onSelectIndex(next)
        scheduleProcess()
      } else {
        setIsImageTransitioning(false)
        timerRef.current = null
      }
    }, Math.round(imageFadeDuration * 1000))
  }

  const onSelectIndexSafe = (index: number) => {
    if (isImageTransitioning) {
      queuedIndexRef.current = index
      return
    }
    setIsImageTransitioning(true)
    onSelectIndex(index)
    scheduleProcess()
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <div className="flex flex-col items-start gap-3 sm:gap-5 w-full">
      <motion.div
        className="relative rounded-2xl sm:rounded-4xl w-full h-[347px] sm:h-[615px] overflow-hidden border"
        style={{ background: gradientOverlay }}
        animate={{ borderColor: mixWithBlack(borderColorHex || '#1D431D', 12) }}
        transition={{ duration: heroFadeDuration, ease: motionEasings.out }}
      >
        {/* gradient applied statically via background above */}
        <AnimatePresence mode="wait" initial={false}>
          {images[selectedIndex]?.url && (
            <motion.div
              key={images[selectedIndex]?.url || String(selectedIndex)}
              variants={fadeOnly}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            transition={{ duration: imageFadeDuration, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src={images[selectedIndex].url}
                alt={images[selectedIndex].altText || ''}
                height={images[selectedIndex].height}
                width={images[selectedIndex].width}
                className="size-full object-cover scale-125 sm:scale-100"
                priority
              />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Logo watermark in bottom center */}
        <motion.div 
          className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 w-24 sm:w-32 z-10 pointer-events-none"
          animate={{ 
            backgroundColor: '#1D431D'
          }}
          transition={{ duration: heroFadeDuration, ease: motionEasings.out }}
          style={{
            WebkitMaskImage: `url(${wordmarkSvg.src})`,
            WebkitMaskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskImage: `url(${wordmarkSvg.src})`,
            maskSize: 'contain',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            opacity: 0.25,
            aspectRatio: '3/1'
          }}
        />
        
        {/* Subtle border beam placed last to render above the image */}
        <>
          <BorderBeam
            size={120}
            duration={16}
            borderWidth={1}
            initialOffset={0}
            colorFrom={mixWithBlack(borderColorHex || '#1D431D', 28)}
            colorTo={mixWithBlack(borderColorHex || '#1D431D', 55)}
            style={{ opacity: 0.6 }}
          />
          <BorderBeam
            size={120}
            duration={16}
            borderWidth={1}
            initialOffset={50}
            colorFrom={mixWithBlack(borderColorHex || '#1D431D', 28)}
            colorTo={mixWithBlack(borderColorHex || '#1D431D', 55)}
            style={{ opacity: 0.6 }}
          />
        </>
      </motion.div>

      <div className="flex w-full items-center gap-3 sm:gap-5">
        <motion.button
          type="button"
          aria-label="Previous thumbnails"
          className="flex items-center justify-center size-9 sm:size-11 rounded-full border-2 text-lg sm:text-xl font-bold transition-all duration-200"
          style={{ 
            borderColor: mixWithBlack(borderColorHex || '#1D431D', 18),
            color: mixWithBlack(borderColorHex || '#1D431D', 40),
            backgroundColor: borderColorHex ? `${borderColorHex}10` : 'rgba(29, 67, 29, 0.06)'
          }}
          onClick={() => setThumbStartIndex((s) => Math.max(0, s - 1))}
          disabled={thumbStartIndex === 0}
          whileHover={{ scale: thumbStartIndex === 0 ? 1 : 1.1 }}
          whileTap={{ scale: thumbStartIndex === 0 ? 1 : 0.95 }}
        >
          ‹
        </motion.button>
        <motion.div className="flex w-full items-center gap-5" layout>
          {images.slice(thumbStartIndex, thumbStartIndex + 3).map((img, i) => {
            const absoluteIndex = thumbStartIndex + i
            const isSelected = selectedIndex === absoluteIndex
            const baseBorder = borderColorHex || '#1D431D'
            const tileBorder = isSelected ? mixWithBlack(baseBorder, 18) : mixWithBlack(baseBorder, 8)
            return (
              <motion.button
                key={absoluteIndex}
                onClick={() => onSelectIndexSafe(absoluteIndex)}
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
                    className="absolute inset-0 size-full object-contain z-[1] scale-125 sm:scale-100"
                  />
                )}
                </>
              </motion.button>
            )
          })}
        </motion.div>
        <motion.button
          type="button"
          aria-label="Next thumbnails"
          className="flex items-center justify-center size-9 sm:size-11 rounded-full border-2 text-lg sm:text-xl font-bold transition-all duration-200"
          style={{ 
            borderColor: mixWithBlack(borderColorHex || '#1D431D', 18),
            color: mixWithBlack(borderColorHex || '#1D431D', 40),
            backgroundColor: borderColorHex ? `${borderColorHex}10` : 'rgba(29, 67, 29, 0.06)'
          }}
          onClick={() => setThumbStartIndex((s) => Math.min(Math.max(0, images.length - 3), s + 1))}
          disabled={thumbStartIndex >= Math.max(0, images.length - 3)}
          whileHover={{ scale: thumbStartIndex >= Math.max(0, images.length - 3) ? 1 : 1.1 }}
          whileTap={{ scale: thumbStartIndex >= Math.max(0, images.length - 3) ? 1 : 0.95 }}
        >
          ›
        </motion.button>
      </div>
    </div>
  )
}


