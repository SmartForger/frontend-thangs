import React, { useCallback } from 'react'
import { useStoreon } from 'storeon/react'
import { useCurrentUserId } from '@hooks'
import { ToggleFollowButton } from '@components'
import * as types from '@constants/storeEventTypes'
import { track } from '@utilities/analytics'

const ProfileButton = ({ user, userId, className }) => {
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
      track('SignUp Prompt Overlay', { source: 'Follow' })
    },
    [dispatch]
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
