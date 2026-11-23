import { motion } from 'framer-motion'
import { ArrowUpRight, Play } from 'lucide-react'
import portfolio from '../data/portfolio.js'
import { assetPath, formatCount } from '../lib/assets.js'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js'
import VideoCard from './VideoCard.jsx'

const featured = portfolio.featuredIds
  .map((id) => portfolio.videos.find((video) => video.id === id))
  .filter(Boolean)

export default function FeaturedProjects({ onOpen }) {
  const reducedMotion = usePrefersReducedMotion()
  const [lead, ...supporting] = featured

  return (
    <section className="bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-[1600px] px-[var(--page-gutter)]">
        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: reducedMotion ? 0 : 0.7 }}
          className="mb-10 flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <p className="text-[10px] uppercase tracking-cinematic text-brand">03 / Selected Work</p>
            <h2 className="mt-3 font-display text-[clamp(2rem,5vw,4.5rem)] font-black uppercase leading-[0.95] tracking-[-0.04em]">
              Featured edits.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-white/55">
            A cross-section of the archive — four real films from four different disciplines.
          </p>
        </motion.div>

        {lead && (
          <motion.div
            initial={reducedMotion ? undefined : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reducedMotion ? 0 : 0.8 }}
            className="grid gap-4 lg:grid-cols-12 lg:gap-6"
          >
            <div className="lg:col-span-7">
              <VideoCard
                video={lead}
                onOpen={(video) => onOpen(video, featured)}
                variant="featuredWide"
                className="lg:min-h-[560px]"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:gap-6">
              {supporting.map((video) => (
                <button
                  key={video.id}
                  type="button"
                  onClick={() => onOpen(video, featured)}
                  className="group relative flex min-h-[190px] items-end overflow-hidden border border-white/10 bg-surface text-left transition-colors hover:border-brand/60 sm:min-h-[240px] lg:min-h-0 lg:flex-1"
                  aria-label={`Open ${video.title} from ${video.categoryLabel}`}
                >
                  <img
                    src={assetPath(video.poster)}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-65 transition-all duration-700 group-hover:scale-105 group-hover:opacity-85"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border border-white/40 bg-black/30 text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <Play className="ml-0.5 h-3.5 w-3.5 fill-current" aria-hidden="true" />
                  </span>
                  <span className="relative flex w-full items-end justify-between gap-4 p-5">
                    <span>
                      <span className="block text-[10px] uppercase tracking-cinematic text-brand">
                        {video.categoryLabel} / {formatCount(video.index)}
                      </span>
                      <span className="mt-1 block font-display text-base font-semibold uppercase tracking-wide text-white sm:text-lg">
                        {video.title}
                      </span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-white/60 transition-colors group-hover:text-brand" aria-hidden="true" />
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
