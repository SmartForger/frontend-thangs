import React from 'react'
import Avatar from 'react-avatar'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { ReactComponent as UserIcon } from '@svg/icon-user.svg'

const useStyles = createUseStyles(theme => {
  return {
    ProfilePicture: {
      '& span': {
        ...theme.mixins.text.avatarDefaultText,
      },
    },
  }
})

const DEFAULT_AVATAR_SIZE = '15.5rem'
const DEFAULT_AVATAR_COLOR = '#616168'

export function ProfilePicture({
  className,
  name,
  src,
  _user,
  size = DEFAULT_AVATAR_SIZE,
  color = DEFAULT_AVATAR_COLOR,
}) {
  const c = useStyles()
  return src ? (
    <Avatar
      name={name}
      src={src}
      color={color}
      size={size}
      round={true}
      className={classnames(className, c.ProfilePicture)}
      maxInitials={2}
    />
  ) : (
    <UserIcon />
  )
}
