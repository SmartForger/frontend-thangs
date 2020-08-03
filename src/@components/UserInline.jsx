import React from 'react'
import { ProfilePicture } from './ProfilePicture'
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
      marginLeft: '1rem',
      flexGrow: 1,
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

export const UserInline = ({
  user,
  className,
  displayEmail,
  size = '1.5rem',
  children,
  suffix,
}) => {
  const c = useStyles()
  return (
    <div className={className}>
      <div className={c.UserInline}>
        <ProfilePicture
          size={size}
          name={user.fullName}
          src={user && user.profile && user.profile.avatarUrl}
        />
        <span className={c.UserInline_Info}>
          <div
            className={classnames({
              [c.UserInline_SmallName]: displayEmail,
            })}
          >
            {user.fullName}
          </div>
          {suffix && <span className={c.UserInline_Suffix}>{suffix}</span>}
          {displayEmail && <div className={c.UserInline_Email}>{user.email}</div>}
        </span>
      </div>
      {children}
    </div>
  )
}
