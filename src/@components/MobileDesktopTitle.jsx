import React from 'react'
import { Title, HeaderLevel } from '@physna/voxel-ui/@atoms/Typography'

import useDeviceDetect from '@hooks/useDeviceDetect'

const MobileDesktopTitle = ({ children }) => {
  const { isMobile } = useDeviceDetect()

  return (
    <Title headerLevel={isMobile ? HeaderLevel.secondary : HeaderLevel.tertiary}>
      {children}
    </Title>
  )
}
export default MobileDesktopTitle
