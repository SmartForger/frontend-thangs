import React from 'react'
import Avatar from 'react-avatar'
import { avatarDefaultText } from '@style/text'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(_theme => {
  return {
    ProfilePicture: {
      '& span': {
        ...avatarDefaultText,
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
  return (
    <Avatar
      name={name}
      src={src}
      color={color}
      size={size}
      round={true}
      className={classnames(className, c.ProfilePicture)}
      maxInitials={2}
    />
  )
}
