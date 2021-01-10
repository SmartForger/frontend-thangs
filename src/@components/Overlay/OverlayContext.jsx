import React from 'react'
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
      <Overlay />
      {children}
    </Provider>
  )
}

export { OverlayContext, OverlayProvider }
