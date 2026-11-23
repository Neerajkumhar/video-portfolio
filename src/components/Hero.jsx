import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Play } from 'lucide-react'
import portfolio from '../data/portfolio.js'
import { assetPath } from '../lib/assets.js'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js'
import MagneticButton from './MagneticButton.jsx'

const heroVideo = portfolio.videos.find((video) => video.id === portfolio.hero.videoId) || portfolio.videos[0]

export default function Hero({ onOpenShowreel }) {
  const videoRef = useRef(null)
  const [videoFailed, setVideoFailed] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  const reveal = (delay = 0) => ({
    initial: reducedMotion ? { opacity: 1 } : { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reducedMotion ? 0 : 0.85, delay: reducedMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
  })

  return (
    <section id="home" className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink pb-16 pt-32 sm:pb-20">
      <div className="absolute inset-0">
        {!videoFailed && (
          <video
            ref={videoRef}
            className="h-full w-full object-cover object-center"
            poster={assetPath(heroVideo.poster)}
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            preload="auto"
            onError={() => setVideoFailed(true)}
          >
            <source src={assetPath(heroVideo.src)} type="video/mp4" />
          </video>
        )}
        {videoFailed && (
          <img
            src={assetPath(heroVideo.poster)}
            alt=""
            className="h-full w-full object-cover object-center"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/65 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/50" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <motion.div
        className="pointer-events-none absolute left-1/2 top-[22%] -translate-x-1/2 select-none whitespace-nowrap font-display text-[clamp(4rem,16vw,18rem)] font-black leading-none tracking-[-0.08em] text-white/[0.035]"
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, letterSpacing: '0.08em' }}
        animate={{ opacity: 1, letterSpacing: '-0.08em' }}
        transition={{ duration: reducedMotion ? 0 : 1.8, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      >
        VISUARK
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-[var(--page-gutter)]">
        <motion.div {...reveal(0.05)} className="flex items-center gap-3">
          <span className="h-px w-10 bg-brand" />
          <span className="text-[10px] font-medium uppercase tracking-cinematic text-brand">
            Visual Storytelling · Creative Editing
          </span>
        </motion.div>

        <motion.h1
          {...reveal(0.15)}
          className="mt-6 max-w-[16ch] font-display text-[clamp(2.7rem,8vw,8.5rem)] font-black uppercase leading-[0.9] tracking-[-0.045em] text-white"
        >
          We don&apos;t just create videos.
          <span className="block text-brand">We create impact.</span>
        </motion.h1>

        <motion.p
          {...reveal(0.28)}
          className="mt-7 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base"
        >
          {portfolio.site.description}
        </motion.p>

        <motion.div {...reveal(0.4)} className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
          <MagneticButton as="a" href="#work" className="min-w-[190px]">
            Explore Our Work
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </MagneticButton>
          <MagneticButton variant="outline" onClick={onOpenShowreel} className="min-w-[175px] bg-black/20 backdrop-blur-sm">
            <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
            Watch Showreel
          </MagneticButton>
        </motion.div>

        <motion.div {...reveal(0.55)} className="mt-14 flex items-end justify-between gap-6 border-t border-white/15 pt-5">
          <div className="text-[10px] uppercase tracking-cinematic text-white/45">
            <span className="text-white/80">VISUARK</span> / Motion Portfolio
          </div>
          <a
            href="#categories"
            className="group flex items-center gap-3 text-[10px] uppercase tracking-cinematic text-white/50 transition-colors hover:text-brand"
            aria-label="Scroll to categories"
          >
            Scroll
            <span className="relative flex h-8 w-5 items-start justify-center border border-white/35 pt-1.5">
              <motion.span
                className="block h-2 w-px bg-brand"
                animate={reducedMotion ? undefined : { y: [0, 10, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </span>
            <ArrowDown className="h-3 w-3" aria-hidden="true" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
