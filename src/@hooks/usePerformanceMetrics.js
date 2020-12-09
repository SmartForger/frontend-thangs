import { useCallback, useRef } from 'react'

const usePerformanceMetrics = () => {
  const startTime = useRef(null)

  const startTimer = useCallback(() => {
    startTime.current = new Date()
  }, [])

  const getTime = useCallback(() => {
    if (!startTime.current || typeof startTime.current.getTime !== 'function') return 0
    var endTime = new Date()
    return (endTime.getTime() - startTime.current.getTime()) / 1000
  }, [])

  return {
    startTimer,
    getTime,
  }
}

export default usePerformanceMetrics
