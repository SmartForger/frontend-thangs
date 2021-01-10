import React, { useCallback } from 'react'
import { useStoreon } from 'storeon/react'
import { useCurrentUserId, useOverlay } from '@hooks'
import { ToggleFollowButton } from '@components'
import * as types from '@constants/storeEventTypes'
import { track } from '@utilities/analytics'

const ProfileButton = ({ user, userId, className }) => {
  const currentUserId = useCurrentUserId()
  const { dispatch } = useStoreon()
  const { setOverlay } = useOverlay()
  const isCurrentUser = currentUserId === userId
  const openSignupOverlay = useCallback(
    (titleMessage, source) => {
      setOverlay({
        isOpen: true,
        template: 'signUp',
        data: {
          animateIn: true,
          windowed: true,
          titleMessage,
          smallWidth: true,
          source,
        },
      })
      track('SignUp Prompt Overlay', { source: 'Follow' })
    },
    [setOverlay]
  )
  if (isCurrentUser) {
    return null
  } else {
    const isFollowing = (user || {}).isBeingFollowedByRequester

    return (
      <ToggleFollowButton
        className={className}
        profileUserId={userId}
        currentUser={currentUserId}
        isFollowing={isFollowing}
        onActionStarted={() => {
          dispatch(types.LOCAL_INVERT_FOLLOW_USER, {
            id: userId,
          })
        }}
        onActionFailured={() => {
          dispatch(types.LOCAL_INVERT_FOLLOW_USER, {
            id: userId,
          })
        }}
        openSignupOverlay={openSignupOverlay}
      />
    )
  }
}

export default ProfileButton
