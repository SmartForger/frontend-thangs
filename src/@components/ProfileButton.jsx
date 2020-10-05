import React, { useCallback } from 'react'
import { useStoreon } from 'storeon/react'
import { useCurrentUserId } from '@hooks'
import { Button, ToggleFollowButton } from '@components'
import * as types from '@constants/storeEventTypes'
import { track } from '@utilities/analytics'

const noop = () => null
const ProfileButton = ({ user, userId, className, onEditClick = noop }) => {
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
      track('SignUp Prompt Overlay', { source: 'Timed' })
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
        profileUser={user}
        profileUserId={userId}
        currentUser={currentUserId}
        openSignupOverlay={openSignupOverlay}
      />
    )
  }
}

export default ProfileButton
