import { useEffect, useMemo } from 'react'
import { debounce } from 'lodash'

const getSavedPosition = key => {
  try {
    const data = JSON.parse(localStorage.getItem(key)) || {}
    return {
      sort: data.sortBy || 'trending',
      scroll: data.scroll || 0,
    }
  } catch (err) {
    return {
      sort: 'trending',
      scroll: 0,
    }
  }
}

const usePageScroll = (key, pageLoaded, sortBy) => {
  useEffect(() => {
    const el = document.getElementById('root')

    const scrollHandler = debounce(() => {
      if (pageLoaded) {
        localStorage.setItem(
          key,
          JSON.stringify({
            scroll: el.scrollTop,
            sortBy,
          })
        )
      }
    }, 300)
    el.addEventListener('scroll', scrollHandler)

    if (pageLoaded) {
      const el = document.getElementById('root')
      const { scroll, sort } = getSavedPosition(key)
      if (sort === sortBy) {
        el.scrollTop = scroll
      }
    }

    return () => {
      el.removeEventListener('scroll', scrollHandler)
    }
  }, [key, pageLoaded, sortBy])

  return useMemo(() => {
    const { scroll, sort } = getSavedPosition(key)
    return sort === sortBy ? Math.floor((scroll + 115) / 1938) + 1 : 1
  }, [key, sortBy])
}

export default usePageScroll
