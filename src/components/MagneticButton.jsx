import { motion, useMotionValue, useSpring } from 'framer-motion'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js'

const BASE_CLASS = 'relative inline-flex min-h-[46px] items-center justify-center gap-2 overflow-hidden border px-6 text-[11px] font-semibold uppercase tracking-cinematic transition-colors duration-300'

const VARIANTS = {
  primary: 'border-brand bg-brand text-ink hover:bg-transparent hover:text-brand',
  outline: 'border-white/35 bg-transparent text-white hover:border-brand hover:text-brand',
  text: 'border-transparent px-0 text-white/70 hover:text-brand',
}

export default function MagneticButton({
  as = 'button',
  href,
  onClick,
  variant = 'primary',
  className = '',
  children,
  type = 'button',
  ...rest
}) {
  const reducedMotion = usePrefersReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 240, damping: 18 })
  const springY = useSpring(y, { stiffness: 240, damping: 18 })

  const handleMove = (event) => {
    if (reducedMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - rect.left - rect.width / 2) * 0.16)
    y.set((event.clientY - rect.top - rect.height / 2) * 0.16)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  const Component = as === 'a' ? motion.a : motion.button
  const componentProps = as === 'a'
    ? { href }
    : { type, onClick }

  return (
    <Component
      {...componentProps}
      {...rest}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={reducedMotion ? undefined : { x: springX, y: springY }}
      className={`${BASE_CLASS} ${VARIANTS[variant] || VARIANTS.primary} ${className}`}
    >
      {children}
    </Component>
  )
}
