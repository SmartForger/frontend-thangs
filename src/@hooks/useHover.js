import { useEffect, useRef, useState } from 'react'

const useHover = () => {
  const [value, setValue] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const handleMouseOver = () => setValue(true)
    const handleMouseOut = () => setValue(false)
    const element = ref && ref.current
    if (element) {
      element.addEventListener('mouseenter', handleMouseOver)
      element.addEventListener('mouseleave', handleMouseOut)
      return () => {
        element.removeEventListener('mouseenter', handleMouseOver)
        element.removeEventListener('mouseleave', handleMouseOut)
      }
    }
  }, [ref])
  return [ref, value]
}

export default useHover
