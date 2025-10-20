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

      <div className="flex flex-col gap-3 items-center w-full">
        <div className="flex w-full items-center justify-center gap-2 sm:gap-3">
          <motion.button
            type="button"
            aria-label="Previous image"
            className="flex items-center justify-center shrink-0 transition-all duration-200 disabled:cursor-not-allowed"
            onClick={() => {
              if (selectedIndex > 0) {
                onSelectIndexSafe(selectedIndex - 1);
              }
            }}
            disabled={selectedIndex === 0}
            whileHover={{ scale: selectedIndex === 0 ? 1 : 1.08 }}
            whileTap={{ scale: selectedIndex === 0 ? 1 : 0.95 }}
            style={{ opacity: selectedIndex === 0 ? 0.5 : 1 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none" className="w-9 h-9 sm:w-10 sm:h-10">
              <circle 
                cx="18" 
                cy="18" 
                r="17.5" 
                fill={selectedIndex === 0 ? 'rgba(0,0,0,0.05)' : mixWithBlack(borderColorHex || '#1D431D', 12)} 
                stroke={selectedIndex === 0 ? 'rgba(0,0,0,0.15)' : mixWithBlack(borderColorHex || '#1D431D', 25)} 
                strokeWidth="1"
              />
              <path 
                d="M20 12L14 18L20 24" 
                stroke={selectedIndex === 0 ? 'rgba(0,0,0,0.3)' : mixWithBlack(borderColorHex || '#1D431D', 40)} 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </motion.button>
          <motion.div className="flex flex-1 items-center gap-2 sm:gap-3 justify-center" layout>
            {images.slice(thumbStartIndex, thumbStartIndex + 3).map((img, i) => {
              const absoluteIndex = thumbStartIndex + i
              const isSelected = selectedIndex === absoluteIndex
              const baseBorder = borderColorHex || '#1D431D'
              const tileBorder = isSelected ? mixWithBlack(baseBorder, 18) : mixWithBlack(baseBorder, 8)
              return (
                <motion.button
                  key={absoluteIndex}
                  onClick={() => onSelectIndexSafe(absoluteIndex)}
                  className={`relative flex-1 max-w-[100px] sm:max-w-[140px] aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transition-colors duration-200 ${isSelected ? 'border-2' : 'border'}`}
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
            aria-label="Next image"
            className="flex items-center justify-center shrink-0 transition-all duration-200 disabled:cursor-not-allowed"
            onClick={() => {
              if (selectedIndex < images.length - 1) {
                onSelectIndexSafe(selectedIndex + 1);
              }
            }}
            disabled={selectedIndex === images.length - 1}
            whileHover={{ scale: selectedIndex === images.length - 1 ? 1 : 1.08 }}
            whileTap={{ scale: selectedIndex === images.length - 1 ? 1 : 0.95 }}
            style={{ opacity: selectedIndex === images.length - 1 ? 0.5 : 1 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none" className="w-9 h-9 sm:w-10 sm:h-10">
              <circle 
                cx="18" 
                cy="18" 
                r="17.5" 
                fill={selectedIndex === images.length - 1 ? 'rgba(0,0,0,0.05)' : mixWithBlack(borderColorHex || '#1D431D', 12)} 
                stroke={selectedIndex === images.length - 1 ? 'rgba(0,0,0,0.15)' : mixWithBlack(borderColorHex || '#1D431D', 25)} 
                strokeWidth="1"
              />
              <path 
                d="M16 12L22 18L16 24" 
                stroke={selectedIndex === images.length - 1 ? 'rgba(0,0,0,0.3)' : mixWithBlack(borderColorHex || '#1D431D', 40)} 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </motion.button>
        </div>
        
        {/* Image counter indicator */}
        {images.length > 3 && (
          <div className="flex items-center justify-center gap-1.5">
            {images.map((_, index) => {
              const isActive = index === selectedIndex;
              const isInView = index >= thumbStartIndex && index < thumbStartIndex + 3;
              return (
                <button
                  key={index}
                  onClick={() => onSelectIndexSafe(index)}
                  className="transition-all duration-200"
                  style={{
                    width: isActive ? '24px' : '6px',
                    height: '6px',
                    borderRadius: isActive ? '3px' : '50%',
                    backgroundColor: isActive 
                      ? mixWithBlack(borderColorHex || '#1D431D', 40)
                      : isInView
                        ? mixWithBlack(borderColorHex || '#1D431D', 15)
                        : 'rgba(0,0,0,0.1)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  aria-label={`Go to image ${index + 1}`}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}


