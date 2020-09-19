import React, { useCallback } from 'react'
import { useStoreon } from 'storeon/react'
import { useCurrentUserId } from '@hooks'
import { Button, ToggleFollowButton } from '@components'
import * as types from '@constants/storeEventTypes'
import * as pendo from '@vendors/pendo'

const noop = () => null
const ProfileButton = ({ userId, className, onEditClick = noop }) => {
  const currentUserId = useCurrentUserId()
  const { dispatch } = useStoreon()
  const isCurrentUser = currentUserId === userId
  const openSignupOverlay = useCallback(
    (titleMessage, source) => {
      dispatch(types.OPEN_OVERLAY, {
        overlayName: 'signUp',
        overlayData: {
          animateIn: true,
          windowed: true,
          titleMessage,
          source,
        },
      })
      pendo.track('SignUp Prompt Overlay', { source: 'Timed' })
    },
    [dispatch]
  )
  if (isCurrentUser) {
    return (
      <Button className={className} secondary onClick={onEditClick}>
        Edit Profile
      </Button>
    )
  } else {
    return (
      <ToggleFollowButton
        className={className}
        profileUserId={userId}
        currentUser={currentUserId}
        openSignupOverlay={openSignupOverlay}
      />
    )
  }
}

export default ProfileButton
