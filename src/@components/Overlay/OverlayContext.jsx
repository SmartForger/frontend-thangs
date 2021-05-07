import React, { useEffect } from 'react'
import { useOverlayProvider } from '@hooks'
import { Overlay } from '@components'

let OverlayContext
let { Provider } = (OverlayContext = React.createContext())

const OverlayProvider = ({ children }) => {
  const {
    setOverlay,
    setOverlayOpen,
    setOverlayHidden,
    setOverlayTemplate,
    setOverlayData,
    toggleOverlayOpen,
    OverlayComponent,
    overlayData,
    isOverlayOpen,
    isOverlayHidden,
  } = useOverlayProvider()

  useEffect(() => {
    let timer
    if (overlayData?.shake) {
      timer = setTimeout(() => {
        setOverlayData({
          shake: false,
        })
        timer = null
      }, 900)
    }

    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [overlayData.shake, setOverlayData])

  return (
    <Provider
      value={{
        setOverlay,
        setOverlayOpen,
        setOverlayHidden,
        setOverlayTemplate,
        setOverlayData,
        toggleOverlayOpen,
        OverlayComponent,
        overlayData,
        isOverlayOpen,
        isOverlayHidden,
      }}
    >
      <Overlay shake={overlayData.shake} />
      {children}
    </Provider>
  )
}

export { OverlayContext, OverlayProvider }
