import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'

import { createUseStyles } from '@physna/voxel-ui/@style'
import { Title, HeaderLevel } from '@physna/voxel-ui/@atoms/Typography'

import { Spacer, OverlayWrapper } from '@components'
import { useCurrentUser, useOverlay } from '@hooks'
import { MultiLineBodyText } from '@components/Text/Body'

import { ReactComponent as NewVersionIcon } from '@svg/new-version-published.svg'

const useStyles = createUseStyles(_theme => {
  return {
    VersionPublished: {},
    VersionPublished_title: {
      lineHeight: '1.75rem',
    },
  }
})

const VersionPublished = ({ modelId }) => {
  const c = useStyles()
  const history = useHistory()
  const { atom: user = {} } = useCurrentUser()
  const { data: userData } = user
  const { setOverlayOpen } = useOverlay()

  const handleViewModel = useCallback(() => {
    history.push(`/mythangs/file/${modelId}`)
    setOverlayOpen(false)
  }, [history, modelId, setOverlayOpen])

  const handleClose = useCallback(() => {
    setOverlayOpen(false)
  }, [setOverlayOpen])

  return (
    <OverlayWrapper
      overlayHeader={'New Version Published'}
      onCancel={handleClose}
      onContinue={handleViewModel}
      cancelText={'Close'}
      continueText={'View Model'}
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
      <MultiLineBodyText>
        Your changes can now be viewed on your model page
      </MultiLineBodyText>
    </OverlayWrapper>
  )
}

export default VersionPublished
