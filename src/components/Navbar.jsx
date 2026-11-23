import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import portfolio from '../data/portfolio.js'
import { assetPath } from '../lib/assets.js'
import MagneticButton from './MagneticButton.jsx'

const LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Categories', href: '#categories' },
  { label: 'Our Work', href: '#work' },
  { label: 'About', href: '#about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[80] pt-[env(safe-area-inset-top)] transition-all duration-500 ${
        scrolled || menuOpen
          ? 'border-b border-white/10 bg-ink/90 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between px-[var(--page-gutter)]" aria-label="Main navigation">
        <a href="#home" className="flex min-h-11 shrink-0 items-center" aria-label="VISUARK home">
          <img
            src={assetPath(portfolio.site.logo)}
            alt="VISUARK"
            width="1163"
            height="422"
            className="logo-on-dark h-9 w-auto object-contain sm:h-10"
          />
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="group relative flex min-h-11 min-w-11 items-center justify-center text-[11px] font-medium uppercase tracking-[0.18em] text-white/65 transition-colors hover:text-white"
              >
                {link.label}
                <span className="absolute bottom-1 left-0 h-px w-0 bg-brand transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-5 lg:flex">
          <a
            href="#contact"
            className="inline-flex min-h-11 items-center text-[11px] font-medium uppercase tracking-[0.16em] text-white/65 transition-colors hover:text-brand"
          >
            Let&apos;s Work Together
          </a>
          <MagneticButton as="a" href="#contact" className="min-h-[42px] px-5">
            Contact
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </MagneticButton>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="flex h-11 w-11 items-center justify-center border border-white/20 text-white lg:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="border-t border-white/10 bg-ink/98 lg:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="flex flex-col px-[var(--page-gutter)] py-6">
              {LINKS.map((link, index) => (
                <li key={link.href} className="border-b border-white/10">
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between py-4 font-display text-lg uppercase tracking-wide text-white"
                  >
                    <span>{link.label}</span>
                    <span className="text-[10px] text-brand">0{index + 1}</span>
                  </a>
                </li>
              ))}
              <li className="pt-6">
                <MagneticButton as="a" href="#contact" onClick={() => setMenuOpen(false)} className="w-full">
                  Let&apos;s Work Together
                </MagneticButton>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
