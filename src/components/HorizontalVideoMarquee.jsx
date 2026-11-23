import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import VideoCard from './VideoCard.jsx'
import { useHorizontalDrag } from '../hooks/useHorizontalDrag.js'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js'

const WIDTH_PATTERN = [
  'w-[210px] sm:w-[270px]',
  'w-[260px] sm:w-[360px]',
  'w-[190px] sm:w-[240px]',
  'w-[240px] sm:w-[320px]',
]

export default function HorizontalVideoMarquee({ videos, direction = 'forward', label, onOpen }) {
  const scrollerRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [touchPaused, setTouchPaused] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches)
  const reducedMotion = usePrefersReducedMotion()
  const { isDragging, dragHandlers } = useHorizontalDrag(scrollerRef)
  const isPaused = hovered || focused || isDragging || touchPaused || reducedMotion

  useEffect(() => {
    const element = scrollerRef.current
    if (!element) return
    const frame = requestAnimationFrame(() => {
      element.scrollLeft = direction === 'forward' ? element.scrollWidth / 2 : 0
    })
    return () => cancelAnimationFrame(frame)
  }, [direction])

  useEffect(() => {
    const element = scrollerRef.current
    if (!element || isPaused) return undefined
    let frame
    let last = performance.now()
    const speed = 0.052

    const step = (now) => {
      const delta = Math.min(now - last, 50)
      last = now
      const half = element.scrollWidth / 2
      if (half > 0) {
        const amount = direction === 'forward' ? -speed * delta : speed * delta
        let next = element.scrollLeft + amount
        if (direction === 'forward' && next <= 0) next += half
        if (direction === 'reverse' && next >= half) next -= half
        element.scrollLeft = next
      }
      frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [direction, isPaused])

  useEffect(() => {
    if (!touchPaused) return undefined
    const timer = setTimeout(() => setTouchPaused(false), 1800)
    return () => clearTimeout(timer)
  }, [touchPaused])

  useEffect(() => {
    const query = window.matchMedia('(max-width: 639px)')
    const onChange = (event) => setIsSmallScreen(event.matches)
    query.addEventListener?.('change', onChange)
    return () => query.removeEventListener?.('change', onChange)
  }, [])

  const cards = [...videos, ...videos]

  return (
    <div className="border-y border-white/10 py-6">
      <div className="mx-auto mb-5 flex max-w-[1600px] items-center justify-between px-[var(--page-gutter)]">
        <p className="text-[10px] uppercase tracking-cinematic text-white/45">{label}</p>
        <p className="text-[10px] uppercase tracking-cinematic text-brand">
          {isPaused ? 'Paused' : direction === 'forward' ? '← Moving' : 'Moving →'}
        </p>
      </div>
      <div
        ref={scrollerRef}
        className="scrollbar-hide flex gap-4 overflow-x-auto overscroll-x-contain px-[var(--page-gutter)] sm:gap-6"
        style={{ touchAction: 'pan-x' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
        }}
        onTouchStart={() => setTouchPaused(true)}
        {...dragHandlers}
        aria-label={`${label} video gallery`}
      >
        {cards.map((video, index) => (
          <motion.div
            key={`${video.id}-${index}`}
            className={`${WIDTH_PATTERN[index % WIDTH_PATTERN.length]} shrink-0`}
            initial={reducedMotion ? undefined : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <VideoCard
              video={video}
              onOpen={(item) => onOpen(item, videos)}
              variant={video.orientation === 'landscape' ? 'marqueeWide' : 'marquee'}
              autoPlayPreview={!isPaused && !isSmallScreen}
              className={video.orientation === 'landscape' ? 'aspect-video' : 'aspect-[9/16]'}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
