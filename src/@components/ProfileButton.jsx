import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { useCurrentUserId } from '@hooks'

const useStyles = createUseStyles(theme => {
  return {
    ProfileButton: {
      ...theme.mixins.text.linkText,
      display: 'block',
      textDecoration: 'none',
    },
  }
})

const ProfileButton = ({ userId, className }) => {
  const c = useStyles()
  const isCurrentUser = useCurrentUserId() === userId

  if (isCurrentUser) {
    return (
      <Link className={classnames(className, c.ProfileButton)} to='/profile/edit'>
        Edit Profile
      </Link>
    )
  } else {
    // return <ToggleFollowButton viewedUser={{}} className={className} />
    return <div />
  }
}

export default ProfileButton
