import { useContext, createContext } from 'react'

export const OverlayContext = createContext()

export const useOverlay = () => useContext(OverlayContext) || {}
