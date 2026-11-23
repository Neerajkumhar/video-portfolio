import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import portfolio from '../data/portfolio.js'
import { assetPath, formatCount } from '../lib/assets.js'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js'
import { useHoverPreview } from '../hooks/useHoverPreview.js'

function CategoryCard({ category, cover, onSelect, reducedMotion, index }) {
  const { videoRef, setHovered, failed, setFailed, isVisible } = useHoverPreview()

  return (
    <motion.li
      initial={reducedMotion ? undefined : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reducedMotion ? 0 : 0.5, delay: reducedMotion ? 0 : index * 0.04 }}
    >
      <button
        type="button"
        onClick={onSelect}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        className="group relative flex h-full min-h-[210px] w-full flex-col justify-between overflow-hidden bg-surface p-6 text-left transition-colors duration-300 hover:bg-[#14171c] focus-visible:bg-[#14171c]"
        aria-label={`View ${category.name} videos`}
      >
        {cover && !failed ? (
          <video
            ref={videoRef}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-20 transition-all duration-700 group-hover:scale-105 group-hover:opacity-35"
            poster={assetPath(cover.poster)}
            preload={isVisible ? 'metadata' : 'none'}
            muted
            loop
            playsInline
            disablePictureInPicture
            onError={() => setFailed(true)}
          >
            <source src={assetPath(cover.previewSrc)} type="video/mp4" />
          </video>
        ) : (
          cover && (
            <img
              src={assetPath(cover.poster)}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-20 transition-all duration-700 group-hover:scale-105 group-hover:opacity-35"
            />
          )
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-surface via-surface/70 to-transparent" />
        <span className="relative flex items-start justify-between">
          <span className="font-display text-5xl font-black leading-none tracking-[-0.06em] text-white/10">
            {category.number}
          </span>
          <span className="text-[10px] uppercase tracking-cinematic text-brand">
            {formatCount(category.count)} {category.count === 1 ? 'film' : 'films'}
          </span>
        </span>
        <span className="relative mt-10 flex items-end justify-between gap-4">
          <span className="font-display text-xl font-bold uppercase leading-tight tracking-tight text-white sm:text-2xl">
            {category.name}
          </span>
          <ArrowUpRight className="h-5 w-5 shrink-0 text-white/50 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-brand" aria-hidden="true" />
        </span>
      </button>
    </motion.li>
  )
}

export default function CategoryShowcase({ onSelectCategory }) {
  const reducedMotion = usePrefersReducedMotion()
  const coverIds = new Set(portfolio.categories.map((category) => category.coverId))
  const covers = portfolio.videos.filter((video) => coverIds.has(video.id))

  const select = (id) => {
    onSelectCategory(id)
    document.getElementById('work')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <section id="categories" className="scroll-mt-24 bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-[1600px] px-[var(--page-gutter)]">
        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: reducedMotion ? 0 : 0.7 }}
          className="flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-8"
        >
          <div>
            <p className="text-[10px] uppercase tracking-cinematic text-brand">02 / Categories</p>
            <h2 className="mt-3 font-display text-[clamp(2rem,5vw,4.5rem)] font-black uppercase leading-[0.95] tracking-[-0.04em]">
              Explore the archive.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-white/55">
            Nine categories. {portfolio.videos.length} real edits. Choose a discipline to jump straight into its gallery.
          </p>
        </motion.div>

        <ul className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {portfolio.categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              cover={covers.find((video) => video.id === category.coverId)}
              onSelect={() => select(category.id)}
              reducedMotion={reducedMotion}
              index={index}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}
