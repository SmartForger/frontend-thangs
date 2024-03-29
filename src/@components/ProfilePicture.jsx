import React, { useMemo } from 'react'
import Avatar from 'react-avatar'
import classnames from 'classnames'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { ReactComponent as UserIcon } from '@svg/icon-user.svg'

const useStyles = createUseStyles(theme => {
  return {
    ProfilePicture: {
      flex: 'none',
      '& span': {
        ...theme.text.avatarDefaultText,
      },
      boxSizing: 'border-box',
      '& img': {
        border: ({ bordered }) =>
          bordered ? `1px solid ${theme.colors.white[400]}` : 'none',
      },
    },
    ProfilePicture_alt: {
      width: ({ size }) => size || '1.875rem',
      height: ({ size }) => size || '1.875rem',
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
  bordered,
  title = undefined,
}) => {
  const c = useStyles({ bordered, size })
  const nameToUse = useMemo(() => {
    // API is returning blank space as name. TODO: Flatten data returned by backend
    if (!name || name.replace(/\s/g, '') === '') return userName
    return name
  }, [name, userName])

  return src || nameToUse ? (
    <Avatar
      title={title}
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
