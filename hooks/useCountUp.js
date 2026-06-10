'use client'
import { useState, useEffect, useRef } from 'react'

export function useCountUp(end, duration = 1200, enabled = true) {
  const [count, setCount] = useState(0)
  const prevEnd = useRef(null)

  useEffect(() => {
    if (!enabled || end == null) return
    if (prevEnd.current === end) return
    prevEnd.current = end

    let startTime = null
    const startValue = 0

    function step(timestamp) {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(startValue + (end - startValue) * eased))
      if (progress < 1) requestAnimationFrame(step)
      else setCount(end)
    }

    requestAnimationFrame(step)
  }, [end, duration, enabled])

  return count
}
