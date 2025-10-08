import { useEffect, useRef } from 'react'

type UseIntervalCallback = () => void

type UseIntervalDelay = number | null

const useInterval = (callback: UseIntervalCallback, delay: UseIntervalDelay) => {
  const savedCallback = useRef<UseIntervalCallback | null>(null)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) {
      return undefined
    }

    const tick = () => {
      savedCallback.current?.()
    }

    const id = window.setInterval(tick, delay)

    return () => window.clearInterval(id)
  }, [delay])
}

export default useInterval
