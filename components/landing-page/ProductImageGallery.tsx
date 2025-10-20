'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { heroFadeDuration, motionEasings } from '@/lib/animation'
import Image from 'next/image'
import { fadeOnly } from '@/lib/animation'
import { useEffect, useRef, useState } from 'react'
import { MiniGradientFade } from '@/components/landing-page/MiniGradientFade'
import { mixWithBlack, mixWithWhite } from '@/lib/color'
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
  thcPercent?: string | number | null
  indicaPercent?: string | number | null
  sativaPercent?: string | number | null
}

export function ProductImageGallery({ images, selectedIndex, onSelectIndex, gradientOverlay, borderColorHex, thcPercent, indicaPercent, sativaPercent }: ProductImageGalleryProps) {
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

  // Derive overlay visual tokens from provided border color
  const baseColor = borderColorHex || '#1D431D'
  const overlayText = mixWithBlack(baseColor, 75)
  const chipBg = mixWithWhite(baseColor, 80)
  const chipBorder = mixWithBlack(baseColor, 25)

  // Parse and normalize meta values
  const parsePct = (v: string | number | null | undefined): number | null => {
    if (v === null || v === undefined) return null
    if (typeof v === 'number') return Number.isFinite(v) ? v : null
    const cleaned = v.replace(/[^0-9.]/g, '')
    const num = parseFloat(cleaned)
    return Number.isFinite(num) ? num : null
  }
  const thc = parsePct(thcPercent)
  let indica = parsePct(indicaPercent)
  let sativa = parsePct(sativaPercent)
  if (indica !== null && (sativa === null || !Number.isFinite(sativa))) {
    sativa = Math.max(0, Math.min(100, 100 - indica))
  }
  if (sativa !== null && (indica === null || !Number.isFinite(indica))) {
    indica = Math.max(0, Math.min(100, 100 - sativa))
  }
  // Normalize if both present but don't sum to 100
  if (indica !== null && sativa !== null) {
    const sum = indica + sativa
    if (sum > 0 && sum !== 100) {
      indica = (indica / sum) * 100
      sativa = (sativa / sum) * 100
    }
  }

  // Measure label width to size the progress bar to match the text length
  const splitLabelRef = useRef<HTMLDivElement | null>(null)
  const [splitLabelWidth, setSplitLabelWidth] = useState(0)
  useEffect(() => {
    const measure = () => {
      if (splitLabelRef.current) {
        setSplitLabelWidth(splitLabelRef.current.offsetWidth)
      }
    }
    measure()
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', measure)
      return () => window.removeEventListener('resize', measure)
    }
  }, [indica, sativa])

  return (
    <div className="flex flex-col items-start gap-3 sm:gap-5 w-full">
      <motion.div
        className="relative rounded-2xl sm:rounded-4xl w-full overflow-hidden border flex flex-col"
        style={{ background: gradientOverlay }}
        animate={{ borderColor: mixWithBlack(borderColorHex || '#1D431D', 12) }}
        transition={{ duration: heroFadeDuration, ease: motionEasings.out }}
      >
        {/* Top section with THC and Indica/Sativa split - solid background */}
        {(thc !== null || indica !== null || sativa !== null) && (
          <div
            className="relative z-20 px-3 py-2 sm:px-4 sm:py-2.5 border-b"
            style={{ 
              backgroundColor: gradientOverlay,
              borderColor: 'rgba(16, 16, 16, 0.1)'
            }}
          >
            <div className="flex items-start justify-between gap-3 sm:gap-4 w-full" style={{ color: overlayText }}>
              {thc !== null && (
                <div
                  className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm sm:text-base font-semibold"
                  style={{ backgroundColor: chipBg, borderColor: chipBorder }}
                >
                  <span>THC</span>
                  <span>{`${Math.round(thc)}%`}</span>
                </div>
              )}
              {(indica !== null || sativa !== null) && (
                <div className="flex flex-col items-end gap-1 sm:gap-1.5 ml-auto">
                  <div ref={splitLabelRef} className="text-xs sm:text-sm whitespace-nowrap opacity-90">
                    {`Indica ${Math.round(indica || 0)}% · Sativa ${Math.round(sativa || 0)}%`}
                  </div>
                  <div
                    className="h-1.5 rounded-full bg-white/40 overflow-hidden"
                    style={{ width: splitLabelWidth ? `${splitLabelWidth}px` : undefined }}
                  >
                    <div
                      className="h-full"
                      style={{ width: `${Math.max(0, Math.min(100, Math.round(indica || 0)))}%`, backgroundColor: mixWithBlack(baseColor, 25) }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Main image section - square aspect ratio */}
        <div className="relative w-full aspect-square">
          <AnimatePresence mode="wait" initial={false}>
            {images[selectedIndex]?.url && (() => {
              const currentImage = images[selectedIndex];
              const aspectRatio = currentImage.width / currentImage.height;
              // Portrait images have aspect ratio < 1
              const isPortrait = aspectRatio < 1;
              
              return (
                <motion.div
                  key={currentImage.url || String(selectedIndex)}
                  variants={fadeOnly}
                  initial="initial"
                  animate="animate"
                  exit={{ opacity: 0 }}
                  className="absolute inset-0"
                  transition={{ duration: imageFadeDuration, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image
                    src={currentImage.url}
                    alt={currentImage.altText || ''}
                    height={currentImage.height}
                    width={currentImage.width}
                    className={`size-full ${isPortrait ? 'object-contain' : 'object-cover scale-125'}`}
                    priority
                  />
                </motion.div>
              );
            })()}
          </AnimatePresence>
          
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
        </div>
        
        {/* Logo section at bottom - solid background */}
        <div 
          className="relative z-20 px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-end border-t"
          style={{ 
            backgroundColor: gradientOverlay,
            borderColor: 'rgba(16, 16, 16, 0.1)'
          }}
        >
          <motion.div 
            className="w-24 sm:w-32 pointer-events-none"
            animate={{ 
              backgroundColor: mixWithBlack(borderColorHex || '#1D431D', 50)
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
              opacity: 0.6,
              aspectRatio: '3/1'
            }}
          />
        </div>
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
                className={`relative aspect-square flex-1 rounded-2xl sm:rounded-4xl overflow-hidden cursor-pointer transition-colors duration-200 ${isSelected ? 'border-2' : 'border'}`}
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
                    className="absolute inset-0 size-full object-cover z-[1]"
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


