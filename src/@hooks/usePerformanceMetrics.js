import { useCallback, useRef } from 'react'

const usePerformanceMetrics = () => {
  const startTime = useRef(null)

  const startTimer = useCallback(() => {
    startTime.current = new Date()
  }, [])

  const getTime = useCallback(() => {
    var endTime = new Date()
    return (endTime.getTime() - startTime.current.getTime()) / 1000
  }, [])

  return {
    startTimer,
    getTime,
  }
}

export default usePerformanceMetrics
