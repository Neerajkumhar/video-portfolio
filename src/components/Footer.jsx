import portfolio from '../data/portfolio.js'
import { assetPath } from '../lib/assets.js'

const LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Categories', href: '#categories' },
  { label: 'Our Work', href: '#work' },
  { label: 'About', href: '#about' },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink py-12">
      <div className="mx-auto max-w-[1600px] px-[var(--page-gutter)]">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <a href="#home" aria-label="VISUARK home">
              <img
                src={assetPath(portfolio.site.logo)}
                alt="VISUARK"
                width="1163"
                height="422"
                className="logo-on-dark h-9 w-auto object-contain"
              />
            </a>
            <p className="mt-5 text-sm leading-relaxed text-white/50">
              A digital creative agency focused on visual storytelling, content production and creative experiences.
            </p>
          </div>

          <nav className="flex flex-col gap-3" aria-label="Footer navigation">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href} className="text-xs uppercase tracking-[0.14em] text-white/55 transition-colors hover:text-brand">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-4">
            <p className="text-[10px] uppercase tracking-cinematic text-white/40">Have a project?</p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.14em] text-brand transition-opacity hover:opacity-70"
            >
              Let&apos;s Work Together
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-[10px] uppercase tracking-cinematic text-white/35">
          <span>© {new Date().getFullYear()} VISUARK. All rights reserved.</span>
          <span>Visual storytelling · Creative editing</span>
        </div>
      </div>
    </footer>
  )
}
