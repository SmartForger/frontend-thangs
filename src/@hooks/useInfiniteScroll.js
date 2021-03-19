import { useCallback, useEffect, useMemo, useState } from 'react'

const noop = () => {}

const isBottom = el => el.scrollTop + el.clientHeight >= el.scrollHeight

const useInfiniteScroll = ({
  onScroll = noop,
  initialCount = 0,
  isPaused,
  maxScrollCount,
}) => {
  const [count, setCount] = useState(initialCount)
  const isMaxScrollReached = useMemo(() => count >= maxScrollCount, [
    count,
    maxScrollCount,
  ])

  useEffect(() => {
    const el = document.getElementById('root')
    const trackScrolling = () => {
      if (isBottom(el) && !isPaused && !isMaxScrollReached) {
        onScroll()
        setCount(count + 1)
      }
    }

    el.addEventListener('scroll', trackScrolling)
    trackScrolling()
    return () => {
      el.removeEventListener('scroll', trackScrolling)
    }
  }, [count, isMaxScrollReached, isPaused, onScroll, setCount])

  const resetScroll = useCallback(() => {
    setCount(0)
  }, [setCount])

  return {
    resetScroll,
    isMaxScrollReached,
  }
}

export default useInfiniteScroll
