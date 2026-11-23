import { useEffect, useId, useRef, useState } from 'react'
import { Play, VideoOff } from 'lucide-react'
import { useVideoVisibility } from '../hooks/useVideoVisibility.js'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js'
import { registerPreview, setPreviewWanted, unregisterPreview } from '../lib/previewController.js'
import { assetPath, formatCount, formatDuration } from '../lib/assets.js'

const VARIANT_CLASSES = {
  gallery: 'aspect-[9/16]',
  marquee: 'aspect-[9/16]',
  marqueeWide: 'aspect-video',
  category: 'aspect-square',
  featured: 'aspect-[4/5]',
  featuredWide: 'aspect-video',
}

export default function VideoCard({
  video,
  onOpen,
  variant = 'gallery',
  className = '',
  autoPlayPreview = false,
  showMeta = true,
}) {
  const containerRef = useRef(null)
  const videoRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [failed, setFailed] = useState(false)
  const previewId = useId()
  const isVisible = useVideoVisibility(containerRef, { rootMargin: autoPlayPreview ? '320px' : '140px' })
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const element = videoRef.current
    if (!element || failed) return undefined
    registerPreview(previewId, element)
    return () => unregisterPreview(previewId)
  }, [previewId, failed])

  useEffect(() => {
    const wanted = Boolean(isVisible && !reducedMotion && !failed && (hovered || autoPlayPreview))
    setPreviewWanted(previewId, wanted, hovered && !autoPlayPreview)
  }, [previewId, isVisible, reducedMotion, failed, hovered, autoPlayPreview])

  useEffect(() => {
    if (!isVisible && videoRef.current?.readyState > 0) {
      try {
        videoRef.current.currentTime = 0
      } catch {
        return
      }
    }
  }, [isVisible])

  const aspect = VARIANT_CLASSES[variant] || VARIANT_CLASSES.gallery

  return (
    <button
      ref={containerRef}
      type="button"
      onClick={() => onOpen?.(video)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      aria-label={`Open ${video.title} from ${video.categoryLabel}`}
      className={`group relative block w-full overflow-hidden border border-white/10 bg-surface text-left transition-colors duration-300 hover:border-brand/60 focus-visible:border-brand ${aspect} ${className}`}
    >
      {failed ? (
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface px-4 text-center">
          <VideoOff className="h-6 w-6 text-muted" aria-hidden="true" />
          <span className="text-[11px] uppercase tracking-cinematic text-muted">Preview unavailable</span>
          <span className="line-clamp-2 text-xs text-white/70">{video.title}</span>
        </span>
      ) : (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          poster={assetPath(video.poster)}
          preload={isVisible ? 'metadata' : 'none'}
          muted
          loop
          playsInline
          disablePictureInPicture
          onError={() => setFailed(true)}
        >
          <source src={assetPath(video.previewSrc)} type="video/mp4" />
        </video>
      )}

      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-90" />

      <span className="pointer-events-none absolute left-4 top-4 flex items-center gap-2">
        <span className="bg-black/55 px-2 py-1 text-[10px] font-medium uppercase tracking-cinematic text-white/80">
          {formatCount(video.index)}
        </span>
        {autoPlayPreview && (
          <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
        )}
      </span>

      <span className="pointer-events-none absolute right-4 top-4 flex h-10 w-10 items-center justify-center border border-white/40 bg-black/35 text-white opacity-100 transition-opacity duration-300 group-focus-visible:opacity-100 sm:h-9 sm:w-9 sm:opacity-0 sm:group-hover:opacity-100">
        <Play className="ml-0.5 h-3.5 w-3.5 fill-current" aria-hidden="true" />
      </span>

      {showMeta && (
        <span className="pointer-events-none absolute inset-x-4 bottom-4 block">
          <span className="block text-[10px] uppercase tracking-cinematic text-brand">{video.categoryLabel}</span>
          <span className="mt-1 block truncate font-display text-sm font-semibold uppercase tracking-wide text-white">
            {video.title}
          </span>
          <span className="mt-1 block text-[11px] text-white/55">{formatDuration(video.duration)}</span>
        </span>
      )}
    </button>
  )
}
