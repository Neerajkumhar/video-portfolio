import { useEffect, useState } from 'react'

export function useVideoVisibility(ref, { rootMargin = '160px', threshold = 0.12 } = {}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin, threshold },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, rootMargin, threshold])

  return isVisible
}
