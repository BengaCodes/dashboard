import { useEffect, useRef, useState } from 'react'

function useCountUp(target: number, duration = 650): number {
  const [current, setCurrent] = useState(0)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    const start = performance.now()
    cancelAnimationFrame(frameRef.current)

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setCurrent(target * eased)
      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        setCurrent(target)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target, duration])

  return current
}

export default useCountUp
