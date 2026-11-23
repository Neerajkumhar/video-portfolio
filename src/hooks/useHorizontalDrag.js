import { useCallback, useRef, useState } from 'react'

export function useHorizontalDrag(ref) {
  const [isDragging, setIsDragging] = useState(false)
  const state = useRef({ active: false, startX: 0, startScroll: 0, pointerId: null })

  const onPointerDown = useCallback((event) => {
    const element = ref.current
    if (!element || event.pointerType === 'touch' || (event.pointerType === 'mouse' && event.button !== 0)) return
    state.current = {
      active: true,
      startX: event.clientX,
      startScroll: element.scrollLeft,
      pointerId: event.pointerId,
    }
    setIsDragging(true)
    element.setPointerCapture?.(event.pointerId)
  }, [ref])

  const onPointerMove = useCallback((event) => {
    const element = ref.current
    if (!element || !state.current.active || state.current.pointerId !== event.pointerId) return
    element.scrollLeft = state.current.startScroll - (event.clientX - state.current.startX)
  }, [ref])

  const endDrag = useCallback((event) => {
    const element = ref.current
    if (!state.current.active) return
    element?.releasePointerCapture?.(state.current.pointerId)
    state.current.active = false
    state.current.pointerId = null
    setIsDragging(false)
  }, [ref])

  return {
    isDragging,
    dragHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onLostPointerCapture: endDrag,
    },
  }
}
