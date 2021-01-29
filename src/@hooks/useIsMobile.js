import { useContext, useEffect, useState } from 'react'

export default () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const resizeHandler = () => {
      setIsMobile(window.innerWidth < 842)
    }

    window.addEventListener('resize', resizeHandler)

    resizeHandler()

    return () => {
      window.removeEventListener('resize', resizeHandler)
    }
  }, [])

  return isMobile
}
