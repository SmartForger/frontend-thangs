import { useCallback, useEffect, useMemo, useState } from 'react'

const noop = () => {}

// Using the boundingRect so we can get the decimal value for the root height, and then adding a 1px buffer
const isBottom = el => el.scrollTop + el.clientHeight + 40 >= el.scrollHeight

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
