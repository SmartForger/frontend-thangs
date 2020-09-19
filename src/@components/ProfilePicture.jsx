import React, { useMemo } from 'react'
import Avatar from 'react-avatar'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { ReactComponent as UserIcon } from '@svg/icon-user.svg'

const useStyles = createUseStyles(theme => {
  return {
    ProfilePicture: {
      '& span': {
        ...theme.text.avatarDefaultText,
      },
    },
    ProfilePicture_alt: {
      width: '3rem',
      height: '3rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }
})

const DEFAULT_AVATAR_SIZE = '15.5rem'
const DEFAULT_AVATAR_COLOR = '#616168'

const ProfilePicture = ({
  className,
  name,
  userName,
  src,
  size = DEFAULT_AVATAR_SIZE,
  color = DEFAULT_AVATAR_COLOR,
}) => {
  const c = useStyles()
  const nameToUse = useMemo(() => {
    if (!name || name.replace(/\s/g, '') === '') return userName
    return name
  }, [name, userName])

  return src || nameToUse ? (
    <Avatar
      name={nameToUse}
      src={src}
      color={color}
      size={size}
      round={true}
      className={classnames(className, c.ProfilePicture)}
      maxInitials={2}
    />
  ) : (
    <UserIcon className={classnames(className, c.ProfilePicture_alt)} />
  )
}

export default ProfilePicture
