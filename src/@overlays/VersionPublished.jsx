import React, { useCallback, useEffect, useState } from 'react'
import { Compare, Spacer, Textarea, OverlayWrapper } from '@components'
import { useHistory } from 'react-router-dom'
import { createUseStyles } from '@style'
import { useCurrentUser, useOverlay } from '@hooks'
import { TitleTertiary } from '@components/Text/Title'
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
    history.push(`/model/${modelId}`)
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
      <TitleTertiary className={c.VersionPublished_title}>{`Well done ${
        userData.firstName || userData.username
      }, your changes have been published!`}</TitleTertiary>
      <Spacer size={'.5rem'} />
      <MultiLineBodyText>
        Your changes can now be viewed on your model page
      </MultiLineBodyText>
    </OverlayWrapper>
  )
}

export default VersionPublished
