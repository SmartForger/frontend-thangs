import React, { useCallback } from 'react'
import { useStoreon } from 'storeon/react'
import { useCurrentUserId } from '@hooks'
import { ToggleFollowButton } from '@components'
import * as types from '@constants/storeEventTypes'
import { track } from '@utilities/analytics'

const ProfileButton = ({ user, userId, className }) => {
  const currentUserId = useCurrentUserId()
  const { dispatch } = useStoreon()
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

export default ProfileButton
