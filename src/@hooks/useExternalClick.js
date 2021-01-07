import { useEffect } from 'react'

const useExternalClick = (ref, callback) => {
  useEffect(() => {
    if (!ref) return () => null
    const handleClick = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        callback()
      }
    }

    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [callback, ref])
}

export default useExternalClick
