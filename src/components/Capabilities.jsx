import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js'

const CAPABILITIES = [
  'Video Editing',
  'Creative Direction',
  'Commercial Production',
  'Product Videography',
  'Event Films',
  'Automotive Films',
  'Promotional Content',
  'Social Media Content',
]

export default function Capabilities() {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <section className="border-y border-white/10 bg-ink py-24 sm:py-32">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-[var(--page-gutter)] lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reducedMotion ? 0 : 0.7 }}
          className="lg:sticky lg:top-32 lg:self-start"
        >
          <p className="text-[10px] uppercase tracking-cinematic text-brand">05 / Capabilities</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,5vw,4.5rem)] font-black uppercase leading-[0.95] tracking-[-0.04em]">
            What we make.
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/55">
            From the first cut to the final frame — production and post built around the story.
          </p>
        </motion.div>

        <ul className="border-t border-white/10">
          {CAPABILITIES.map((capability, index) => (
            <motion.li
              key={capability}
              initial={reducedMotion ? undefined : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: reducedMotion ? 0 : 0.5, delay: reducedMotion ? 0 : index * 0.04 }}
              className="group flex items-center justify-between gap-4 border-b border-white/10 py-5 sm:py-7"
            >
              <span className="flex min-w-0 items-baseline gap-4 sm:gap-8">
                <span className="text-[10px] tabular-nums text-brand">{String(index + 1).padStart(2, '0')}</span>
                <span className="min-w-0 break-words font-display text-lg font-semibold uppercase tracking-tight text-white/75 transition-colors duration-300 group-hover:text-white sm:text-3xl lg:text-4xl">
                  {capability}
                </span>
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-white/25 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-brand" aria-hidden="true" />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
