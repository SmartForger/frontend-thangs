import React, { useCallback } from 'react'

import { createUseStyles } from '@physna/voxel-ui/@style'
import { Body, Title, HeaderLevel } from '@physna/voxel-ui/@atoms/Typography'

import { Spacer, OverlayWrapper } from '@components'
import { useCurrentUser, useOverlay } from '@hooks'

import { ReactComponent as NewVersionIcon } from '@svg/new-version-published.svg'

const useStyles = createUseStyles(_theme => {
  return {
    VersionPublished: {},
    VersionPublished_title: {
      lineHeight: '1.75rem',
    },
  }
})

const VersionPublished = () => {
  const c = useStyles()
  const { atom: user = {} } = useCurrentUser()
  const { data: userData } = user
  const { setOverlayOpen } = useOverlay()

  const handleClose = useCallback(() => {
    setOverlayOpen(false)
  }, [setOverlayOpen])

  return (
    <OverlayWrapper
      overlayHeader={'New Version Published'}
      onCancel={handleClose}
      cancelText={'Close'}
    >
      <NewVersionIcon />
      <Spacer size={'3rem'} />
      <Title
        headerLevel={HeaderLevel.tertiary}
        className={c.VersionPublished_title}
      >{`Well done ${
          userData.firstName || userData.username
        }, your changes have been published!`}</Title>
      <Spacer size={'.5rem'} />
      <Body multiline>Your changes can now be viewed on your model page</Body>
    </OverlayWrapper>
  )
}

export default VersionPublished
