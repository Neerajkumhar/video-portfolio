import { useMemo } from 'react'
import { motion } from 'framer-motion'
import portfolio from '../data/portfolio.js'
import { formatCount } from '../lib/assets.js'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js'
import VideoCard from './VideoCard.jsx'

const FILTERS = [{ id: 'all', name: 'All Work' }, ...portfolio.categories.map(({ id, name }) => ({ id, name }))]

export default function VideoGallery({ activeCategory, onChangeCategory, onOpen }) {
  const reducedMotion = usePrefersReducedMotion()
  const videos = useMemo(
    () => activeCategory === 'all'
      ? portfolio.videos
      : portfolio.videos.filter((video) => video.category === activeCategory),
    [activeCategory],
  )
  const label = FILTERS.find((filter) => filter.id === activeCategory)?.name || 'All Work'

  return (
    <section id="work" className="scroll-mt-24 border-t border-white/10 bg-[#0b0d10] py-24 sm:py-32">
      <div className="mx-auto max-w-[1600px] px-[var(--page-gutter)]">
        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: reducedMotion ? 0 : 0.7 }}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <p className="text-[10px] uppercase tracking-cinematic text-brand">04 / Our Work</p>
            <h2 className="mt-3 font-display text-[clamp(2rem,5vw,4.5rem)] font-black uppercase leading-[0.95] tracking-[-0.04em]">
              Every edit, on record.
            </h2>
          </div>
          <p className="text-[10px] uppercase tracking-cinematic text-white/45">
            Showing {formatCount(videos.length)} / {formatCount(portfolio.videos.length)} films
          </p>
        </motion.div>

        <div className="mt-10 flex gap-2 overflow-x-auto border-y border-white/10 py-4 scrollbar-hide" role="group" aria-label="Filter videos by category">
          {FILTERS.map((filter) => {
            const count = filter.id === 'all'
              ? portfolio.videos.length
              : portfolio.categories.find((category) => category.id === filter.id)?.count || 0
            const active = activeCategory === filter.id
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => onChangeCategory(filter.id)}
                aria-pressed={active}
                className={`inline-flex min-h-11 shrink-0 items-center border px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.16em] transition-colors duration-300 ${
                  active
                    ? 'border-brand bg-brand text-ink'
                    : 'border-white/15 text-white/60 hover:border-white/40 hover:text-white'
                }`}
              >
                {filter.name}
                <span className={`ml-2 tabular-nums ${active ? 'text-ink/60' : 'text-white/30'}`}>
                  {formatCount(count)}
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-8 flex items-baseline justify-between gap-4">
          <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-white">{label}</h3>
          <span className="hidden text-[10px] uppercase tracking-cinematic text-white/35 sm:inline">
            Hover to preview · Click to play
          </span>
          <span className="text-[10px] uppercase tracking-cinematic text-white/35 sm:hidden">
            Tap to preview · Tap to play
          </span>
        </div>

        {videos.length ? (
          <div className="mt-6 grid grid-cols-1 gap-4 xs:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={reducedMotion ? undefined : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: reducedMotion ? 0 : 0.45, delay: reducedMotion ? 0 : Math.min(index, 8) * 0.03 }}
              >
                <VideoCard video={video} onOpen={(item) => onOpen(item, videos)} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div role="status" className="mt-6 border border-white/10 bg-surface px-6 py-16 text-center">
            <p className="font-display text-lg uppercase tracking-wide">No videos in this category</p>
            <button type="button" onClick={() => onChangeCategory('all')} className="mt-4 inline-flex min-h-11 items-center text-xs uppercase tracking-cinematic text-brand">
              View all work
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
