import React from 'react'
import { ProfilePicture } from './ProfilePicture'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(_theme => {
  return {
    UserContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    Info: {
      marginLeft: '1rem',
      flexGrow: 1,
    },
  }
})

export const UserInline = ({
  user,
  className,
  displayEmail,
  size = '1.5rem',
  children,
}) => {
  const c = useStyles()
  const classNames = classnames(className, c.UserContainer)
  return (
    <div className={classNames}>
      <ProfilePicture size={size} name={user.fullName} src={user.profile.avatarUrl} />
      <span className={c.Info}>
        <div>{user.fullName}</div>
        {displayEmail && <div>{user.email}</div>}
      </span>
      {children}
    </div>
  )
}
