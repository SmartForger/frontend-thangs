import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { useCurrentUserId } from '@hooks'
import { ToggleFollowButton } from '@components'
import * as types from '@constants/storeEventTypes'

const useStyles = createUseStyles(theme => {
  return {
    ProfileButton: {
      ...theme.text.linkText,
      display: 'block',
      textDecoration: 'none',
    },
  }
})

const ProfileButton = ({ userId, className }) => {
  const c = useStyles()
  const currentUserId = useCurrentUserId()
  const { dispatch } = useStoreon()
  const isCurrentUser = currentUserId === userId
  const openSignupOverlay = useCallback(
    titleMessage => {
      dispatch(types.OPEN_OVERLAY, {
        overlayName: 'signUp',
        overlayData: {
          animateIn: true,
          windowed: true,
          titleMessage,
        },
      })
    },
    [dispatch]
  )
  if (isCurrentUser) {
    return (
      <Link className={classnames(className, c.ProfileButton)} to='/profile/edit'>
        Edit Profile
      </Link>
    )
  } else {
    return (
      <ToggleFollowButton
        profileUserId={userId}
        currentUser={currentUserId}
        openSignupOverlay={openSignupOverlay}
      />
    )
  }
}

export default ProfileButton
