import { useEffect, useState } from 'react'

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  ))

  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!query) return undefined
    const update = (event) => setReduced(event.matches)
    query.addEventListener?.('change', update)
    return () => query.removeEventListener?.('change', update)
  }, [])

  return Boolean(reduced)
}
