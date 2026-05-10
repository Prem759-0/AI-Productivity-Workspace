import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const posRef = useRef({ x: 0, y: 0 })
  const targetRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Check for touch device
    if (window.matchMedia('(pointer: coarse)').matches) return

    const cursor = cursorRef.current
    if (!cursor) return

    const onMouseMove = (e) => {
      targetRef.current = { x: e.clientX, y: e.clientY }
    }

    const onMouseOver = (e) => {
      if (e.target.closest('a, button, [role="button"], input, textarea, select')) {
        cursor.classList.add('hovering')
      }
    }

    const onMouseOut = (e) => {
      if (e.target.closest('a, button, [role="button"], input, textarea, select')) {
        cursor.classList.remove('hovering')
      }
    }

    let rafId
    const animate = () => {
      posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.15
      posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.15
      cursor.style.left = posRef.current.x + 'px'
      cursor.style.top = posRef.current.y + 'px'
      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseout', onMouseOut)
    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout', onMouseOut)
      cancelAnimationFrame(rafId)
    }
  }, [])

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return <div ref={cursorRef} className="custom-cursor hidden md:block" aria-hidden="true" />
}
