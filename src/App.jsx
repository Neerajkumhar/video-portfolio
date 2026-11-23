import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'
import portfolio from './data/portfolio.js'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import CategoryShowcase from './components/CategoryShowcase.jsx'
import HorizontalVideoMarquee from './components/HorizontalVideoMarquee.jsx'
import FeaturedProjects from './components/FeaturedProjects.jsx'
import VideoGallery from './components/VideoGallery.jsx'
import Capabilities from './components/Capabilities.jsx'
import About from './components/About.jsx'
import ContactCTA from './components/ContactCTA.jsx'
import Footer from './components/Footer.jsx'
import VideoModal from './components/VideoModal.jsx'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion.js'

const marqueeRows = [0, 1, 2].map((offset) => portfolio.videos.filter((_, index) => index % 3 === offset))

export default function App() {
  const [modal, setModal] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) return undefined
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 0.9 })
    let frame
    const loop = (time) => {
      lenis.raf(time)
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)

    const onAnchorClick = (event) => {
      const anchor = event.target.closest?.('a[href^="#"]')
      if (!anchor) return
      const id = anchor.getAttribute('href')
      if (!id || id === '#') return
      const target = document.querySelector(id)
      if (!target) return
      event.preventDefault()
      lenis.scrollTo(target, { offset: -72 })
    }

    document.addEventListener('click', onAnchorClick)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('click', onAnchorClick)
      lenis.destroy()
    }
  }, [reducedMotion])

  const openVideo = useCallback((video, list = portfolio.videos) => {
    const index = Math.max(0, list.findIndex((item) => item.id === video.id))
    setModal({ list, index })
  }, [])

  const openShowreel = useCallback(() => {
    const video = portfolio.videos.find((item) => item.id === portfolio.showreel.videoId)
    if (video) openVideo(video)
  }, [openVideo])

  const closeModal = useCallback(() => setModal(null), [])
  const navigateModal = useCallback((index) => {
    setModal((current) => (current ? { ...current, index } : current))
  }, [])
  const selectCategory = useCallback((id) => setActiveCategory(id), [])

  return (
    <>
      <Navbar />
      <main>
        <Hero onOpenShowreel={openShowreel} />
        <CategoryShowcase onSelectCategory={selectCategory} />
        <div aria-label="Moving video showcase">
          <HorizontalVideoMarquee videos={marqueeRows[0]} direction="forward" label="Showcase / Row 01" onOpen={openVideo} />
          <HorizontalVideoMarquee videos={marqueeRows[1]} direction="reverse" label="Showcase / Row 02" onOpen={openVideo} />
          <HorizontalVideoMarquee videos={marqueeRows[2]} direction="forward" label="Showcase / Row 03" onOpen={openVideo} />
        </div>
        <FeaturedProjects onOpen={openVideo} />
        <VideoGallery activeCategory={activeCategory} onChangeCategory={selectCategory} onOpen={openVideo} />
        <Capabilities />
        <About onOpen={openVideo} />
        <ContactCTA />
      </main>
      <Footer />
      <AnimatePresence>
        {modal && (
          <VideoModal
            key="video-modal"
            videos={modal.list}
            index={modal.index}
            onClose={closeModal}
            onNavigate={navigateModal}
          />
        )}
      </AnimatePresence>
    </>
  )
}
