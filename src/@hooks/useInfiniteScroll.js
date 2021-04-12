import { useCallback, useEffect, useMemo, useState } from 'react'

const noop = () => {}

const useInfiniteScroll = ({
  onScroll = noop,
  initialCount = 0,
  isPaused,
  maxScrollCount,
  scrollBuffer = 40,
}) => {
  const [count, setCount] = useState(initialCount)
  const isMaxScrollReached = useMemo(() => count >= maxScrollCount, [
    count,
    maxScrollCount,
  ])

  const isBottom = useCallback(
    el => {
      return el.scrollTop + el.clientHeight + scrollBuffer >= el.scrollHeight
    },
    [scrollBuffer]
  )

  useEffect(() => {
    const getScrollContainer = () => document.getElementById('root')
    const trackScrolling = () => {
      setTimeout(() => {
        if (isBottom(getScrollContainer()) && !isPaused && !isMaxScrollReached) {
          onScroll()
          setCount(count + 1)
        }
      })
    }

    getScrollContainer().addEventListener('scroll', trackScrolling)
    trackScrolling()
    return () => {
      getScrollContainer().removeEventListener('scroll', trackScrolling)
    }
  }, [count, isMaxScrollReached, isPaused, onScroll, setCount, isBottom])

  const resetScroll = useCallback(() => {
    setCount(0)
  }, [setCount])

  return {
    resetScroll,
    isMaxScrollReached,
  }
}

export default useInfiniteScroll
