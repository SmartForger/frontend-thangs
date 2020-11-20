import React from 'react'
import { ProfilePicture } from '@components'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { truncateString } from '@utilities'

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

      lineHeight: '0.5rem',
      fontSize: '0.75rem',
      fontWeight: '500',
      color: theme.colors.purple[900],
    },
    UserInline_SearchResult: {
      color: theme.colors.grey[300],
      lineHeight: '1rem',
      fontWeight: '600',
      fontSize: '1rem',
    },
  }
})

const UserInline = ({
  user = {},
  className,
  size = '1.75rem',
  isSearchResult,
  maxLength,
}) => {
  const c = useStyles({})
  let userName = truncateString(user.username, maxLength || 20)
  return (
    <div className={classnames(className, c.UserInline)}>
      <ProfilePicture
        size={size}
        name={user.fullName}
        userName={user.username}
        src={(user.profile && user.profile.avatarUrl) || user.avatarUrl}
      />
      <span
        className={classnames(c.UserInline_Info, {
          [c.UserInline_SearchResult]: isSearchResult,
        })}
      >
        {userName}
      </span>
    </div>
  )
}

export default UserInline
