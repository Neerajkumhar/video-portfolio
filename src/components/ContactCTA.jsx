import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Copy, Share2, X } from 'lucide-react'
import MagneticButton from './MagneticButton.jsx'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js'

export default function ContactCTA() {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState('')
  const closeRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (!open) return undefined
    const previousFocus = document.activeElement
    closeRef.current?.focus()
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      previousFocus?.focus?.()
    }
  }, [open])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setStatus('Portfolio link copied.')
    } catch {
      setStatus('Copy the address bar link to share this portfolio.')
    }
  }

  const share = async () => {
    if (!navigator.share) {
      await copyLink()
      return
    }
    try {
      await navigator.share({
        title: 'VISUARK — Cinematic Video Portfolio',
        text: 'Explore the real editing work from VISUARK.',
        url: window.location.href,
      })
    } catch {
      setStatus('Sharing was cancelled.')
    }
  }

  return (
    <section id="contact" className="scroll-mt-24 relative overflow-hidden border-t border-white/10 bg-ink py-28 sm:py-40">
      <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-brand/60 to-transparent" aria-hidden="true" />
      <div className="mx-auto max-w-[1600px] px-[var(--page-gutter)] text-center">
        <motion.p
          initial={reducedMotion ? undefined : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reducedMotion ? 0 : 0.6 }}
          className="text-[10px] uppercase tracking-cinematic text-brand"
        >
          07 / Get in touch
        </motion.p>
        <motion.h2
          initial={reducedMotion ? undefined : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: reducedMotion ? 0 : 0.75 }}
          className="mx-auto mt-5 max-w-[18ch] font-display text-[clamp(2.4rem,8vw,8rem)] font-black uppercase leading-[0.9] tracking-[-0.05em]"
        >
          Have a project in mind?
        </motion.h2>
        <motion.p
          initial={reducedMotion ? undefined : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: reducedMotion ? 0 : 0.75, delay: 0.1 }}
          className="mx-auto mt-7 max-w-xl text-base text-white/60 sm:text-lg"
        >
          Let&apos;s create something worth watching.
        </motion.p>
        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: reducedMotion ? 0 : 0.75, delay: 0.18 }}
          className="mt-10 flex justify-center"
        >
          <MagneticButton onClick={() => setOpen(true)} className="min-w-[240px]">
            Let&apos;s Create Together
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </MagneticButton>
        </motion.div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 px-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setOpen(false)
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Start a conversation"
              className="w-full max-w-lg border border-white/15 bg-surface p-7 sm:p-10"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: reducedMotion ? 0 : 0.25 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-cinematic text-brand">Start a conversation</p>
                  <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight">Share this portfolio</h3>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close dialog"
                  className="flex h-10 w-10 items-center justify-center border border-white/20 text-white hover:border-brand hover:text-brand"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <p className="mt-6 text-sm leading-relaxed text-white/60">
                No contact details were supplied with these portfolio assets. Share the link directly with the Visuark team or pass it on from here.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={share}
                  className="inline-flex min-h-[44px] items-center gap-2 border border-brand bg-brand px-5 text-[11px] font-semibold uppercase tracking-cinematic text-ink transition-colors hover:bg-transparent hover:text-brand"
                >
                  <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Share portfolio
                </button>
                <button
                  type="button"
                  onClick={copyLink}
                  className="inline-flex min-h-[44px] items-center gap-2 border border-white/25 px-5 text-[11px] font-semibold uppercase tracking-cinematic text-white transition-colors hover:border-brand hover:text-brand"
                >
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  Copy link
                </button>
              </div>
              <p role="status" aria-live="polite" className="mt-5 min-h-[1rem] text-xs text-brand">{status}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
