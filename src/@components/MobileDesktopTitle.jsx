import React from 'react'
import { TitleSecondary, TitleTertiary } from './Text'
import useDeviceDetect from '../@hooks/useDeviceDetect'

const MobileDesktopTitle = ({ children }) => {
  const { isMobile } = useDeviceDetect()

  return (
    <>
      {isMobile ? (
        <TitleSecondary>{children}</TitleSecondary>
      ) : (
        <TitleTertiary>{children}</TitleTertiary>
      )}
    </>
  )
}
export default MobileDesktopTitle
