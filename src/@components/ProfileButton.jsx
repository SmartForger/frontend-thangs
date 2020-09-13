import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { useCurrentUserId } from '@hooks'
import { ToggleFollowButton } from '@components'

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
  const isCurrentUser = currentUserId === userId

  if (isCurrentUser) {
    return (
      <Link className={classnames(className, c.ProfileButton)} to='/profile/edit'>
        Edit Profile
      </Link>
    )
  } else {
    return <ToggleFollowButton profileUserId={userId} currentUser={currentUserId} />
  }
}

export default ProfileButton
