import React from 'react'
import { ProfilePicture } from '@components'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Contributors: {
      display: 'flex',
    },
    Contributors_Avatar: {
      backgroundColor: theme.colors.white[400],
      borderRadius: '100%',
      position: 'relative',
      '&:not(:first-child)': {
        marginLeft: '-.5rem',
      },
      '& span': {
        fontWeight: 500,
        fontSize: '.75rem',
        lineHeight: '1rem',
        borderRadius: '100%',
        border: `1px solid ${theme.colors.white[400]}`,

        '& span': {
          border: 'none',
        },
      },
    },
  }
})

const Contributors = ({ fileId, users = [], displayLength = 2 }) => {
  const c = useStyles({})
  let confirmedContributors = users.filter(user => user.fullName)
  return (
    <div className={c.Contributors}>
      {users.map((user, index) => {
        if (!user.fullName && !user.username) return null
        if (index === displayLength && confirmedContributors.length > displayLength + 1) {
          let undisplayedUserCount = `+ ${confirmedContributors.length - displayLength}`
          let undisplayedUserList = confirmedContributors
            .slice(displayLength)
            .map(user => user.fullName)
            .join('\n')
          return (
            <div key={`${fileId}_${user.id}_${index}`} className={c.Contributors_Avatar}>
              <ProfilePicture
                size='1.875rem'
                name={undisplayedUserCount}
                title={undisplayedUserList}
                bordered
              />
            </div>
          )
        }
        if (index > displayLength) return null
        return (
          <div key={`${fileId}_${user.id}_${index}`} className={c.Contributors_Avatar}>
            <ProfilePicture
              size='1.875rem'
              name={user.fullName}
              userName={user.username}
              src={user.profile.avatarUrl}
              bordered
            />
          </div>
        )
      })}
    </div>
  )
}

export default Contributors
