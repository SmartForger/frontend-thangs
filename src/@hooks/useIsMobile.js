import { useEffect, useState } from 'react'

export default breakpoint => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const resizeHandler = () => {
      setIsMobile(window.innerWidth < (breakpoint || 842))
    }

    window.addEventListener('resize', resizeHandler)

    resizeHandler()

    return () => {
      window.removeEventListener('resize', resizeHandler)
    }
  }, [])

  return isMobile
}
