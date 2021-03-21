import { useCallback, useEffect, useMemo, useState } from 'react'

const noop = () => {}

// Using the boundingRect so we can get the decimal value for the root height, and then rounding up the scroll top so we always have a 0-1 px buffer for browser wonkiness
const isBottom = el =>
  Math.ceil(el.scrollTop) + el.getBoundingClientRect().height >= el.scrollHeight

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
