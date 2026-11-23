import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import { assetPath, formatDuration } from '../lib/assets.js'

const CONTROL_CLASS = 'flex h-10 w-10 items-center justify-center border border-white/20 text-white transition-colors hover:border-brand hover:bg-brand/10 focus-visible:border-brand'

export default function VideoModal({ videos, index, onClose, onNavigate }) {
  const current = videos[index]
  const frameRef = useRef(null)
  const videoRef = useRef(null)
  const closeRef = useRef(null)
  const dialogRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(current?.duration || 0)
  const [failed, setFailed] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video || failed) return
    if (video.paused) {
      const attempt = video.play()
      if (attempt && typeof attempt.catch === 'function') attempt.catch(() => setPlaying(false))
    } else {
      video.pause()
    }
  }, [failed])

  const replay = useCallback(() => {
    const video = videoRef.current
    if (!video || failed) return
    video.currentTime = 0
    const attempt = video.play()
    if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {})
  }, [failed])

  const navigate = useCallback((direction) => {
    const length = videos.length
    if (!length) return
    onNavigate((index + direction + length) % length)
  }, [index, onNavigate, videos.length])

  useEffect(() => {
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
      previousFocus?.focus?.()
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !current) return
    setFailed(false)
    setCurrentTime(0)
    setDuration(current.duration || 0)
    video.load()
    const attempt = video.play()
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(() => {
        video.muted = true
        setMuted(true)
        video.play().catch(() => setPlaying(false))
      })
    }
  }, [current?.id])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined
    const updateTime = () => {
      setCurrentTime(video.currentTime || 0)
      if (Number.isFinite(video.duration)) setDuration(video.duration)
    }
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement))
    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateTime)
    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    video.addEventListener('ended', onPause)
    document.addEventListener('fullscreenchange', onFullscreen)
    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateTime)
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
      video.removeEventListener('ended', onPause)
      document.removeEventListener('fullscreenchange', onFullscreen)
    }
  }, [current?.id])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        navigate(1)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        navigate(-1)
      } else if (event.key === ' ' && event.target === document.body) {
        event.preventDefault()
        togglePlay()
      } else if (event.key === 'Tab') {
        const focusables = dialogRef.current?.querySelectorAll('button:not([disabled]), input:not([disabled])')
        if (!focusables?.length) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [navigate, onClose, togglePlay])

  if (!current) return null

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.()
      return
    }
    frameRef.current?.requestFullscreen?.()
  }

  const toggleMute = () => {
    const next = !muted
    setMuted(next)
    if (videoRef.current) videoRef.current.muted = next
  }

  const changeVolume = (event) => {
    const next = Number(event.target.value)
    setVolume(next)
    setMuted(next === 0)
    if (videoRef.current) {
      videoRef.current.volume = next
      videoRef.current.muted = next === 0
    }
  }

  const seek = (event) => {
    const value = Number(event.target.value)
    setCurrentTime(value)
    if (videoRef.current) videoRef.current.currentTime = value
  }

  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <motion.div
      className="fixed inset-0 z-[120] flex flex-col bg-black/96 px-4 py-4 sm:px-8 sm:py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Now playing: ${current.title}`}
        className="mx-auto flex h-full w-full max-w-[1200px] flex-col"
        initial={{ opacity: 0, scale: 0.985, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.985, y: 12 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-cinematic text-brand">
              {current.categoryLabel} — {formatDuration(current.duration)}
            </p>
            <h2 className="mt-1 truncate font-display text-lg font-semibold uppercase tracking-wide text-white sm:text-2xl">
              {current.title}
            </h2>
            <p className="mt-1 truncate text-[11px] text-white/40">{current.originalName}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close video player"
            className={CONTROL_CLASS}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center py-4">
          <div ref={frameRef} className="relative flex h-full w-full items-center justify-center bg-black">
            {failed ? (
              <div className="flex flex-col items-center gap-3 px-6 text-center">
                <p className="font-display text-xl uppercase tracking-wide">This video could not be loaded</p>
                <p className="text-sm text-muted">{current.originalName}</p>
                <button type="button" onClick={() => navigate(1)} className="mt-2 border border-brand px-5 py-2 text-xs uppercase tracking-cinematic text-brand">
                  Next video
                </button>
              </div>
            ) : (
              <video
                ref={videoRef}
                className="max-h-full max-w-full object-contain"
                poster={assetPath(current.poster)}
                playsInline
                preload="auto"
                onError={() => setFailed(true)}
                onClick={togglePlay}
              >
                <source src={assetPath(current.src)} type="video/mp4" />
                Your browser does not support HTML5 video.
              </video>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={Math.min(currentTime, duration || 0)}
            onChange={seek}
            aria-label="Video progress"
            className="h-1 w-full cursor-pointer appearance-none bg-white/20 accent-brand"
            style={{ background: `linear-gradient(to right, #299DD5 ${progress}%, rgba(255,255,255,0.2) ${progress}%)` }}
          />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button type="button" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'} className={CONTROL_CLASS}>
                {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
              </button>
              <button type="button" onClick={replay} aria-label="Replay video" className={CONTROL_CLASS}>
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
              </button>
              <button type="button" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'} className={CONTROL_CLASS}>
                {muted ? <VolumeX className="h-4 w-4" aria-hidden="true" /> : <Volume2 className="h-4 w-4" aria-hidden="true" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={muted ? 0 : volume}
                onChange={changeVolume}
                aria-label="Volume"
                className="hidden h-1 w-20 cursor-pointer appearance-none bg-white/20 accent-brand sm:block"
              />
              <span className="ml-2 text-xs tabular-nums text-white/60">
                {formatDuration(currentTime)} / {formatDuration(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button type="button" onClick={() => navigate(-1)} aria-label="Previous video" className={CONTROL_CLASS}>
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => navigate(1)} aria-label="Next video" className={CONTROL_CLASS}>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button type="button" onClick={toggleFullscreen} aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} className={CONTROL_CLASS}>
                <Maximize2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
          <p className="mt-3 hidden text-[10px] uppercase tracking-cinematic text-white/30 md:block">
            Esc close · Arrow keys navigate · Space play/pause
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
