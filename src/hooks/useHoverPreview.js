import { useEffect, useId, useRef, useState } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion.js'
import { useVideoVisibility } from './useVideoVisibility.js'
import { registerPreview, setPreviewWanted, unregisterPreview } from '../lib/previewController.js'

export function useHoverPreview() {
  const videoRef = useRef(null)
  const previewId = useId()
  const [hovered, setHovered] = useState(false)
  const [failed, setFailed] = useState(false)
  const isVisible = useVideoVisibility(videoRef, { rootMargin: '140px' })
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const element = videoRef.current
    if (!element || failed) return undefined
    registerPreview(previewId, element)
    return () => unregisterPreview(previewId)
  }, [previewId, failed])

  useEffect(() => {
    const wanted = Boolean(isVisible && !reducedMotion && !failed && hovered)
    setPreviewWanted(previewId, wanted, hovered)
  }, [previewId, isVisible, reducedMotion, failed, hovered])

  return { videoRef, hovered, setHovered, failed, setFailed, isVisible }
}
