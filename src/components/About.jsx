import { motion } from 'framer-motion'
import portfolio from '../data/portfolio.js'
import { assetPath, formatCount } from '../lib/assets.js'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js'
import VideoCard from './VideoCard.jsx'

const visuals = [portfolio.videos[0], portfolio.videos[10], portfolio.videos[19]].filter(Boolean)

export default function About({ onOpen }) {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <section id="about" className="scroll-mt-24 bg-[#0b0d10] py-24 sm:py-32">
      <div className="mx-auto max-w-[1600px] px-[var(--page-gutter)]">
        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: reducedMotion ? 0 : 0.75 }}
          className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20"
        >
          <div>
            <p className="text-[10px] uppercase tracking-cinematic text-brand">06 / About Visuark</p>
            <h2 className="mt-4 font-display text-[clamp(2.2rem,6.5vw,6rem)] font-black uppercase leading-[0.92] tracking-[-0.05em]">
              Creativity meets execution.
            </h2>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              Visuark is a digital creative agency focused on visual storytelling, content production and creative experiences that help brands communicate better.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5 border-t border-white/10 pt-7">
              <div>
                <p className="font-display text-3xl font-black tracking-tight text-white">{formatCount(portfolio.categories.length)}</p>
                <p className="mt-1 text-[10px] uppercase tracking-cinematic text-white/45">Creative disciplines</p>
              </div>
              <div>
                <p className="font-display text-3xl font-black tracking-tight text-white">{formatCount(portfolio.videos.length)}</p>
                <p className="mt-1 text-[10px] uppercase tracking-cinematic text-white/45">Films in the archive</p>
              </div>
              <img src={assetPath(portfolio.site.logo)} alt="VISUARK" width="1163" height="422" className="logo-on-dark h-8 w-auto object-contain opacity-70" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {visuals.map((video, index) => (
              <VideoCard
                key={video.id}
                video={video}
                onOpen={onOpen}
                variant={index === 0 ? 'featuredWide' : 'gallery'}
                showMeta={false}
                className={index === 0 ? 'col-span-2' : ''}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
