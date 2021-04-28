import { useEffect } from 'react'

const useExternalClick = (ref, callback) => {
  useEffect(() => {
    if (!ref) return () => null
    const handleClick = e => {
      if (ref.length) {
        const result = ref.every(
          elRef => !elRef.current || !elRef.current.contains(e.target)
        )
        if (result) {
          callback()
        }
      } else {
        if (ref.current && !ref.current.contains(e.target)) {
          callback()
        }
      }
    }

    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [callback, ref])
}

export default useExternalClick
