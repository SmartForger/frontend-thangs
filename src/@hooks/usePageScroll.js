import { useEffect, useMemo } from 'react'
import { debounce } from 'lodash'

const getSavedPosition = key => {
  try {
    const data = JSON.parse(sessionStorage.getItem(key)) || {}
    return {
      sort: data.sortBy || 'trending',
      scroll: data.scroll || 0,
      term: data.searchTerm || '',
    }
  } catch (err) {
    return {
      sort: 'trending',
      scroll: 0,
      term: '',
    }
  }
}

const usePageScroll = (key, pageLoaded, sortBy, searchTerm) => {
  useEffect(() => {
    const el = document.getElementById('root')

    const scrollHandler = debounce(() => {
      if (pageLoaded) {
        sessionStorage.setItem(
          key,
          JSON.stringify({
            scroll: el.scrollTop,
            sortBy,
            searchTerm,
          })
        )
      }
    }, 300)
    el.addEventListener('scroll', scrollHandler)

    if (pageLoaded) {
      const el = document.getElementById('root')
      const { scroll, sort, term } = getSavedPosition(key)
      if (sort === sortBy) {
        if ((searchTerm && searchTerm === term) || !searchTerm) {
          el.scrollTop = scroll
        }
      }
    }

    return () => {
      el.removeEventListener('scroll', scrollHandler)
    }
  }, [key, pageLoaded, searchTerm, sortBy])

  return useMemo(() => {
    const { scroll, sort, term } = getSavedPosition(key)
    return sort === sortBy && term === searchTerm
      ? Math.floor((scroll + 115) / 1938) + 1
      : 1
  }, [key, searchTerm, sortBy])
}

export default usePageScroll
