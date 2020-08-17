import React from 'react'
import { ProfilePicture } from '@components'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    UserInline: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    UserInline_Info: {
      marginLeft: '.5rem',
      flexGrow: 1,
      fontSize: '1rem',
      fontWeight: '600',
      color: theme.colors.black[500],
    },
    UserInline_SmallName: {
      ...theme.mixins.text.linkText,
      fontSize: '.75rem',
    },
    UserInline_Suffix: {
      ...theme.mixins.text.footerText,
      fontSize: '.75rem',
    },
  }
})

const UserInline = ({
  user,
  className,
  displayEmail,
  size = '1.75rem',
  children,
  suffix,
}) => {
  const c = useStyles()
  let userName =
    (user && user.fullName) || (user && user.profile && user.profile.fullName)
  if (userName && userName.length > 20) userName = userName.slice(0, 20) + '...'
  return (
    <div className={className}>
      <div className={c.UserInline}>
        <ProfilePicture
          size={size}
          name={userName}
          src={user && user.profile && user.profile.avatarUrl}
        />
        <span className={c.UserInline_Info}>
          <div
            className={classnames({
              [c.UserInline_SmallName]: displayEmail,
            })}
          >
            {userName}
          </div>
          {suffix && <span className={c.UserInline_Suffix}>{suffix}</span>}
          {displayEmail && <div className={c.UserInline_Email}>{user.email}</div>}
        </span>
      </div>
      {children}
    </div>
  )
}

export default UserInline
